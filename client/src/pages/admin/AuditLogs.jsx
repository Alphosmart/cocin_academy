import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import http from "../../api/http";

const ACTION_STYLES = {
  create: "bg-emerald-100 text-emerald-700",
  update: "bg-amber-100 text-amber-700",
  delete: "bg-red-100 text-red-700",
  login: "bg-blue-100 text-blue-700",
  logout: "bg-slate-100 text-slate-600",
  bulk: "bg-purple-100 text-purple-700",
  reorder: "bg-indigo-100 text-indigo-700"
};

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [action, setAction] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    http.get("/audit-logs", { params: action ? { action } : {} })
      .then((res) => setLogs(res.data))
      .catch((err) => toast.error(err.response?.data?.message || "Could not load logs"))
      .finally(() => setLoading(false));
  }, [action]);

  return (
    <div>
      <h1 className="text-3xl font-black">Activity Log</h1>
      <p className="mt-1 text-sm text-slate-600">Recent admin actions across the site. Entries are kept for 90 days.</p>

      <div className="card mt-6">
        <div className="border-b border-slate-200 p-4">
          <select className="input max-w-xs" value={action} onChange={(e) => setAction(e.target.value)}>
            <option value="">All actions</option>
            {["create", "update", "delete", "bulk", "reorder", "login", "logout"].map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <p className="p-5 text-sm text-slate-600">Loading...</p>
          ) : logs.length === 0 ? (
            <p className="p-5 text-sm text-slate-600">No activity recorded yet.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="p-3 font-semibold">When</th>
                  <th className="p-3 font-semibold">User</th>
                  <th className="p-3 font-semibold">Action</th>
                  <th className="p-3 font-semibold">Resource</th>
                  <th className="p-3 font-semibold">Detail</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr className="border-t" key={log._id}>
                    <td className="whitespace-nowrap p-3 text-slate-500">{new Date(log.createdAt).toLocaleString()}</td>
                    <td className="p-3">{log.userName || log.userEmail || "—"}</td>
                    <td className="p-3">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${ACTION_STYLES[log.action] || "bg-slate-100 text-slate-600"}`}>{log.action}</span>
                    </td>
                    <td className="p-3">{log.resource}</td>
                    <td className="p-3 text-slate-600">{log.detail || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
