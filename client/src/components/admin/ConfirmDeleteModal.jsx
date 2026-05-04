import { AlertTriangle } from "lucide-react";

export default function ConfirmDeleteModal({ open, title = "Delete item?", message = "This action cannot be undone.", onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="rounded-md bg-red-50 p-2 text-red-600"><AlertTriangle size={22} /></div>
          <div>
            <h2 className="text-lg font-bold text-slate-950">{title}</h2>
            <p className="mt-1 text-sm text-slate-600">{message}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
          <button type="button" className="btn bg-red-600 text-white hover:bg-red-700 focus:ring-red-600" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}
