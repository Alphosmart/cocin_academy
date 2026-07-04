import { useState } from "react";
import toast from "react-hot-toast";
import http from "../../api/http";
import { useAuth } from "../../context/AuthContext";

export default function Security() {
  const { user } = useAuth();
  const [enabled, setEnabled] = useState(Boolean(user?.twoFactorEnabled));
  const [setup, setSetup] = useState(null); // { qr, secret }
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function startSetup() {
    setBusy(true);
    try {
      const res = await http.post("/auth/2fa/setup");
      setSetup(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not start setup");
    } finally {
      setBusy(false);
    }
  }

  async function confirmEnable() {
    setBusy(true);
    try {
      await http.post("/auth/2fa/enable", { token: code });
      toast.success("Two-factor authentication enabled");
      setEnabled(true);
      setSetup(null);
      setCode("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid code");
    } finally {
      setBusy(false);
    }
  }

  async function disable() {
    setBusy(true);
    try {
      await http.post("/auth/2fa/disable", { password });
      toast.success("Two-factor authentication disabled");
      setEnabled(false);
      setPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not disable");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-black">Security</h1>
      <div className="card mt-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Two-factor authentication</h2>
            <p className="text-sm text-slate-600">Require a time-based code from an authenticator app at login.</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${enabled ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
            {enabled ? "Enabled" : "Disabled"}
          </span>
        </div>

        {!enabled && !setup && (
          <div className="mt-5">
            <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              <p className="font-semibold">Optional — only turn this on if you understand it.</p>
              <p className="mt-1">Two-factor adds extra security, but you will need a phone with an <strong>authenticator app</strong> (like Google Authenticator or Authy) installed <em>before</em> you start, and you must enter a code from it <strong>every time you log in</strong>. If you lose that phone you can be locked out. If unsure, leave this off.</p>
            </div>
            <button className="btn-primary mt-4" onClick={startSetup} disabled={busy}>Set up 2FA</button>
          </div>
        )}

        {!enabled && setup && (
          <div className="mt-5">
            <p className="text-sm text-slate-600">Scan this QR code with Google Authenticator, Authy, or a similar app.</p>
            <img src={setup.qr} alt="2FA QR code" className="mt-3 h-44 w-44 rounded border border-slate-200" />
            <p className="mt-2 break-all text-xs text-slate-500">Or enter this secret manually: <code className="font-mono">{setup.secret}</code></p>
            <label className="mt-4 block">
              <span className="label">Enter the 6-digit code</span>
              <input className="input max-w-[12rem] tracking-widest" inputMode="numeric" placeholder="123456" value={code} onChange={(e) => setCode(e.target.value)} />
            </label>
            <button className="btn-primary mt-4" onClick={confirmEnable} disabled={busy || code.length < 6}>Verify & enable</button>
          </div>
        )}

        {enabled && (
          <div className="mt-5">
            <label className="block">
              <span className="label">Confirm your password to disable</span>
              <input className="input max-w-xs" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <button className="mt-4 rounded-md bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700 disabled:opacity-50" onClick={disable} disabled={busy || password.length < 8}>
              Disable 2FA
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
