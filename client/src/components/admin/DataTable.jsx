import { useState } from "react";
import { GripVertical } from "lucide-react";

function renderCellValue(value, column, item) {
  // Show image thumbnails
  if ((column === "image" || column === "featuredImage" || column === "media") && value && typeof value === "string") {
    return <img src={value} alt="" className="h-12 w-12 rounded object-cover" />;
  }

  // Show active/inactive status as badge
  if (column === "isActive" || column === "active") {
    return value ? (
      <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">Active</span>
    ) : (
      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">Inactive</span>
    );
  }

  // Show status badges
  if (column === "status") {
    return (
      <span className={`rounded-full px-2 py-1 text-xs font-medium ${
        value === "published" ? "bg-emerald-100 text-emerald-700" :
        value === "draft" ? "bg-amber-100 text-amber-700" :
        "bg-slate-100 text-slate-600"
      }`}>
        {String(value ?? "")}
      </span>
    );
  }

  // Show featured badge
  if (column === "featured") {
    return value ? (
      <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">Featured</span>
    ) : (
      <span className="text-xs text-slate-400">—</span>
    );
  }

  // Format dates
  if (column === "date" && value) {
    return new Date(value).toLocaleDateString();
  }

  // Truncate long text
  const textValue = String(value ?? "");
  return textValue.length > 50 ? textValue.substring(0, 50) + "..." : textValue;
}

export default function DataTable({
  loading,
  columns,
  items,
  onEdit,
  onDelete,
  selectable = false,
  selectedIds = [],
  onToggleSelect,
  onToggleSelectAll,
  reorderable = false,
  onReorder
}) {
  const [dragIndex, setDragIndex] = useState(null);

  if (loading) return <p className="p-5 text-sm text-slate-600">Loading...</p>;
  if (items.length === 0) return <p className="p-5 text-sm text-slate-600">No items yet. Create one to get started.</p>;

  const selected = new Set(selectedIds);
  const allSelected = items.length > 0 && items.every((item) => selected.has(item._id));

  function handleDrop(targetIndex) {
    if (dragIndex === null || dragIndex === targetIndex) return setDragIndex(null);
    const next = [...items];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(targetIndex, 0, moved);
    setDragIndex(null);
    onReorder?.(next);
  }

  return (
    <table className="w-full text-left text-sm">
      <thead className="bg-slate-50 text-slate-600">
        <tr>
          {reorderable && <th className="w-8 p-3" />}
          {selectable && (
            <th className="w-10 p-3">
              <input type="checkbox" checked={allSelected} onChange={onToggleSelectAll} aria-label="Select all" />
            </th>
          )}
          {columns.map((column) => <th className="p-3 font-semibold" key={column}>{column}</th>)}
          <th className="p-3 font-semibold">Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => (
          <tr
            className={`border-t hover:bg-slate-50 ${dragIndex === index ? "opacity-40" : ""}`}
            key={item._id}
            draggable={reorderable}
            onDragStart={reorderable ? () => setDragIndex(index) : undefined}
            onDragOver={reorderable ? (e) => e.preventDefault() : undefined}
            onDrop={reorderable ? () => handleDrop(index) : undefined}
          >
            {reorderable && (
              <td className="cursor-grab p-3 text-slate-400" title="Drag to reorder">
                <GripVertical size={16} />
              </td>
            )}
            {selectable && (
              <td className="p-3">
                <input
                  type="checkbox"
                  checked={selected.has(item._id)}
                  onChange={() => onToggleSelect?.(item._id)}
                  aria-label="Select row"
                />
              </td>
            )}
            {columns.map((column) => (
              <td className="p-3" key={column}>
                {renderCellValue(item[column], column, item)}
              </td>
            ))}
            <td className="whitespace-nowrap p-3">
              <button className="mr-3 text-sm font-medium text-brand hover:text-brand-dark" onClick={() => onEdit(item)}>Edit</button>
              <button className="text-sm font-medium text-red-600 hover:text-red-700" onClick={() => onDelete(item)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
