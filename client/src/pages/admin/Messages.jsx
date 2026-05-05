import toast from "react-hot-toast";
import { useState } from "react";
import http from "../../api/http";
import { useApi } from "../../hooks/useApi";
import ConfirmDeleteModal from "../../components/admin/ConfirmDeleteModal";

export default function Messages() {
  const [pendingDelete, setPendingDelete] = useState(null);
  const { data = [], loading, reload } = useApi(() => http.get("/contact"), []);
  async function markRead(id) { await http.put(`/contact/${id}/read`); toast.success("Marked as read"); reload(); }
  async function remove() { await http.delete(`/contact/${pendingDelete._id}`); toast.success("Deleted"); setPendingDelete(null); reload(); }
  return (
    <div>
      <h1 className="text-3xl font-black">Contact Messages</h1>
      <div className="card mt-6 overflow-x-auto">
        {loading ? (
          <p className="p-5">Loading...</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Contact</th>
                <th className="p-3">Subject</th>
                <th className="p-3">Message</th>
                <th className="p-3">Read</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((m) => (
                <tr className="border-t align-top" key={m._id}>
                  <td className="p-3 font-medium">{m.fullName}</td>
                  <td className="p-3">
                    <a className="block text-slate-600 hover:text-brand" href={`mailto:${m.email}`}>{m.email}</a>
                    {m.phone ? (
                      <a className="mt-1 block text-slate-600 hover:text-brand" href={`tel:${m.phone}`}>{m.phone}</a>
                    ) : (
                      <span className="mt-1 block text-slate-400">No phone provided</span>
                    )}
                  </td>
                  <td className="p-3">{m.subject}</td>
                  <td className="p-3">{m.message}</td>
                  <td className="p-3">{m.isRead ? "Yes" : "No"}</td>
                  <td className="p-3">
                    <button className="mr-2 text-brand" onClick={() => markRead(m._id)}>Read</button>
                    <button className="text-red-600" onClick={() => setPendingDelete(m)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <ConfirmDeleteModal
        open={Boolean(pendingDelete)}
        title="Delete message?"
        message={`Delete the message from ${pendingDelete?.fullName || "this contact"}?`}
        onCancel={() => setPendingDelete(null)}
        onConfirm={remove}
      />
    </div>
  );
}
