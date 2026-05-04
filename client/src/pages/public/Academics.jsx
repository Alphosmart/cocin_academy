import http from "../../api/http";
import { useApi } from "../../hooks/useApi";
import Loader from "../../components/public/Loader";
import ErrorMessage from "../../components/public/ErrorMessage";
import SectionTitle from "../../components/public/SectionTitle";
import { defaultAcademics } from "../../data/defaultContent";

export default function Academics() {
  const { data, loading, error } = useApi(() => http.get("/academics?active=true"), [], { fallbackData: defaultAcademics });
  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  return <main className="container-pad py-14"><SectionTitle eyebrow="Academics" title="Academic programs" text="A balanced curriculum for confident learners." /><div className="grid gap-5 md:grid-cols-3">{data.map((p) => <article className="card overflow-hidden" key={p._id}><img src={p.image || "https://placehold.co/800x500"} alt="" className="h-48 w-full object-cover" /><div className="p-5"><p className="text-sm font-semibold text-accent">{p.level}</p><h2 className="mt-1 text-xl font-bold">{p.title}</h2><p className="mt-2 text-sm text-slate-600">{p.description}</p></div></article>)}</div></main>;
}
