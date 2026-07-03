import { useLayoutEffect, useRef } from "react";
import http from "../../api/http";
import toast from "react-hot-toast";
import { getEmbedUrl, getMediaType } from "../../utils/media";

function isManagedUploadUrl(value) {
  if (!value || typeof value !== "string") return false;
  try {
    const url = new URL(value, window.location.origin);
    return url.hostname === "res.cloudinary.com" || url.pathname.startsWith("/uploads/");
  } catch {
    return false;
  }
}

function pasteInputValue(value) {
  return isManagedUploadUrl(value) ? "" : value || "";
}

export function Field({ label, help, children }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
      {help && <span className="mt-1 block text-xs leading-5 text-slate-500">{help}</span>}
    </label>
  );
}

export function TextInput({ help, label, ...props }) {
  return <Field label={label} help={help}><input className="input" {...props} /></Field>;
}

export function TextArea({ help, label, ...props }) {
  return <Field label={label} help={help}><textarea className="input min-h-28" {...props} /></Field>;
}

export function RichTextEditor({ label, help, value, onChange }) {
  const ref = useRef(null);
  const lastHtml = useRef("");
  const editorValue = value || "";

  useLayoutEffect(() => {
    const editor = ref.current;
    if (!editor) return;
    if (editorValue !== lastHtml.current && editor.innerHTML !== editorValue) {
      editor.innerHTML = editorValue;
      lastHtml.current = editorValue;
    }
  }, [editorValue]);

function emitChange() {
    const next = ref.current?.innerHTML || "";
    lastHtml.current = next;
    onChange(next);
  }

  function command(name) {
    ref.current?.focus();
    document.execCommand(name, false, null);
    emitChange();
  }

  return (
    <div>
      <span className="label">{label}</span>
      <div className="mb-2 flex gap-2">
        <button type="button" className="btn-secondary px-3 py-1" onMouseDown={(e) => e.preventDefault()} onClick={() => command("bold")}>B</button>
        <button type="button" className="btn-secondary px-3 py-1 italic" onMouseDown={(e) => e.preventDefault()} onClick={() => command("italic")}>I</button>
        <button type="button" className="btn-secondary px-3 py-1" onMouseDown={(e) => e.preventDefault()} onClick={() => command("insertUnorderedList")}>List</button>
      </div>
      <div
        ref={ref}
        className="min-h-40 rounded-md border border-slate-300 bg-white p-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-[#dff4fc]"
        contentEditable
        suppressContentEditableWarning
        onInput={emitChange}
      />
      {help && <p className="mt-1 text-xs leading-5 text-slate-500">{help}</p>}
    </div>
  );
}

function MediaUpload({ accept, help, label, placeholder, preview, successMessage, value, onChange, required = false }) {
  async function upload(file, input) {
    if (!file) return;
    try {
      const form = new FormData();
      form.append("image", file);
      const res = await http.post("/uploads", form, { headers: { "Content-Type": "multipart/form-data" } });
      onChange(res.data.url);
      toast.success(successMessage);
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      if (input) input.value = "";
    }
  }
  return (
    <div>
      <span className="label">{label}</span>
      {preview(value)}
      <input className="input" type="file" accept={accept} onChange={(e) => upload(e.target.files?.[0], e.target)} />
      <input className="input mt-2" placeholder={placeholder} value={pasteInputValue(value)} onChange={(e) => onChange(e.target.value)} required={required && !value} />
      {help && <p className="mt-1 text-xs leading-5 text-slate-500">{help}</p>}
    </div>
  );
}

export function ImageUpload(props) {
  return (
    <MediaUpload
      {...props}
      accept="image/jpeg,image/png,image/webp,image/gif"
      placeholder="Or paste image URL"
      successMessage="Image uploaded"
      preview={(value) => value && <img src={value} alt="" className="mb-3 h-28 w-44 rounded-md object-cover" />}
    />
  );
}

export function VideoUpload(props) {
  return (
    <MediaUpload
      {...props}
      accept="video/mp4,video/webm,video/quicktime"
      placeholder="Or paste video URL"
      successMessage="Video uploaded"
      preview={(value) => value && <video src={value} className="mb-3 h-28 w-44 rounded-md object-cover" muted controls />}
    />
  );
}

export function MixedMediaUpload({ label, help, value, mediaType, onChange, required = false }) {
  async function upload(file, input) {
    if (!file) return;
    try {
      const form = new FormData();
      form.append("image", file);
      const res = await http.post("/uploads", form, { headers: { "Content-Type": "multipart/form-data" } });
      onChange(res.data.url, res.data.resourceType === "video" ? "video" : "image");
      toast.success(`${res.data.resourceType === "video" ? "Video" : "Image"} uploaded`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      if (input) input.value = "";
    }
  }

  const previewType = getMediaType(value, mediaType || "image");
  const embedUrl = getEmbedUrl(value);

  return (
    <div>
      <span className="label">{label}</span>
      {value && previewType === "embed" && embedUrl && (
        <iframe
          src={embedUrl}
          title={`${label} preview`}
          className="mb-3 aspect-video w-64 max-w-full rounded-md border border-slate-200"
          allow="autoplay; encrypted-media; picture-in-picture"
        />
      )}
      {value && previewType === "video" && <video src={value} className="mb-3 h-28 w-44 rounded-md object-cover" muted controls />}
      {value && previewType === "image" && <img src={value} alt="" className="mb-3 h-28 w-44 rounded-md object-cover" />}
      <input className="input" type="file" accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime" onChange={(e) => upload(e.target.files?.[0], e.target)} />
      <input
        className="input mt-2"
        placeholder="Or paste image, video, YouTube, or Vimeo URL"
        value={pasteInputValue(value)}
        onChange={(e) => onChange(e.target.value, getMediaType(e.target.value, previewType))}
        required={required && !value}
      />
      <select className="input mt-2" value={previewType} onChange={(e) => onChange(value || "", e.target.value)}>
        <option value="image">Image</option>
        <option value="video">Video</option>
        <option value="embed">YouTube/Vimeo</option>
      </select>
      {help && <p className="mt-1 text-xs leading-5 text-slate-500">{help}</p>}
      {value && (
        <button type="button" className="mt-2 text-sm font-medium text-red-600" onClick={() => onChange("", previewType)}>
          Remove media
        </button>
      )}
    </div>
  );
}
