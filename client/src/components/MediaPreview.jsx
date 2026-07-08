import { useEffect, useRef } from "react";
import { detectMediaType, getVideoEmbedUrl } from "../utils/media";

export default function MediaPreview({
  value,
  mediaType,
  className = "",
  title = "Media preview",
  background = false,
  muted = true,
  poster,
  onEnded
}) {
  const videoRef = useRef(null);

  // Keep the <video> element's muted property in sync (React doesn't reliably
  // update it via the prop alone) and resume playback when unmuting.
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = muted;
      if (!muted) videoRef.current.play?.().catch(() => {});
    }
  }, [muted]);

  if (!value) return null;

  const type = detectMediaType(value, mediaType);
  const embedUrl = getVideoEmbedUrl(value, { background, muted });

  if (embedUrl) {
    return (
      <div className={`overflow-hidden bg-slate-950 ${className}`}>
        <iframe
          key={muted ? "muted" : "unmuted"}
          src={embedUrl}
          title={title}
          className="h-full w-full border-0"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          loading={background ? "eager" : "lazy"}
        />
      </div>
    );
  }

  if (type === "video") {
    return (
      <video
        ref={videoRef}
        key={value}
        src={value}
        className={className}
        poster={poster || undefined}
        autoPlay={background}
        muted={background}
        playsInline
        controls={!background}
        onEnded={onEnded}
      />
    );
  }

  return <img src={value} alt="" className={className} />;
}
