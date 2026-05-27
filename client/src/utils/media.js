const DIRECT_VIDEO_PATTERN = /\.(mp4|webm|mov)(\?|#|$)/i;
const DIRECT_IMAGE_PATTERN = /\.(jpe?g|png|webp|gif|avif|svg)(\?|#|$)/i;

function parseUrl(value) {
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

function getYouTubeId(url) {
  const host = url.hostname.replace(/^www\./, "").replace(/^m\./, "");
  if (host === "youtu.be") return url.pathname.split("/").filter(Boolean)[0] || "";
  if (host !== "youtube.com" && !host.endsWith(".youtube.com") && host !== "youtube-nocookie.com") return "";

  if (url.pathname === "/watch") return url.searchParams.get("v") || "";
  const [type, id] = url.pathname.split("/").filter(Boolean);
  return ["embed", "shorts", "live"].includes(type) ? id || "" : "";
}

function getVimeoId(url) {
  const host = url.hostname.replace(/^www\./, "");
  if (host !== "vimeo.com" && !host.endsWith(".vimeo.com")) return "";
  const parts = url.pathname.split("/").filter(Boolean);
  if (host === "player.vimeo.com" && parts[0] === "video") return parts[1] || "";
  return parts.find((part) => /^\d+$/.test(part)) || "";
}

export function getEmbedUrl(value, { autoplay = false } = {}) {
  const url = parseUrl(value);
  if (!url) return "";

  const youtubeId = getYouTubeId(url);
  if (youtubeId) {
    const params = new URLSearchParams({ rel: "0", playsinline: "1" });
    if (autoplay) {
      params.set("autoplay", "1");
      params.set("mute", "1");
      params.set("controls", "0");
      params.set("loop", "1");
      params.set("playlist", youtubeId);
    }
    return `https://www.youtube.com/embed/${youtubeId}?${params.toString()}`;
  }

  const vimeoId = getVimeoId(url);
  if (vimeoId) {
    const params = new URLSearchParams(autoplay
      ? { autoplay: "1", muted: "1", background: "1", loop: "1" }
      : { title: "0", byline: "0", portrait: "0" });
    return `https://player.vimeo.com/video/${vimeoId}?${params.toString()}`;
  }

  return "";
}

export function getMediaType(value, fallback = "image") {
  if (!value) return fallback;
  if (getEmbedUrl(value)) return "embed";
  if (DIRECT_VIDEO_PATTERN.test(value)) return "video";
  if (DIRECT_IMAGE_PATTERN.test(value)) return "image";
  return fallback;
}
