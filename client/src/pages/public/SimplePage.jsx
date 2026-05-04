import { useParams } from "react-router-dom";
import http from "../../api/http";
import { useApi } from "../../hooks/useApi";
import Loader from "../../components/public/Loader";
import ErrorMessage from "../../components/public/ErrorMessage";
import { setSeo } from "../../utils/seo";
import { defaultPages } from "../../data/defaultContent";

const titles = { about: "About Us", "privacy-policy": "Privacy Policy" };

export default function SimplePage({ slug: fixedSlug }) {
  const params = useParams();
  const slug = fixedSlug || params.slug;
  const { data, loading, error } = useApi(() => http.get(`/pages/${slug}`), [slug], { fallbackData: defaultPages[slug] });
  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  setSeo(data.seoTitle || data.title, data.seoDescription || data.excerpt);
  return (
    <main className="container-pad py-14">
      <p className="text-sm font-semibold uppercase tracking-wide text-accent">{titles[slug] || "Page"}</p>
      <h1 className="mt-2 text-4xl font-black text-slate-950">{data.title}</h1>
      {data.excerpt && <p className="mt-4 max-w-3xl text-lg text-slate-600">{data.excerpt}</p>}
      <article className="prose mt-8 max-w-none" dangerouslySetInnerHTML={{ __html: data.content }} />
      {(data.mission || data.vision) && <div className="mt-10 grid gap-5 md:grid-cols-2">{data.mission && <div className="card p-6"><h2>Mission</h2><p>{data.mission}</p></div>}{data.vision && <div className="card p-6"><h2>Vision</h2><p>{data.vision}</p></div>}</div>}
      {data.coreValues?.length > 0 && <div className="mt-10"><h2 className="text-2xl font-bold">Core values</h2><div className="mt-4 flex flex-wrap gap-2">{data.coreValues.map((v) => <span className="rounded-md bg-[#e7f0f2] px-3 py-2 text-sm font-medium text-brand" key={v}>{v}</span>)}</div></div>}
    </main>
  );
}
