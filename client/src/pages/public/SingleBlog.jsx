import { useParams } from "react-router-dom";
import http from "../../api/http";
import { useApi } from "../../hooks/useApi";
import Loader from "../../components/public/Loader";
import ErrorMessage from "../../components/public/ErrorMessage";
import { setSeo } from "../../utils/seo";
import { defaultBlogs } from "../../data/defaultContent";

export default function SingleBlog() {
  const { slug } = useParams();
  const fallbackPost = defaultBlogs.find((post) => post.slug === slug);
  const { data, loading, error } = useApi(() => http.get(`/blogs/${slug}`), [slug], { fallbackData: fallbackPost });
  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  setSeo(data.seoTitle || data.title, data.seoDescription || data.excerpt);
  return <main className="container-pad py-14"><article className="mx-auto max-w-4xl"><p className="text-sm font-semibold uppercase text-accent">{data.category}</p><h1 className="mt-2 text-4xl font-black">{data.title}</h1><p className="mt-3 text-slate-500">{new Date(data.createdAt).toLocaleDateString()} by {data.author}</p><img src={data.featuredImage || "https://placehold.co/1000x500"} alt="" className="mt-8 aspect-[16/8] w-full rounded-lg object-cover" /><div className="prose mt-8 max-w-none" dangerouslySetInnerHTML={{ __html: data.content }} /></article></main>;
}
