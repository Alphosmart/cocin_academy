import { useCallback, useEffect, useState } from "react";

const CACHE_PREFIX = "cocin_cache:v1:";

function hasContent(value) {
  if (Array.isArray(value)) return value.length > 0;
  if (value && typeof value === "object") return Object.values(value).some(hasContent);
  return value !== null && value !== undefined && value !== "";
}

function readCache(cacheKey) {
  if (!cacheKey || typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CACHE_PREFIX + cacheKey);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeCache(cacheKey, value) {
  if (!cacheKey || typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CACHE_PREFIX + cacheKey, JSON.stringify(value));
  } catch {
    // storage full or unavailable (private mode) — caching is best-effort
  }
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
  const { fallbackData = null, cacheKey = null } = options;
  // Prefer the last admin-published content cached on this device; fall back to
  // bundled defaults only for first-ever visitors. Either way we render instantly.
  const cachedData = readCache(cacheKey);
  const initialData = hasContent(cachedData) ? cachedData : fallbackData;
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(!initialData);
    setError("");
    try {
      const result = await loader();
      const nextData = result.data;
      if (fallbackData && !hasContent(nextData)) {
        setData(fallbackData);
      } else {
        const merged = mergeWithFallback(fallbackData, nextData);
        setData(merged);
        if (hasContent(nextData)) writeCache(cacheKey, merged);
      }
    } catch (err) {
      if (initialData) {
        setData(initialData);
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
