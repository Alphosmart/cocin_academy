import { ExternalLink } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { defaultSettings } from "../../data/defaultContent";

export default function Portal() {
  const { settings } = useOutletContext();
  const portalUrl = settings?.portalUrl || defaultSettings.portalUrl;

  return (
    <main className="container-pad py-20">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">School Portal</p>
        <h1 className="mt-2 text-4xl font-black text-slate-950">Parent/student login portal</h1>
        <p className="mt-4 text-slate-600">Parents, students, and staff can use the official portal for records, assignments, payments, and account services.</p>
        {portalUrl ? (
          <a className="btn-primary mt-8" href={portalUrl} target="_blank" rel="noreferrer"><ExternalLink size={18} /> Open portal</a>
        ) : (
          <p className="mt-8 rounded-md border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            The portal link has not been set up yet. An administrator can add it under Website Settings.
          </p>
        )}
      </div>
    </main>
  );
}
