import { detectMediaType, getVideoEmbedUrl } from "../utils/media";

export default function MediaPreview({
  value,
  mediaType,
  className = "",
  title = "Media preview",
  background = false,
  poster,
  onEnded
}) {
  if (!value) return null;

  const type = detectMediaType(value, mediaType);
  const embedUrl = getVideoEmbedUrl(value, { background });

  if (embedUrl) {
    return (
      <div className={`overflow-hidden bg-slate-950 ${className}`}>
        <iframe
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
