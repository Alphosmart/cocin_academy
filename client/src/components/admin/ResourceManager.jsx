import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import http from "../../api/http";
import { ImageUpload, MixedMediaUpload, RichTextEditor, TextArea, TextInput, VideoUpload } from "./FormControls";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import DataTable from "./DataTable";
import { getMediaType } from "../../utils/media";

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

function collectErrorMessages(value) {
  if (!value) return [];
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(collectErrorMessages);
  if (typeof value === "object") {
    if (typeof value.message === "string") return [value.message];
    return Object.values(value).flatMap(collectErrorMessages);
  }
  return [];
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
    const messages = collectErrorMessages(errors);
    if (messages.length > 0) return messages.join(", ");
  }
  return error.response?.data?.message || error.message || "Unable to save. Please check the form and try again.";
}

function dateInputValue(value) {
  if (!value) return "";
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}

function normalizeFieldValue(field, value) {
  if (field.type === "number") {
    if (value === "" || value === null || value === undefined) return undefined;
    const next = Number(value);
    return Number.isNaN(next) ? value : next;
  }
  if (field.type === "date" && /^\d{4}-\d{2}-\d{2}$/.test(String(value))) {
    return `${value}T00:00:00.000Z`;
  }
  if (field.name === "slug" && typeof value === "string" && value.trim() === "" && !field.required) {
    return undefined;
  }
  return value;
}

function pruneUndefined(input) {
  if (Array.isArray(input)) return input.map(pruneUndefined);
  if (!input || typeof input !== "object") return input;
  return Object.fromEntries(
    Object.entries(input)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => [key, pruneUndefined(value)])
  );
}

export default function ResourceManager({ title, endpoint, fields, columns = ["title"], singleton = false }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyFromFields(fields));
  const [editing, setEditing] = useState(null);
  const [expandedRepeatable, setExpandedRepeatable] = useState({});
  const [pendingDelete, setPendingDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

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
    setExpandedRepeatable((current) => (current[name] === index ? current : { ...current, [name]: index }));
    setForm((current) => {
      const next = [...(current[name] || [])];
      next[index] = { ...next[index], [key]: value };
      return { ...current, [name]: next };
    });
  }

  function addRepeatableItem(field) {
    const currentRows = Array.isArray(form[field.name]) ? form[field.name] : [];
    const shouldAppend = repeatableItemHasContent(field, currentRows[currentRows.length - 1]);
    const nextRows = shouldAppend ? [...currentRows, emptyRepeatableItem(field)] : currentRows.length > 0 ? currentRows : [emptyRepeatableItem(field)];
    const nextIndex = Math.max(nextRows.length - 1, 0);

    setExpandedRepeatable((current) => ({ ...current, [field.name]: nextIndex }));
    setForm((current) => ({
      ...current,
      [field.name]: nextRows
    }));
  }

  function buildPayload(source) {
    const payload = { ...source };
    ["tags"].forEach((key) => { if (typeof payload[key] === "string") payload[key] = payload[key].split(",").map((x) => x.trim()).filter(Boolean); });
    ["coreValues", "requirements"].forEach((key) => { if (typeof payload[key] === "string") payload[key] = payload[key].split("\n").map((x) => x.trim()).filter(Boolean); });
    fields.forEach((field) => {
      if (field.type === "repeatable") return;
      payload[field.name] = normalizeFieldValue(field, payload[field.name]);
    });
    fields.filter((field) => field.type === "repeatable").forEach((field) => {
      const rows = cleanRepeatableItems(field, payload[field.name]);
      payload[field.name] = Array.isArray(rows) ? rows.map((row) => {
        const next = { ...row };
        field.fields.forEach((item) => {
          next[item.name] = normalizeFieldValue(item, next[item.name]);
        });
        return pruneUndefined(next);
      }) : rows;
    });
    return pruneUndefined(payload);
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
    const detail = row.subtitle || row.description || row.message || row.media || row.image || "";
    const mediaType = getMediaType(row.media || row.image || "", row.mediaType || "image");
    return { title, detail, mediaType };
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
    const value = field.type === "date" ? dateInputValue(form[field.name]) : form[field.name] ?? "";
    if (field.type === "textarea") return <TextArea key={field.name} label={field.label} help={field.help} value={value} onChange={(e) => setValue(field.name, e.target.value)} required={field.required} />;
    if (field.type === "richtext") return <RichTextEditor key={field.name} label={field.label} help={field.help} value={value} onChange={(v) => setValue(field.name, v)} />;
    if (field.type === "image") return <ImageUpload key={field.name} label={field.label} help={field.help} value={value} onChange={(v) => setValue(field.name, v)} required={field.required} />;
    if (field.type === "video") return <VideoUpload key={field.name} label={field.label} help={field.help} value={value} onChange={(v) => setValue(field.name, v)} required={field.required} />;
    if (field.type === "media") {
      return (
        <MixedMediaUpload
          key={field.name}
          label={field.label}
          help={field.help}
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
    if (field.type === "checkbox") return <label key={field.name} className="flex items-start gap-2 text-sm"><input type="checkbox" className="mt-1" checked={Boolean(form[field.name])} onChange={(e) => setValue(field.name, e.target.checked)} /> <span>{field.label}{field.help && <span className="mt-1 block text-xs leading-5 text-slate-500">{field.help}</span>}</span></label>;
    if (field.type === "select") return <label key={field.name} className="block"><span className="label">{field.label}</span><select className="input" value={value} onChange={(e) => setValue(field.name, e.target.value)} required={field.required}>{field.options.map((o) => <option key={o} value={o}>{o}</option>)}</select>{field.help && <span className="mt-1 block text-xs leading-5 text-slate-500">{field.help}</span>}</label>;
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
                    <div className="flex min-w-0 items-start gap-3">
                      {(row.media || row.image) && (
                        <div className="shrink-0">
                          {repeatableTitle(field, row, index).mediaType === "embed" ? (
                            <div className="grid h-16 w-16 place-items-center rounded bg-slate-200 text-xs font-semibold text-slate-600">Embed</div>
                          ) : repeatableTitle(field, row, index).mediaType === "video" ? (
                            <video src={row.media || row.image} className="h-16 w-16 rounded object-cover" muted />
                          ) : (
                            <img src={row.media || row.image} alt="" className="h-16 w-16 rounded object-cover" />
                          )}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate text-sm font-semibold text-slate-900">{repeatableTitle(field, row, index).title}</p>
                          {row.isActive === false ? <span className="rounded bg-slate-200 px-2 py-0.5 text-xs text-slate-600">Inactive</span> : row.isActive !== undefined && <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">Active</span>}
                          {row.mediaType && <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{row.mediaType.toUpperCase()}</span>}
                          {row.status && <span className={`rounded px-2 py-0.5 text-xs font-medium ${row.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{row.status}</span>}
                        </div>
                        {repeatableTitle(field, row, index).detail && <p className="mt-1 truncate text-xs text-slate-500">{repeatableTitle(field, row, index).detail}</p>}
                      </div>
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
                        if (item.type === "image") return <div className={className} key={item.name}><ImageUpload label={item.label} help={item.help} value={itemValue} onChange={(next) => setRepeatableValue(field.name, index, item.name, next)} /></div>;
                        if (item.type === "video") return <div className={className} key={item.name}><VideoUpload label={item.label} help={item.help} value={itemValue} onChange={(next) => setRepeatableValue(field.name, index, item.name, next)} /></div>;
                        if (item.type === "checkbox") {
                          return (
                            <label className="flex items-start gap-2 text-sm" key={item.name}>
                              <input className="mt-1" type="checkbox" checked={row[item.name] !== false} onChange={(e) => setRepeatableValue(field.name, index, item.name, e.target.checked)} />
                              <span>{item.label}{item.help && <span className="mt-1 block text-xs leading-5 text-slate-500">{item.help}</span>}</span>
                            </label>
                          );
                        }
                        if (item.type === "media") {
                          return (
                            <div className={className} key={item.name}>
                              <MixedMediaUpload
                                label={item.label}
                                help={item.help}
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
                            {item.help && <span className="mt-1 block text-xs leading-5 text-slate-500">{item.help}</span>}
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
    return <TextInput key={field.name} label={field.label} help={field.help} type={field.type || "text"} value={value} onChange={(e) => setValue(field.name, e.target.value)} required={field.required} />;
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
      {!singleton && (
        <div className="card mt-8">
          <div className="border-b border-slate-200 p-4">
            <input
              type="text"
              placeholder="Search items..."
              className="input max-w-xs"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="overflow-x-auto">
            <DataTable
              loading={loading}
              columns={columns}
              items={items
                .filter((item) =>
                  search === "" ||
                  Object.values(item).some((val) =>
                    String(val).toLowerCase().includes(search.toLowerCase())
                  )
                )
                .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)}
              onEdit={edit}
              onDelete={setPendingDelete}
            />
          </div>
          {items.length > ITEMS_PER_PAGE && (
            <div className="border-t border-slate-200 p-4 flex items-center justify-between text-sm">
              <p className="text-slate-600">
                Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, items.length)}-{Math.min(currentPage * ITEMS_PER_PAGE, items.length)} of {items.length}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="btn-secondary px-3 py-1 disabled:opacity-50"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="btn-secondary px-3 py-1 disabled:opacity-50"
                  disabled={currentPage * ITEMS_PER_PAGE >= items.length}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      <ConfirmDeleteModal open={Boolean(pendingDelete)} title="Delete content?" message={`Delete ${pendingDelete?.title || pendingDelete?.name || "this item"} permanently?`} onCancel={() => setPendingDelete(null)} onConfirm={remove} />
    </div>
  );
}
