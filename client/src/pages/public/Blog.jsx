import { useMemo, useState } from "react";
import http from "../../api/http";
import { useApi } from "../../hooks/useApi";
import Loader from "../../components/public/Loader";
import ErrorMessage from "../../components/public/ErrorMessage";
import { BlogCard } from "../../components/public/Cards";
import { defaultBlogs } from "../../data/defaultContent";

export default function Blog() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const { data, loading, error } = useApi(() => http.get("/blogs?status=published"), [], { fallbackData: defaultBlogs });
  const posts = useMemo(() => (data || []).filter((p) => (!search || p.title.toLowerCase().includes(search.toLowerCase())) && (!category || p.category === category)), [data, search, category]);
  const categories = [...new Set((data || []).map((p) => p.category))];
  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  return <main className="container-pad py-14"><h1 className="text-4xl font-black">Blog and News</h1><div className="mt-6 grid gap-3 md:grid-cols-[1fr_220px]"><input className="input" placeholder="Search posts" value={search} onChange={(e) => setSearch(e.target.value)} /><select className="input" value={category} onChange={(e) => setCategory(e.target.value)}><option value="">All categories</option>{categories.map((c) => <option key={c}>{c}</option>)}</select></div><div className="mt-8 grid gap-5 md:grid-cols-3">{posts.map((post) => <BlogCard key={post._id} post={post} />)}</div></main>;
}
