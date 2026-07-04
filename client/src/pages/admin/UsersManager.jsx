import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import http from "../../api/http";
import { TextInput } from "../../components/admin/FormControls";
import ConfirmDeleteModal from "../../components/admin/ConfirmDeleteModal";
import DataTable from "../../components/admin/DataTable";
import { scrollToTop } from "../../utils/scroll";

const initialFormState = {
  name: "",
  email: "",
  password: "",
  isActive: true
};

export default function UsersManager() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState(null);
  const ITEMS_PER_PAGE = 10;

  async function loadUsers() {
    try {
      setLoading(true);
      const res = await http.get("/users");
      setUsers(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Unable to load users.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function resetForm() {
    setForm(initialFormState);
    setEditing(null);
  }

  function setValue(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function edit(user) {
    setEditing(user._id);
    setForm({
      name: user.name || "",
      email: user.email || "",
      password: "",
      isActive: user.isActive !== false
    });
    scrollToTop();
  }

  async function submit(event) {
    event.preventDefault();
    try {
      const payload = {
        name: form.name,
        email: form.email,
        isActive: form.isActive
      };
      if (!editing) {
        payload.password = form.password;
      }

      if (editing) {
        await http.put(`/users/${editing}`, payload);
        toast.success("User updated successfully");
      } else {
        await http.post("/users", payload);
        toast.success("User created successfully");
      }

      resetForm();
      loadUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Unable to save user.");
    }
  }

  async function remove() {
    try {
      await http.delete(`/users/${pendingDelete._id}`);
      toast.success("User deleted successfully");
      setPendingDelete(null);
      loadUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Unable to delete user.");
    }
  }

  const filteredUsers = users
    .filter((user) =>
      search === "" ||
      [user.name, user.email].some((value) => String(value || "").toLowerCase().includes(search.toLowerCase()))
    );

  const pagedUsers = filteredUsers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div>
      <h1 className="text-3xl font-black text-slate-950">Admin Users</h1>
      <form onSubmit={submit} className="mt-6 grid gap-5">
        <div className="card p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <TextInput label="Name" value={form.name} onChange={(e) => setValue("name", e.target.value)} required />
            <TextInput label="Email" type="email" value={form.email} onChange={(e) => setValue("email", e.target.value)} required />
            {!editing && <TextInput label="Password" type="password" value={form.password} onChange={(e) => setValue("password", e.target.value)} required />}
            <label className="block">
              <span className="label">Active</span>
              <div className="mt-2 flex items-center gap-2">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setValue("isActive", e.target.checked)} />
                <span className="text-sm text-slate-600">Allow sign in</span>
              </div>
            </label>
          </div>
          {editing && <p className="mt-3 text-sm text-slate-500">Leave password blank. Password changes are managed in your own account settings.</p>}
        </div>
        <div className="flex gap-3">
          <button className="btn-primary" type="submit">{editing ? "Update user" : "Create user"}</button>
          {editing && <button type="button" className="btn-secondary" onClick={resetForm}>Cancel</button>}
        </div>
      </form>

      <div className="card mt-8">
        <div className="border-b border-slate-200 p-4">
          <input
            type="text"
            placeholder="Search users..."
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
            columns={["name", "email", "isActive"]}
            items={pagedUsers}
            onEdit={edit}
            onDelete={setPendingDelete}
          />
        </div>
        {filteredUsers.length > ITEMS_PER_PAGE && (
          <div className="border-t border-slate-200 p-4 flex items-center justify-between text-sm">
            <p className="text-slate-600">
              Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredUsers.length)}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)} of {filteredUsers.length}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                className="btn-secondary px-3 py-1 disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              >
                Previous
              </button>
              <button
                type="button"
                className="btn-secondary px-3 py-1 disabled:opacity-50"
                disabled={currentPage * ITEMS_PER_PAGE >= filteredUsers.length}
                onClick={() => setCurrentPage((page) => page + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmDeleteModal
        open={Boolean(pendingDelete)}
        title="Delete admin user?"
        message={`Delete ${pendingDelete?.name || "this user"} permanently?`}
        onCancel={() => setPendingDelete(null)}
        onConfirm={remove}
      />
    </div>
  );
}
