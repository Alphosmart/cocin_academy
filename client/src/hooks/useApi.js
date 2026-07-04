import { useCallback, useEffect, useRef, useState } from "react";

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
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // New format wraps content as { data, savedAt }; tolerate the old raw format too.
    return parsed && typeof parsed === "object" && "savedAt" in parsed ? parsed.data : parsed;
  } catch {
    return null;
  }
}

function writeCache(cacheKey, data) {
  if (!cacheKey || typeof window === "undefined" || !hasContent(data)) return;
  try {
    window.localStorage.setItem(CACHE_PREFIX + cacheKey, JSON.stringify({ data, savedAt: Date.now() }));
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
  const { fallbackData = null, cacheKey = null, retryDelayMs = 5000, retryOnError = Boolean(cacheKey) } = options;
  const retryTimerRef = useRef(null);
  // Prefer the last admin-published content cached on this device; fall back to
  // bundled defaults only for first-ever visitors. Either way we render instantly.
  const initialCached = readCache(cacheKey);
  const initialData = hasContent(initialCached) ? mergeWithFallback(fallbackData, initialCached) : fallbackData;
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(!hasContent(initialData));
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const cachedData = readCache(cacheKey);
    const currentInitial = hasContent(cachedData) ? mergeWithFallback(fallbackData, cachedData) : fallbackData;
    setLoading(!hasContent(currentInitial));
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
      if (hasContent(currentInitial)) {
        // The backend may just be waking up (Render free tier sleeps). Keep showing
        // cached/bundled content and retry in the background until it responds.
        setData(currentInitial);
        if (retryOnError && typeof window !== "undefined") {
          window.clearTimeout(retryTimerRef.current);
          retryTimerRef.current = window.setTimeout(load, retryDelayMs);
        }
      } else {
        setError(err.response?.data?.message || err.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    load();
    return () => {
      if (typeof window !== "undefined") window.clearTimeout(retryTimerRef.current);
    };
  }, [load]);

  return { data, loading, error, reload: load, setData };
}
