import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute() {
  const { user, booting } = useAuth();
  if (booting) return <div className="p-8 text-sm text-slate-600">Loading...</div>;
  if (!user) return <Navigate to="/admin/login" replace />;
  return <Outlet />;
}
