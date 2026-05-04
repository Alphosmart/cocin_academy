import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import http from "../../api/http";

export default function ChangePassword() {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();
  async function onSubmit(values) {
    await http.put("/auth/change-password", values);
    toast.success("Password changed");
    reset();
  }
  return <form onSubmit={handleSubmit(onSubmit)} className="card max-w-xl p-6"><h1 className="text-3xl font-black">Change Password</h1><label className="mt-5 block"><span className="label">Current password</span><input className="input" type="password" {...register("currentPassword", { required: true, minLength: 8 })} /></label><label className="mt-4 block"><span className="label">New password</span><input className="input" type="password" {...register("newPassword", { required: true, minLength: 8 })} /></label><button className="btn-primary mt-6" disabled={isSubmitting}>Save password</button></form>;
}
