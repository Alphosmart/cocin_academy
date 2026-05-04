import http from "../../api/http";
import { useApi } from "../../hooks/useApi";
import Loader from "../../components/public/Loader";
import ErrorMessage from "../../components/public/ErrorMessage";
import { defaultFaqs } from "../../data/defaultContent";

export default function FAQ() {
  const { data, loading, error } = useApi(() => http.get("/faqs?active=true"), [], { fallbackData: defaultFaqs });
  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  return <main className="container-pad py-14"><h1 className="text-4xl font-black">Frequently Asked Questions</h1><div className="mt-8 grid gap-4">{data.map((f) => <details className="card p-5" key={f._id}><summary className="cursor-pointer font-semibold">{f.question}</summary><p className="mt-3 text-slate-600">{f.answer}</p></details>)}</div></main>;
}
