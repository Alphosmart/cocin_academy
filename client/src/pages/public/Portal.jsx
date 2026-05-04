import { ExternalLink } from "lucide-react";
import { useOutletContext } from "react-router-dom";

export default function Portal() {
  const { settings } = useOutletContext();
  return <main className="container-pad py-20"><div className="max-w-2xl"><p className="text-sm font-semibold uppercase tracking-wide text-gold">School Portal</p><h1 className="mt-2 text-4xl font-black">Access the existing school portal</h1><p className="mt-4 text-slate-600">Parents, students, and staff can continue to use the official portal for records, assignments, payments, and account services.</p><a className="btn-primary mt-8" href={settings?.portalUrl || "#"} target="_blank" rel="noreferrer"><ExternalLink size={18} /> Open portal</a></div></main>;
}
