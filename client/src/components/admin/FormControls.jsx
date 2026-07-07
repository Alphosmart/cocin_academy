import { useEffect, useRef, useState } from "react";
import http from "../../api/http";
import toast from "react-hot-toast";
import MediaPreview from "../MediaPreview";
import { detectMediaType } from "../../utils/media";

function Hint({ children }) {
  return children ? <p className="mb-2 text-xs leading-5 text-slate-500">{children}</p> : null;
}

export function Field({ label, description, children }) {
  return <label className="block"><span className="label">{label}</span><Hint>{description}</Hint>{children}</label>;
}

export function TextInput({ label, description, ...props }) {
  return <Field label={label} description={description}><input className="input" {...props} /></Field>;
}

export function TextArea({ label, description, ...props }) {
  return <Field label={label} description={description}><textarea className="input min-h-28" {...props} /></Field>;
}

export function RichTextEditor({ label, description, value, onChange }) {
  const ref = useRef(null);
  const lastValueRef = useRef(null);

  useEffect(() => {
    const editor = ref.current;
    const nextValue = value || "";
    if (!editor) return;
    if (document.activeElement === editor && lastValueRef.current === nextValue) return;
    if (editor.innerHTML !== nextValue) editor.innerHTML = nextValue;
    lastValueRef.current = nextValue;
  }, [value]);

  function emit(nextValue) {
    lastValueRef.current = nextValue;
    onChange(nextValue);
  }

  function command(name) {
    ref.current?.focus();
    document.execCommand(name, false, null);
    emit(ref.current?.innerHTML || "");
  }

  return (
    <div>
      <span className="label">{label}</span>
      <Hint>{description}</Hint>
      <div className="mb-2 flex gap-2">
        <button type="button" className="btn-secondary px-3 py-1" onClick={() => command("bold")}>B</button>
        <button type="button" className="btn-secondary px-3 py-1 italic" onClick={() => command("italic")}>I</button>
        <button type="button" className="btn-secondary px-3 py-1" onClick={() => command("insertUnorderedList")}>List</button>
      </div>
      <div
        ref={ref}
        className="min-h-40 rounded-md border border-slate-300 bg-white p-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-schoolLime/40"
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => emit(e.currentTarget.innerHTML)}
      />
    </div>
  );
}

function MediaUpload({ accept, label, description, placeholder, preview, successMessage, value, onChange, required = false }) {
  const [linkDraft, setLinkDraft] = useState("");
  const fileInput = useRef(null);
  const manualValue = useRef("");

  useEffect(() => {
    if (value !== manualValue.current) setLinkDraft("");
  }, [value]);

  async function upload(file) {
    if (!file) return;
    const replacing = Boolean(value);
    const form = new FormData();
    form.append("image", file);
    const res = await http.post("/uploads", form, { headers: { "Content-Type": "multipart/form-data" } });
    manualValue.current = "";
    setLinkDraft("");
    onChange(res.data.url);
    if (fileInput.current) fileInput.current.value = "";
    toast.success(replacing ? successMessage.replace("uploaded", "replaced") : successMessage);
  }

  function remove() {
    manualValue.current = "";
    setLinkDraft("");
    onChange("");
  }

  function pasteLink(nextValue) {
    manualValue.current = nextValue;
    setLinkDraft(nextValue);
    onChange(nextValue);
  }

  return (
    <div>
      <span className="label">{label}</span>
      <Hint>{description}</Hint>
      {preview(value)}
      <input ref={fileInput} className="input" type="file" accept={accept} onChange={(e) => upload(e.target.files?.[0])} />
      <input
        className="input mt-2"
        placeholder={value ? "Paste a new link to replace current media" : placeholder}
        value={linkDraft}
        onChange={(e) => pasteLink(e.target.value)}
        required={required && !value}
      />
      {value && (
        <button type="button" className="mt-2 text-sm font-medium text-red-600" onClick={remove}>
          Remove media
        </button>
      )}
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

export function MixedMediaUpload({ label, description, value, mediaType, onChange, required = false }) {
  const [linkDraft, setLinkDraft] = useState("");
  const fileInput = useRef(null);
  const manualValue = useRef("");

  useEffect(() => {
    if (value !== manualValue.current) setLinkDraft("");
  }, [value]);

  async function upload(file) {
    if (!file) return;
    const replacing = Boolean(value);
    const form = new FormData();
    form.append("image", file);
    const res = await http.post("/uploads", form, { headers: { "Content-Type": "multipart/form-data" } });
    manualValue.current = "";
    setLinkDraft("");
    onChange(res.data.url, res.data.resourceType === "video" ? "video" : "image");
    if (fileInput.current) fileInput.current.value = "";
    toast.success(`${res.data.resourceType === "video" ? "Video" : "Image"} ${replacing ? "replaced" : "uploaded"}`);
  }

  const previewType = detectMediaType(value, mediaType);

  function remove() {
    manualValue.current = "";
    setLinkDraft("");
    onChange("", previewType);
  }

  function pasteLink(nextValue) {
    manualValue.current = nextValue;
    setLinkDraft(nextValue);
    onChange(nextValue, detectMediaType(nextValue, previewType));
  }

  return (
    <div>
      <span className="label">{label}</span>
      <Hint>{description}</Hint>
      {value && <MediaPreview value={value} mediaType={previewType} className="mb-3 h-28 w-44 rounded-md object-cover" title={`${label} preview`} />}
      <input ref={fileInput} className="input" type="file" accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime" onChange={(e) => upload(e.target.files?.[0])} />
      <input
        className="input mt-2"
        placeholder={value ? "Paste a new link to replace current media" : "Or paste an image, video, YouTube, or Vimeo link"}
        value={linkDraft}
        onChange={(e) => pasteLink(e.target.value)}
        required={required && !value}
      />
      {value && (
        <select className="input mt-2" value={previewType} onChange={(e) => onChange(value || "", e.target.value)}>
          <option value="image">Image</option>
          <option value="video">Video (uploaded / direct file)</option>
          <option value="embed">Embed (YouTube / Vimeo link)</option>
        </select>
      )}
      {value && (
        <button type="button" className="mt-2 text-sm font-medium text-red-600" onClick={remove}>
          Remove media
        </button>
      )}
    </div>
  );
}
