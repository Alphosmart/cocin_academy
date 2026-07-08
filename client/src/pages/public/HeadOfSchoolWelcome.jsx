import http from "../../api/http";
import { useApi } from "../../hooks/useApi";
import Loader from "../../components/public/Loader";
import ErrorMessage from "../../components/public/ErrorMessage";
import { setSeo } from "../../utils/seo";

export default function HeadOfSchoolWelcome() {
  const { data, loading, error } = useApi(
    () => http.get("/pages/head-of-school-welcome"),
    [],
    { cacheKey: "head-of-school-welcome" }
  );

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  setSeo(
    data.seoTitle || "Head of School Welcome",
    data.seoDescription || "A warm welcome message from the Head of School"
  );

  return (
    <main className="container-pad py-14">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand">Leadership</p>
      <h1 className="mt-2 text-4xl font-black text-slate-950">{data.title || "Head of School"}</h1>

      <div className="mt-12 grid gap-10 md:grid-cols-3">
        {/* Principal Profile */}
        <div className="md:col-span-1">
          <div className="card overflow-hidden">
            {data.principalImage && (
              <img
                src={data.principalImage}
                alt={data.principalName || "Head of School"}
                className="h-96 w-full object-cover"
              />
            )}
            <div className="p-6">
              <h2 className="text-xl font-bold text-slate-950">{data.principalName}</h2>
              <p className="mt-1 text-sm font-medium text-brand">Head of School</p>
              {data.principalQualification && (
                <p className="mt-3 text-sm text-slate-600">{data.principalQualification}</p>
              )}
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="md:col-span-2">
          <div className="prose max-w-none">
            {data.content && (
              <div dangerouslySetInnerHTML={{ __html: data.content }} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
