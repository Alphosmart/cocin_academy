import { useMemo, useState } from "react";
import http from "../../api/http";
import { useApi } from "../../hooks/useApi";
import Loader from "../../components/public/Loader";
import ErrorMessage from "../../components/public/ErrorMessage";
import { GalleryCard } from "../../components/public/Cards";
import { defaultGallery } from "../../data/defaultContent";

export default function Gallery() {
  const [category, setCategory] = useState("");
  const [active, setActive] = useState(null);
  const { data, loading, error } = useApi(() => http.get("/gallery"), [], { fallbackData: defaultGallery });
  const items = useMemo(() => (data || []).filter((i) => !category || i.category === category), [data, category]);
  const categories = [...new Set((data || []).map((i) => i.category))];
  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  return <main className="container-pad py-14"><h1 className="text-4xl font-black">Gallery</h1><select className="input mt-6 max-w-xs" value={category} onChange={(e) => setCategory(e.target.value)}><option value="">All categories</option>{categories.map((c) => <option key={c}>{c}</option>)}</select><div className="mt-8 grid gap-5 md:grid-cols-3">{items.map((item) => <GalleryCard key={item._id} item={item} onOpen={setActive} />)}</div>{active && <button className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4" onClick={() => setActive(null)}><img src={active.image} alt={active.title} className="max-h-[85vh] rounded-lg object-contain" /></button>}</main>;
}
