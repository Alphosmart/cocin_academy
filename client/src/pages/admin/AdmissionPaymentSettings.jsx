import { CreditCard } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import http from "../../api/http";

const defaultForm = {
  applicationFeeEnabled: false,
  applicationFeeAmount: 0,
  applicationFeeCurrency: "NGN",
  paymentProvider: "paystack"
};

function formatFee(amount, currency = "NGN") {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(Number(amount || 0));
}

export default function AdmissionPaymentSettings() {
  const [admissions, setAdmissions] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const response = await http.get("/admissions");
        setAdmissions(response.data);
        setForm({
          applicationFeeEnabled: Boolean(response.data.applicationFeeEnabled),
          applicationFeeAmount: response.data.applicationFeeAmount ?? 0,
          applicationFeeCurrency: response.data.applicationFeeCurrency || "NGN",
          paymentProvider: response.data.paymentProvider || "paystack"
        });
      } catch (err) {
        toast.error(err.response?.data?.message || "Unable to load admission payment settings");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  function setValue(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    const amount = Number(form.applicationFeeAmount || 0);
    if (form.applicationFeeEnabled && amount <= 0) {
      toast.error("Enter an application fee amount before requiring payment.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...(admissions || {}),
        applicationFeeEnabled: Boolean(form.applicationFeeEnabled),
        applicationFeeAmount: amount,
        applicationFeeCurrency: form.applicationFeeCurrency || "NGN",
        paymentProvider: form.paymentProvider || "paystack"
      };
      const response = await http.put("/admissions", payload);
      setAdmissions(response.data);
      toast.success("Admission payment settings saved");
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to save admission payment settings");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-black text-slate-950">Admission Payment</h1>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Control whether applicants must pay before the admission form opens.</p>

      <form className="card mt-6 max-w-3xl p-6" onSubmit={submit}>
        {loading ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : (
          <div className="grid gap-6">
            <div className="flex flex-col gap-4 rounded-md border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-950">Require payment before form access</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Current status: <span className={form.applicationFeeEnabled ? "font-semibold text-emerald-700" : "font-semibold text-slate-700"}>{form.applicationFeeEnabled ? "Payment required" : "Payment not required"}</span>
                </p>
              </div>
              <label className="inline-flex items-center gap-3 text-sm font-semibold text-slate-700">
                <input
                  className="h-5 w-5 rounded border-slate-300 text-brand focus:ring-brand"
                  type="checkbox"
                  checked={form.applicationFeeEnabled}
                  onChange={(event) => setValue("applicationFeeEnabled", event.target.checked)}
                />
                Enforce payment
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label>
                <span className="label">Application fee amount</span>
                <input
                  className="input"
                  min="0"
                  step="1"
                  type="number"
                  value={form.applicationFeeAmount}
                  onChange={(event) => setValue("applicationFeeAmount", event.target.value)}
                />
              </label>
              <label>
                <span className="label">Currency</span>
                <select className="input" value={form.applicationFeeCurrency} onChange={(event) => setValue("applicationFeeCurrency", event.target.value)}>
                  <option value="NGN">NGN</option>
                </select>
              </label>
              <label className="sm:col-span-2">
                <span className="label">Payment provider</span>
                <select className="input" value={form.paymentProvider} onChange={(event) => setValue("paymentProvider", event.target.value)}>
                  <option value="paystack">Paystack</option>
                </select>
              </label>
            </div>

            <div className="rounded-md border border-brand/20 bg-brand/5 p-4">
              <div className="flex items-center gap-2 text-sm font-bold text-brand">
                <CreditCard size={18} />
                Applicant charge
              </div>
              <p className="mt-2 text-2xl font-black text-slate-950">{formatFee(form.applicationFeeAmount, form.applicationFeeCurrency)}</p>
              <p className="mt-1 text-sm text-slate-600">Paystack receives the amount in kobo automatically.</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button className="btn-primary" disabled={saving} type="submit">
                {saving ? "Saving..." : "Save payment settings"}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
