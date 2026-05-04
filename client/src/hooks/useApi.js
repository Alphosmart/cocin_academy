import { useCallback, useEffect, useState } from "react";

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
      setData(result.data);
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
