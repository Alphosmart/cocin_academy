import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import http from "../../api/http";
import { ImageUpload, RichTextEditor, TextArea, TextInput } from "./FormControls";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import DataTable from "./DataTable";

function emptyFromFields(fields) {
  return fields.reduce((acc, field) => {
    const fallback = field.type === "checkbox" ? false : field.type === "repeatable" ? [] : "";
    return { ...acc, [field.name]: field.defaultValue ?? fallback };
  }, {});
}

export default function ResourceManager({ title, endpoint, fields, columns = ["title"], singleton = false }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyFromFields(fields));
  const [editing, setEditing] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await http.get(endpoint);
    if (singleton) setForm(res.data);
    else setItems(res.data);
    setLoading(false);
  }

  useEffect(() => { load(); }, [endpoint]);

  function setValue(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function setRepeatableValue(name, index, key, value) {
    setForm((current) => {
      const next = [...(current[name] || [])];
      next[index] = { ...next[index], [key]: value };
      return { ...current, [name]: next };
    });
  }

  function addRepeatableItem(field) {
    setForm((current) => ({
      ...current,
      [field.name]: [...(current[field.name] || []), field.fields.reduce((acc, item) => ({ ...acc, [item.name]: "" }), {})]
    }));
  }

  function removeRepeatableItem(name, index) {
    setForm((current) => ({ ...current, [name]: (current[name] || []).filter((_, itemIndex) => itemIndex !== index) }));
  }

  function edit(item) {
    setEditing(item._id);
    setForm({ ...emptyFromFields(fields), ...item, tags: item.tags?.join(", ") || item.tags, coreValues: item.coreValues?.join("\n") || item.coreValues, requirements: item.requirements?.join("\n") || item.requirements });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit(e) {
    e.preventDefault();
    const payload = { ...form };
    ["tags"].forEach((key) => { if (typeof payload[key] === "string") payload[key] = payload[key].split(",").map((x) => x.trim()).filter(Boolean); });
    ["coreValues", "requirements"].forEach((key) => { if (typeof payload[key] === "string") payload[key] = payload[key].split("\n").map((x) => x.trim()).filter(Boolean); });
    if (singleton) await http.put(endpoint, payload);
    else if (editing) await http.put(`${endpoint}/${editing}`, payload);
    else await http.post(endpoint, payload);
    toast.success("Saved successfully");
    setEditing(null);
    setForm(emptyFromFields(fields));
    load();
  }

  async function remove() {
    await http.delete(`${endpoint}/${pendingDelete._id}`);
    toast.success("Deleted");
    setPendingDelete(null);
    load();
  }

  function input(field) {
    const value = form[field.name] ?? "";
    if (field.type === "textarea") return <TextArea key={field.name} label={field.label} value={value} onChange={(e) => setValue(field.name, e.target.value)} />;
    if (field.type === "richtext") return <RichTextEditor key={field.name} label={field.label} value={value} onChange={(v) => setValue(field.name, v)} />;
    if (field.type === "image") return <ImageUpload key={field.name} label={field.label} value={value} onChange={(v) => setValue(field.name, v)} />;
    if (field.type === "checkbox") return <label key={field.name} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={Boolean(form[field.name])} onChange={(e) => setValue(field.name, e.target.checked)} /> {field.label}</label>;
    if (field.type === "select") return <label key={field.name} className="block"><span className="label">{field.label}</span><select className="input" value={value} onChange={(e) => setValue(field.name, e.target.value)}>{field.options.map((o) => <option key={o} value={o}>{o}</option>)}</select></label>;
    if (field.type === "repeatable") {
      const rows = Array.isArray(value) ? value : [];
      return (
        <div key={field.name} className="md:col-span-2">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="label mb-0">{field.label}</span>
            <button type="button" className="btn-secondary px-3 py-1" onClick={() => addRepeatableItem(field)}>Add</button>
          </div>
          <div className="grid gap-3">
            {rows.map((row, index) => (
              <div className="rounded-md border border-slate-200 bg-slate-50 p-3" key={`${field.name}-${index}`}>
                <div className="grid gap-3 md:grid-cols-2">
                  {field.fields.map((item) => (
                    <label className={item.type === "textarea" ? "md:col-span-2" : ""} key={item.name}>
                      <span className="label">{item.label}</span>
                      {item.type === "textarea" ? (
                        <textarea className="input min-h-24" value={row[item.name] || ""} onChange={(e) => setRepeatableValue(field.name, index, item.name, e.target.value)} />
                      ) : (
                        <input className="input" value={row[item.name] || ""} onChange={(e) => setRepeatableValue(field.name, index, item.name, e.target.value)} />
                      )}
                    </label>
                  ))}
                </div>
                <button type="button" className="mt-3 text-sm font-medium text-red-600" onClick={() => removeRepeatableItem(field.name, index)}>Remove item</button>
              </div>
            ))}
            {rows.length === 0 && <p className="rounded-md border border-dashed border-slate-300 p-4 text-sm text-slate-500">No items yet.</p>}
          </div>
        </div>
      );
    }
    return <TextInput key={field.name} label={field.label} type={field.type || "text"} value={value} onChange={(e) => setValue(field.name, e.target.value)} />;
  }

  return (
    <div>
      <h1 className="text-3xl font-black text-slate-950">{title}</h1>
      <form onSubmit={submit} className="card mt-6 grid gap-4 p-5 md:grid-cols-2">
        {fields.map(input)}
        <div className="flex gap-3 md:col-span-2">
          <button className="btn-primary">{singleton ? "Save changes" : editing ? "Update" : "Create"}</button>
          {!singleton && editing && <button type="button" className="btn-secondary" onClick={() => { setEditing(null); setForm(emptyFromFields(fields)); }}>Cancel</button>}
        </div>
      </form>
      {!singleton && <div className="card mt-8 overflow-x-auto">
        <DataTable loading={loading} columns={columns} items={items} onEdit={edit} onDelete={setPendingDelete} />
      </div>}
      <ConfirmDeleteModal open={Boolean(pendingDelete)} title="Delete content?" message={`Delete ${pendingDelete?.title || pendingDelete?.name || "this item"} permanently?`} onCancel={() => setPendingDelete(null)} onConfirm={remove} />
    </div>
  );
}
