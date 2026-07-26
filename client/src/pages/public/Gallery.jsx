import { useEffect, useMemo, useState } from "react";
import http from "../../api/http";
import { useApi } from "../../hooks/useApi";
import Loader from "../../components/public/Loader";
import ErrorMessage from "../../components/public/ErrorMessage";
import { GalleryCard } from "../../components/public/Cards";
import { defaultGallery } from "../../data/defaultContent";

const PAGE_SIZE = 24;

export default function Gallery() {
  const [category, setCategory] = useState("");
  const [active, setActive] = useState(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const { data, loading, error } = useApi(() => http.get("/gallery"), [], { fallbackData: defaultGallery, cacheKey: "gallery" });
  const allItems = useMemo(() => data || [], [data]);
  const items = useMemo(() => allItems.filter((item) => !category || item.category === category), [allItems, category]);
  const categories = useMemo(() => [...new Set(allItems.map((item) => item.category).filter(Boolean))].sort(), [allItems]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
    setActive(null);
  }, [category]);

  useEffect(() => {
    if (!active) return undefined;

    function move(direction) {
      const activeIndex = items.findIndex((item) => item._id === active._id);
      const nextIndex = (activeIndex + direction + items.length) % items.length;
      setActive(items[nextIndex]);
    }

    function handleKeyDown(event) {
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "ArrowRight") move(1);
      if (event.key === "Escape") setActive(null);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [active, items]);

  function moveActive(direction) {
    const activeIndex = items.findIndex((item) => item._id === active._id);
    const nextIndex = (activeIndex + direction + items.length) % items.length;
    setActive(items[nextIndex]);
  }

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <main className="container-pad py-14">
      <h1 className="text-4xl font-black">Gallery</h1>
      <select className="input mt-6 max-w-xs" value={category} onChange={(event) => setCategory(event.target.value)}>
        <option value="">All categories</option>
        {categories.map((itemCategory) => <option key={itemCategory}>{itemCategory}</option>)}
      </select>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {items.slice(0, visibleCount).map((item) => <GalleryCard key={item._id} item={item} onOpen={setActive} />)}
      </div>
      {visibleCount < items.length && (
        <div className="mt-8 text-center">
          <button className="btn-primary" type="button" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>Load more</button>
        </div>
      )}
      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
          className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4 print:hidden"
          onClick={(event) => {
            if (event.target === event.currentTarget) setActive(null);
          }}
        >
          <button
            type="button"
            aria-label="Previous image"
            className="absolute left-3 grid h-12 w-12 place-items-center rounded-full bg-white/90 text-3xl font-bold text-slate-950 shadow-lg hover:bg-white md:left-8"
            onClick={() => moveActive(-1)}
          >
            ‹
          </button>
          <img src={active.image} alt={active.title} className="max-h-[85vh] max-w-[85vw] rounded-lg object-contain" />
          <button
            type="button"
            aria-label="Next image"
            className="absolute right-3 grid h-12 w-12 place-items-center rounded-full bg-white/90 text-3xl font-bold text-slate-950 shadow-lg hover:bg-white md:right-8"
            onClick={() => moveActive(1)}
          >
            ›
          </button>
          <button
            type="button"
            aria-label="Close image preview"
            className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-2xl font-bold text-slate-950 shadow-lg hover:bg-white md:right-8 md:top-6"
            onClick={() => setActive(null)}
          >
            ×
          </button>
        </div>
      )}
    </main>
  );
}
