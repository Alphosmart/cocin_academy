import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import http from "../../api/http";
import { ADMIN_LOGIN_PATH } from "../../config/admin";

export default function PasswordReset() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [requested, setRequested] = useState(false);

  async function submit(event) {
    event.preventDefault();
    if (token && password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      if (token) {
        const response = await http.post("/auth/password/reset", { token, password });
        toast.success(response.data.message);
        navigate(ADMIN_LOGIN_PATH, { replace: true });
      } else {
        const response = await http.post("/auth/password/forgot", { email });
        setRequested(true);
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to process the password request.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 p-4">
      <form onSubmit={submit} className="card w-full max-w-md p-6">
        <h1 className="text-2xl font-black">{token ? "Set a new password" : "Forgot password"}</h1>
        {token ? (
          <>
            <label className="mt-5 block">
              <span className="label">New password</span>
              <input className="input" type="password" autoComplete="new-password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} />
            </label>
            <label className="mt-4 block">
              <span className="label">Confirm new password</span>
              <input className="input" type="password" autoComplete="new-password" minLength={8} required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
            </label>
          </>
        ) : (
          <>
            <p className="mt-3 text-sm text-slate-600">Enter your admin email and we’ll send a one-time password link if an account matches.</p>
            <label className="mt-5 block">
              <span className="label">Email</span>
              <input className="input" type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} />
            </label>
            {requested && <p className="mt-3 text-sm text-slate-600">If an account exists for that email, a password link has been sent.</p>}
          </>
        )}
        <button className="btn-primary mt-6 w-full" disabled={submitting}>
          {submitting ? "Please wait..." : token ? "Save password" : "Send password link"}
        </button>
        <div className="mt-4 text-center">
          <Link className="text-sm font-semibold text-blue-700 hover:underline" to={ADMIN_LOGIN_PATH}>Back to login</Link>
        </div>
      </form>
    </main>
  );
}