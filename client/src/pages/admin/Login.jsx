import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();
  if (user) return <Navigate to="/admin" replace />;
  async function onSubmit(values) {
    try {
      await login(values.email, values.password);
      navigate("/admin");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  }
  return <main className="grid min-h-screen place-items-center bg-slate-100 p-4"><form onSubmit={handleSubmit(onSubmit)} className="card w-full max-w-md p-6"><h1 className="text-2xl font-black">Admin Login</h1><label className="mt-5 block"><span className="label">Email</span><input className="input" type="email" autoComplete="username" {...register("email", { required: true })} /></label><label className="mt-4 block"><span className="label">Password</span><input className="input" type="password" autoComplete="current-password" {...register("password", { required: true })} /></label><button className="btn-primary mt-6 w-full" disabled={isSubmitting}>{isSubmitting ? "Signing in..." : "Login"}</button></form></main>;
}
