const imagePattern = /\.(avif|gif|jpe?g|png|svg|webp)(\?|#|$)/i;
const videoPattern = /\.(m4v|mov|mp4|ogv|webm)(\?|#|$)/i;

function parseUrl(value) {
  const text = String(value || "").trim();
  if (!text) return null;
  try {
    return new URL(text);
  } catch {
    try {
      return new URL(`https://${text}`);
    } catch {
      return null;
    }
  }
}

function youtubeId(value) {
  const url = parseUrl(value);
  if (!url) return "";
  const host = url.hostname.toLowerCase();
  const parts = url.pathname.split("/").filter(Boolean);
  let id = "";

  if (host === "youtu.be") id = parts[0] || "";
  else if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
    if (["embed", "shorts", "live"].includes(parts[0])) id = parts[1] || "";
    else id = url.searchParams.get("v") || "";
  }

  return /^[A-Za-z0-9_-]{6,}$/.test(id) ? id : "";
}

function vimeoId(value) {
  const url = parseUrl(value);
  if (!url) return "";
  const host = url.hostname.toLowerCase();
  if (!host.endsWith("vimeo.com")) return "";
  const id = url.pathname.split("/").filter(Boolean).reverse().find((part) => /^\d+$/.test(part)) || "";
  return id;
}

export function getVideoEmbedUrl(value, { background = false } = {}) {
  const youtube = youtubeId(value);
  if (youtube) {
    const params = new URLSearchParams({
      rel: "0",
      modestbranding: "1",
      playsinline: "1"
    });
    if (background) {
      params.set("autoplay", "1");
      params.set("mute", "1");
      params.set("controls", "0");
      params.set("loop", "1");
      params.set("playlist", youtube);
    }
    return `https://www.youtube.com/embed/${youtube}?${params.toString()}`;
  }

  const vimeo = vimeoId(value);
  if (vimeo) {
    const params = new URLSearchParams({
      title: "0",
      byline: "0",
      portrait: "0"
    });
    if (background) {
      params.set("autoplay", "1");
      params.set("muted", "1");
      params.set("loop", "1");
      params.set("background", "1");
    }
    return `https://player.vimeo.com/video/${vimeo}?${params.toString()}`;
  }

  return "";
}

export function isDirectVideoUrl(value) {
  return videoPattern.test(String(value || ""));
}

export function detectMediaType(value, fallback = "image") {
  if (getVideoEmbedUrl(value) || isDirectVideoUrl(value)) return "video";
  if (imagePattern.test(String(value || ""))) return "image";
  return fallback || "image";
}

// --- Public-site helpers (preserved from cocin_ace) ---

export function getEmbedUrl(value, { autoplay = false } = {}) {
  const url = parseUrl(value);
  if (!url) return "";

  const ytId = youtubeId(value);
  if (ytId) {
    const params = new URLSearchParams({ rel: "0", playsinline: "1" });
    if (autoplay) {
      params.set("autoplay", "1");
      params.set("mute", "1");
      params.set("controls", "0");
      params.set("loop", "1");
      params.set("playlist", ytId);
    }
    return `https://www.youtube.com/embed/${ytId}?${params.toString()}`;
  }

  const vId = vimeoId(value);
  if (vId) {
    const params = new URLSearchParams(autoplay
      ? { autoplay: "1", muted: "1", background: "1", loop: "1" }
      : { title: "0", byline: "0", portrait: "0" });
    return `https://player.vimeo.com/video/${vId}?${params.toString()}`;
  }

  return "";
}

export function getMediaType(value, fallback = "image") {
  if (!value) return fallback;
  if (getEmbedUrl(value)) return "embed";
  if (videoPattern.test(value)) return "video";
  if (imagePattern.test(value)) return "image";
  return fallback;
}
