import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import http from "../../api/http";
import ConfirmDeleteModal from "../../components/admin/ConfirmDeleteModal";
import { useAuth } from "../../context/AuthContext";

function formatBytes(bytes) {
  if (!bytes) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) { value /= 1024; unit += 1; }
  return `${value.toFixed(1)} ${units[unit]}`;
}

export default function FileManager() {
  const { user } = useAuth();
  const [data, setData] = useState({ files: [], total: 0, unused: 0, storage: "" });
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [onlyUnused, setOnlyUnused] = useState(false);
  const [confirming, setConfirming] = useState(false);

  function load() {
    setLoading(true);
    http.get("/files")
      .then((res) => setData(res.data))
      .catch((err) => toast.error(err.response?.data?.message || "Could not load files"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (user?.isDeveloper) load();
  }, [user?.isDeveloper]);

  // Media Files is a developer-only maintenance tool.
  if (user && !user.isDeveloper) return <Navigate to="/admin" replace />;

  const files = onlyUnused ? data.files.filter((f) => !f.used) : data.files;

  function toggle(url) {
    setSelected((cur) => (cur.includes(url) ? cur.filter((u) => u !== url) : [...cur, url]));
  }

  function selectUnused() {
    setSelected(data.files.filter((f) => !f.used).map((f) => f.url));
  }

  async function deleteSelected() {
    try {
      await http.post("/files/delete", { urls: selected });
      toast.success(`Deleted ${selected.length} file(s)`);
      setSelected([]);
      setConfirming(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-black">Media Files</h1>
      <p className="mt-1 text-sm text-slate-600">
        Storage: <span className="font-medium">{data.storage || "…"}</span> · {data.total} files · {data.unused} unused
      </p>

      <div className="card mt-6">
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 p-4 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={onlyUnused} onChange={(e) => setOnlyUnused(e.target.checked)} /> Only unused
          </label>
          <button type="button" className="btn-secondary px-3 py-1" onClick={selectUnused}>Select all unused</button>
          {selected.length > 0 && (
            <div className="ml-auto flex items-center gap-3">
              <span className="font-medium text-slate-700">{selected.length} selected</span>
              <button type="button" className="rounded-md bg-red-600 px-3 py-1 font-medium text-white hover:bg-red-700" onClick={() => setConfirming(true)}>Delete selected</button>
            </div>
          )}
        </div>

        {loading ? (
          <p className="p-5 text-sm text-slate-600">Loading...</p>
        ) : files.length === 0 ? (
          <p className="p-5 text-sm text-slate-600">No files found.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {files.map((file) => (
              <div key={file.url} className={`relative overflow-hidden rounded-lg border ${selected.includes(file.url) ? "border-brand ring-2 ring-brand" : "border-slate-200"}`}>
                <label className="absolute left-2 top-2 z-10 rounded bg-white/80 p-1">
                  <input type="checkbox" checked={selected.includes(file.url)} onChange={() => toggle(file.url)} />
                </label>
                {!file.used && <span className="absolute right-2 top-2 z-10 rounded bg-amber-500 px-1.5 py-0.5 text-[10px] font-medium text-white">unused</span>}
                <div className="aspect-square bg-slate-100">
                  <img src={file.url} alt={file.filename} className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="p-2 text-xs text-slate-500">{formatBytes(file.size)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDeleteModal
        open={confirming}
        title="Delete files?"
        message={`Permanently delete ${selected.length} file(s)? This cannot be undone.`}
        onCancel={() => setConfirming(false)}
        onConfirm={deleteSelected}
      />
    </div>
  );
}
