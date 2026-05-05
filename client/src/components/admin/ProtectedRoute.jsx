import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ADMIN_LOGIN_PATH } from "../../config/admin";

export default function ProtectedRoute() {
  const { user, booting } = useAuth();
  if (booting) return <div className="p-8 text-sm text-slate-600">Loading...</div>;
  if (!user) return <Navigate to={ADMIN_LOGIN_PATH} replace />;
  return <Outlet />;
}
