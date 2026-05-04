import http from "../../api/http";
import { useApi } from "../../hooks/useApi";
import Loader from "../../components/public/Loader";
import ErrorMessage from "../../components/public/ErrorMessage";
import { defaultAdmissions } from "../../data/defaultContent";

export default function Admissions() {
  const { data, loading, error } = useApi(() => http.get("/admissions"), [], { fallbackData: defaultAdmissions });
  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  return <main className="container-pad py-14"><h1 className="text-4xl font-black">{data.title}</h1><article className="prose mt-6 max-w-none" dangerouslySetInnerHTML={{ __html: data.content }} /><section className="mt-10 grid gap-6 md:grid-cols-2"><div className="card p-6"><h2 className="text-2xl font-bold">Requirements</h2><ul className="mt-4 space-y-2">{data.requirements?.map((r) => <li key={r}>{r}</li>)}</ul></div><div className="card p-6"><h2 className="text-2xl font-bold">Process</h2><div className="mt-4 space-y-4">{data.processSteps?.map((s) => <div key={s.title}><h3 className="font-semibold">{s.title}</h3><p className="text-sm text-slate-600">{s.description}</p></div>)}</div></div></section></main>;
}
