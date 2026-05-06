import { useRef } from "react";
import http from "../../api/http";
import toast from "react-hot-toast";

export function Field({ label, children }) {
  return <label className="block"><span className="label">{label}</span>{children}</label>;
}

export function TextInput({ label, ...props }) {
  return <Field label={label}><input className="input" {...props} /></Field>;
}

export function TextArea({ label, ...props }) {
  return <Field label={label}><textarea className="input min-h-28" {...props} /></Field>;
}

export function RichTextEditor({ label, value, onChange }) {
  const ref = useRef(null);
  function command(name) {
    document.execCommand(name, false, null);
    onChange(ref.current?.innerHTML || "");
  }
  return (
    <div>
      <span className="label">{label}</span>
      <div className="mb-2 flex gap-2">
        <button type="button" className="btn-secondary px-3 py-1" onClick={() => command("bold")}>B</button>
        <button type="button" className="btn-secondary px-3 py-1 italic" onClick={() => command("italic")}>I</button>
        <button type="button" className="btn-secondary px-3 py-1" onClick={() => command("insertUnorderedList")}>List</button>
      </div>
      <div
        ref={ref}
        className="min-h-40 rounded-md border border-slate-300 bg-white p-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-[#dff4fc]"
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        dangerouslySetInnerHTML={{ __html: value || "" }}
      />
    </div>
  );
}

function MediaUpload({ accept, label, placeholder, preview, successMessage, value, onChange, required = false }) {
  async function upload(file) {
    if (!file) return;
    const form = new FormData();
    form.append("image", file);
    const res = await http.post("/uploads", form, { headers: { "Content-Type": "multipart/form-data" } });
    onChange(res.data.url);
    toast.success(successMessage);
  }
  return (
    <div>
      <span className="label">{label}</span>
      {preview(value)}
      <input className="input" type="file" accept={accept} onChange={(e) => upload(e.target.files?.[0])} />
      <input className="input mt-2" placeholder={placeholder} value={value || ""} onChange={(e) => onChange(e.target.value)} required={required} />
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

export function MixedMediaUpload({ label, value, mediaType, onChange, required = false }) {
  async function upload(file) {
    if (!file) return;
    const form = new FormData();
    form.append("image", file);
    const res = await http.post("/uploads", form, { headers: { "Content-Type": "multipart/form-data" } });
    onChange(res.data.url, res.data.resourceType === "video" ? "video" : "image");
    toast.success(`${res.data.resourceType === "video" ? "Video" : "Image"} uploaded`);
  }

  const previewType = mediaType || (/\.(mp4|webm|mov)(\?|#|$)/i.test(value || "") ? "video" : "image");

  return (
    <div>
      <span className="label">{label}</span>
      {value && previewType === "video" && <video src={value} className="mb-3 h-28 w-44 rounded-md object-cover" muted controls />}
      {value && previewType !== "video" && <img src={value} alt="" className="mb-3 h-28 w-44 rounded-md object-cover" />}
      <input className="input" type="file" accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime" onChange={(e) => upload(e.target.files?.[0])} />
      <input className="input mt-2" placeholder="Or paste image/video URL" value={value || ""} onChange={(e) => onChange(e.target.value, previewType)} required={required} />
      <select className="input mt-2" value={previewType} onChange={(e) => onChange(value || "", e.target.value)}>
        <option value="image">Image</option>
        <option value="video">Video</option>
      </select>
      {value && (
        <button type="button" className="mt-2 text-sm font-medium text-red-600" onClick={() => onChange("", previewType)}>
          Remove media
        </button>
      )}
    </div>
  );
}
