import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import http from "../../api/http";

export default function ContactForm() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  async function onSubmit(values) {
    await http.post("/contact", values);
    toast.success("Message sent successfully");
    reset();
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card grid gap-4 p-6">
      <div>
        <label className="label">Full name</label>
        <input className="input" {...register("fullName", { required: true, minLength: 2 })} />
        {errors.fullName && <p className="mt-1 text-xs text-red-600">Full name is required.</p>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="label">Email</label><input className="input" type="email" {...register("email", { required: true })} /></div>
        <div><label className="label">Phone</label><input className="input" {...register("phone")} /></div>
      </div>
      <div><label className="label">Subject</label><input className="input" {...register("subject", { required: true })} /></div>
      <div><label className="label">Message</label><textarea className="input min-h-32" {...register("message", { required: true, minLength: 5 })} /></div>
      <button className="btn-primary" disabled={isSubmitting}>{isSubmitting ? "Sending..." : "Send message"}</button>
    </form>
  );
}
