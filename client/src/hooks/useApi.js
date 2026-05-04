import { useCallback, useEffect, useState } from "react";

function hasContent(value) {
  if (Array.isArray(value)) return value.length > 0;
  if (value && typeof value === "object") return Object.values(value).some(hasContent);
  return value !== null && value !== undefined && value !== "";
}

function mergeWithFallback(fallbackData, nextData) {
  if (!fallbackData || !nextData || Array.isArray(fallbackData) || Array.isArray(nextData) || typeof fallbackData !== "object" || typeof nextData !== "object") {
    return nextData;
  }

  const merged = { ...nextData };
  Object.entries(fallbackData).forEach(([key, fallbackValue]) => {
    if (!hasContent(nextData[key])) {
      merged[key] = fallbackValue;
    }
  });
  return merged;
}

export function useApi(loader, deps = [], options = {}) {
  const { fallbackData = null } = options;
  const [data, setData] = useState(fallbackData);
  const [loading, setLoading] = useState(!fallbackData);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(!fallbackData);
    setError("");
    try {
      const result = await loader();
      const nextData = result.data;
      if (fallbackData && !hasContent(nextData)) {
        setData(fallbackData);
      } else {
        setData(mergeWithFallback(fallbackData, nextData));
      }
    } catch (err) {
      if (fallbackData) {
        setData(fallbackData);
      } else {
        setError(err.response?.data?.message || err.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load, setData };
}
