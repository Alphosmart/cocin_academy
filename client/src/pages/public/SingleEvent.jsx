import { useParams } from "react-router-dom";
import http from "../../api/http";
import { useApi } from "../../hooks/useApi";
import Loader from "../../components/public/Loader";
import ErrorMessage from "../../components/public/ErrorMessage";
import { defaultEvents } from "../../data/defaultContent";

export default function SingleEvent() {
  const { slug } = useParams();
  const fallbackEvent = defaultEvents.find((event) => event.slug === slug);
  const { data, loading, error } = useApi(() => http.get(`/events/${slug}`), [slug], { fallbackData: fallbackEvent });
  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  return <main className="container-pad py-14"><article className="mx-auto max-w-4xl"><h1 className="text-4xl font-black">{data.title}</h1><p className="mt-3 text-slate-600">{new Date(data.date).toLocaleDateString()} {data.time && `at ${data.time}`} {data.location && `| ${data.location}`}</p><img src={data.image || "https://placehold.co/1000x500"} className="mt-8 aspect-[16/8] w-full rounded-lg object-cover" alt="" /><div className="prose mt-8 max-w-none" dangerouslySetInnerHTML={{ __html: data.description }} /></article></main>;
}
