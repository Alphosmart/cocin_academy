import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminTopbar from "../components/admin/AdminTopbar";
import { ADMIN_LOGIN_PATH } from "../config/admin";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  async function signOut() {
    await logout();
    navigate(ADMIN_LOGIN_PATH);
  }
  return (
    <div className="min-h-screen bg-slate-100 lg:grid lg:h-screen lg:grid-cols-[270px_1fr] lg:overflow-hidden">
      <div className="lg:h-screen lg:overflow-y-auto">
        <AdminSidebar onLogout={signOut} user={user} />
      </div>
      <div data-scroll-container className="lg:h-screen lg:overflow-y-auto">
        <AdminTopbar user={user} />
        <main className="p-4 sm:p-6 lg:p-8"><Outlet /></main>
      </div>
    </div>
  );
}
