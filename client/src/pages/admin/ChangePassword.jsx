import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import http from "../../api/http";

export default function ChangePassword() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  async function onSubmit(values) {
    try {
      await http.put("/auth/change-password", values);
      toast.success("Password changed");
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not change password");
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card max-w-xl p-6">
      <h1 className="text-3xl font-black">Change Password</h1>
      <label className="mt-5 block">
        <span className="label">Current password</span>
        <input
          className="input"
          type="password"
          autoComplete="current-password"
          {...register("currentPassword", { required: "Current password is required", minLength: { value: 8, message: "Current password must be at least 8 characters" } })}
        />
        {errors.currentPassword && <span className="mt-1 block text-sm text-red-600">{errors.currentPassword.message}</span>}
      </label>
      <label className="mt-4 block">
        <span className="label">New password</span>
        <input
          className="input"
          type="password"
          autoComplete="new-password"
          {...register("newPassword", { required: "New password is required", minLength: { value: 8, message: "New password must be at least 8 characters" } })}
        />
        {errors.newPassword && <span className="mt-1 block text-sm text-red-600">{errors.newPassword.message}</span>}
      </label>
      <button className="btn-primary mt-6" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save password"}
      </button>
    </form>
  );
}
