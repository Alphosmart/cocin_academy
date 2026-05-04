import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminTopbar from "../components/admin/AdminTopbar";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  function signOut() {
    logout();
    navigate("/admin/login");
  }
  return (
    <div className="min-h-screen bg-slate-100 lg:grid lg:grid-cols-[270px_1fr]">
      <AdminSidebar onLogout={signOut} />
      <div>
        <AdminTopbar user={user} />
        <main className="p-4 sm:p-6 lg:p-8"><Outlet /></main>
      </div>
    </div>
  );
}
