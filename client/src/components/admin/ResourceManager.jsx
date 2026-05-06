import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import http from "../../api/http";
import { ImageUpload, MixedMediaUpload, RichTextEditor, TextArea, TextInput, VideoUpload } from "./FormControls";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import DataTable from "./DataTable";

function emptyFromFields(fields) {
  return fields.reduce((acc, field) => {
    const fallback = field.type === "checkbox" ? field.defaultValue ?? false : field.type === "repeatable" ? [] : "";
    return { ...acc, [field.name]: field.defaultValue ?? fallback };
  }, {});
}

function emptyRepeatableItem(field) {
  return field.fields.reduce((acc, item) => {
    const fallback = item.type === "checkbox" ? item.defaultValue ?? false : "";
    return { ...acc, [item.name]: item.defaultValue ?? fallback };
  }, {});
}

function repeatableItemHasContent(field, row = {}) {
  return field.fields.some((item) => {
    if (item.type === "checkbox" || item.name === "mediaType" || item.name.endsWith("Type")) return false;
    const value = row[item.name];
    return value !== null && value !== undefined && String(value).trim() !== "";
  });
}

function cleanRepeatableItems(field, rows) {
  return Array.isArray(rows) ? rows.filter((row) => repeatableItemHasContent(field, row)) : rows;
}

function groupFields(fields) {
  const groups = [];
  fields.forEach((field) => {
    const title = field.group || "Content";
    const current = groups[groups.length - 1];
    if (current?.title === title) current.fields.push(field);
    else groups.push({ title, fields: [field] });
  });
  return groups;
}

function getErrorMessage(error) {
  const errors = error.response?.data?.errors;
  if (errors && typeof errors === "object") {
    const messages = Object.values(errors).map((item) => item?.message).filter(Boolean);
    if (messages.length > 0) return messages.join(", ");
  }
  return error.response?.data?.message || error.message || "Unable to save. Please check the form and try again.";
}

export default function ResourceManager({ title, endpoint, fields, columns = ["title"], singleton = false }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyFromFields(fields));
  const [editing, setEditing] = useState(null);
  const [expandedRepeatable, setExpandedRepeatable] = useState({});
  const [pendingDelete, setPendingDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);
      const res = await http.get(endpoint);
      if (singleton) setForm(res.data);
      else setItems(res.data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
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
      [field.name]: repeatableItemHasContent(field, (current[field.name] || [])[(current[field.name] || []).length - 1])
        ? [...(current[field.name] || []), emptyRepeatableItem(field)]
        : current[field.name] || [emptyRepeatableItem(field)]
    }));
  }

  function buildPayload(source) {
    const payload = { ...source };
    ["tags"].forEach((key) => { if (typeof payload[key] === "string") payload[key] = payload[key].split(",").map((x) => x.trim()).filter(Boolean); });
    ["coreValues", "requirements"].forEach((key) => { if (typeof payload[key] === "string") payload[key] = payload[key].split("\n").map((x) => x.trim()).filter(Boolean); });
    fields.filter((field) => field.type === "repeatable").forEach((field) => {
      payload[field.name] = cleanRepeatableItems(field, payload[field.name]);
    });
    return payload;
  }

  async function removeRepeatableItem(name, index) {
    const nextForm = { ...form, [name]: (form[name] || []).filter((_, itemIndex) => itemIndex !== index) };
    setForm(nextForm);
    setExpandedRepeatable((current) => {
      const next = { ...current };
      if (next[name] === index) delete next[name];
      else if (next[name] > index) next[name] -= 1;
      return next;
    });
    if (!singleton) return;
    try {
      await http.put(endpoint, buildPayload(nextForm));
      toast.success("Item deleted");
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
      load();
    }
  }

  function repeatableTitle(field, row, index) {
    const title = row.title || row.name || row.question || row.ctaLabel || `${field.label} ${index + 1}`;
    const detail = row.subtitle || row.description || row.message || row.media || "";
    return { title, detail };
  }

  function edit(item) {
    setEditing(item._id);
    setForm({ ...emptyFromFields(fields), ...item, tags: item.tags?.join(", ") || item.tags, coreValues: item.coreValues?.join("\n") || item.coreValues, requirements: item.requirements?.join("\n") || item.requirements });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit(e) {
    e.preventDefault();
    try {
      const payload = buildPayload(form);
      if (singleton) await http.put(endpoint, payload);
      else if (editing) await http.put(`${endpoint}/${editing}`, payload);
      else await http.post(endpoint, payload);
      toast.success("Saved successfully");
      setEditing(null);
      setForm(emptyFromFields(fields));
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  async function remove() {
    try {
      await http.delete(`${endpoint}/${pendingDelete._id}`);
      toast.success("Deleted");
      setPendingDelete(null);
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  function input(field) {
    const value = form[field.name] ?? "";
    if (field.type === "textarea") return <TextArea key={field.name} label={field.label} value={value} onChange={(e) => setValue(field.name, e.target.value)} required={field.required} />;
    if (field.type === "richtext") return <RichTextEditor key={field.name} label={field.label} value={value} onChange={(v) => setValue(field.name, v)} />;
    if (field.type === "image") return <ImageUpload key={field.name} label={field.label} value={value} onChange={(v) => setValue(field.name, v)} required={field.required} />;
    if (field.type === "video") return <VideoUpload key={field.name} label={field.label} value={value} onChange={(v) => setValue(field.name, v)} required={field.required} />;
    if (field.type === "media") {
      return (
        <MixedMediaUpload
          key={field.name}
          label={field.label}
          value={value}
          mediaType={form[field.mediaTypeField]}
          onChange={(nextValue, nextType) => {
            setValue(field.name, nextValue);
            if (field.mediaTypeField) setValue(field.mediaTypeField, nextType);
          }}
          required={field.required}
        />
      );
    }
    if (field.type === "checkbox") return <label key={field.name} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={Boolean(form[field.name])} onChange={(e) => setValue(field.name, e.target.checked)} /> {field.label}</label>;
    if (field.type === "select") return <label key={field.name} className="block"><span className="label">{field.label}</span><select className="input" value={value} onChange={(e) => setValue(field.name, e.target.value)} required={field.required}>{field.options.map((o) => <option key={o} value={o}>{o}</option>)}</select></label>;
    if (field.type === "repeatable") {
      const savedRows = Array.isArray(value) ? value : [];
      const rows = repeatableItemHasContent(field, savedRows[savedRows.length - 1]) || savedRows.length === 0 ? [...savedRows, emptyRepeatableItem(field)] : savedRows;
      return (
        <div key={field.name} className="md:col-span-2">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="label mb-0">{field.label}</span>
            <button type="button" className="btn-secondary px-3 py-1" onClick={() => addRepeatableItem(field)}>Add</button>
          </div>
          <div className="grid gap-3">
            {rows.map((row, index) => (
              <div className="rounded-md border border-slate-200 bg-slate-50 p-3" key={`${field.name}-${index}`}>
                {repeatableItemHasContent(field, row) && expandedRepeatable[field.name] !== index ? (
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-semibold text-slate-900">{repeatableTitle(field, row, index).title}</p>
                        {row.isActive === false ? <span className="rounded bg-slate-200 px-2 py-0.5 text-xs text-slate-600">Inactive</span> : <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">Active</span>}
                        {row.mediaType && <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{row.mediaType}</span>}
                      </div>
                      {repeatableTitle(field, row, index).detail && <p className="mt-1 truncate text-xs text-slate-500">{repeatableTitle(field, row, index).detail}</p>}
                    </div>
                    <div className="flex shrink-0 gap-3 text-sm">
                      <button type="button" className="font-medium text-brand" onClick={() => setExpandedRepeatable((current) => ({ ...current, [field.name]: index }))}>View / Edit</button>
                      <button type="button" className="font-medium text-red-600" onClick={() => removeRepeatableItem(field.name, index)}>Remove</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid gap-3 md:grid-cols-2">
                      {field.fields.map((item) => {
                        const itemValue = row[item.name] || "";
                        const className = item.type === "textarea" || item.type === "image" || item.type === "video" || item.type === "media" ? "md:col-span-2" : "";
                        if (item.type === "image") return <div className={className} key={item.name}><ImageUpload label={item.label} value={itemValue} onChange={(next) => setRepeatableValue(field.name, index, item.name, next)} /></div>;
                        if (item.type === "video") return <div className={className} key={item.name}><VideoUpload label={item.label} value={itemValue} onChange={(next) => setRepeatableValue(field.name, index, item.name, next)} /></div>;
                        if (item.type === "checkbox") {
                          return (
                            <label className="flex items-center gap-2 text-sm" key={item.name}>
                              <input type="checkbox" checked={row[item.name] !== false} onChange={(e) => setRepeatableValue(field.name, index, item.name, e.target.checked)} /> {item.label}
                            </label>
                          );
                        }
                        if (item.type === "media") {
                          return (
                            <div className={className} key={item.name}>
                              <MixedMediaUpload
                                label={item.label}
                                value={itemValue}
                                mediaType={row[item.mediaTypeField]}
                                onChange={(nextValue, nextType) => {
                                  setRepeatableValue(field.name, index, item.name, nextValue);
                                  if (item.mediaTypeField) setRepeatableValue(field.name, index, item.mediaTypeField, nextType);
                                }}
                              />
                            </div>
                          );
                        }
                        return (
                          <label className={className} key={item.name}>
                            <span className="label">{item.label}</span>
                            {item.type === "textarea" ? (
                              <textarea className="input min-h-24" value={itemValue} onChange={(e) => setRepeatableValue(field.name, index, item.name, e.target.value)} />
                            ) : (
                              <input className="input" value={itemValue} onChange={(e) => setRepeatableValue(field.name, index, item.name, e.target.value)} />
                            )}
                          </label>
                        );
                      })}
                    </div>
                    {repeatableItemHasContent(field, row) && (
                      <div className="mt-3 flex gap-3 text-sm">
                        <button type="button" className="font-medium text-brand" onClick={() => setExpandedRepeatable((current) => ({ ...current, [field.name]: null }))}>Collapse</button>
                        <button type="button" className="font-medium text-red-600" onClick={() => removeRepeatableItem(field.name, index)}>Remove item</button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return <TextInput key={field.name} label={field.label} type={field.type || "text"} value={value} onChange={(e) => setValue(field.name, e.target.value)} required={field.required} />;
  }

  return (
    <div>
      <h1 className="text-3xl font-black text-slate-950">{title}</h1>
      <form onSubmit={submit} className="mt-6 grid gap-5">
        {groupFields(fields).map((group) => (
          <section className="card p-5" key={group.title}>
            <h2 className="mb-4 text-lg font-bold text-slate-950">{group.title}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {group.fields.map(input)}
            </div>
          </section>
        ))}
        <div className="sticky bottom-0 z-10 flex gap-3 border-t border-slate-200 bg-slate-100/95 py-4 backdrop-blur">
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
