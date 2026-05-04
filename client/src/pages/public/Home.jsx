import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import http from "../../api/http";
import { useApi } from "../../hooks/useApi";
import Loader from "../../components/public/Loader";
import ErrorMessage from "../../components/public/ErrorMessage";
import SectionTitle from "../../components/public/SectionTitle";
import { BlogCard, EventCard, GalleryCard, TestimonialCard } from "../../components/public/Cards";
import ContactForm from "../../components/public/ContactForm";
import { setSeo } from "../../utils/seo";
import {
  defaultAcademics,
  defaultBlogs,
  defaultEvents,
  defaultGallery,
  defaultHomepage,
  defaultTestimonials
} from "../../data/defaultContent";

export default function Home() {
  const { settings } = useOutletContext();
  const [activeSlide, setActiveSlide] = useState(0);
  const home = useApi(() => http.get("/homepage"), [], { fallbackData: defaultHomepage });
  const blogs = useApi(() => http.get("/blogs?status=published"), [], { fallbackData: defaultBlogs });
  const gallery = useApi(() => http.get("/gallery"), [], { fallbackData: defaultGallery });
  const events = useApi(() => http.get("/events"), [], { fallbackData: defaultEvents });
  const testimonials = useApi(() => http.get("/testimonials?active=true"), [], { fallbackData: defaultTestimonials });
  const academics = useApi(() => http.get("/academics?active=true"), [], { fallbackData: defaultAcademics });

  const data = home.data || defaultHomepage;
  const heroSlides = useMemo(() => {
    const slides = Array.isArray(data.heroSlides) ? data.heroSlides.filter((slide) => slide.title || slide.subtitle || slide.image) : [];
    if (slides.length > 0) return slides;
    return [{
      title: data.heroTitle,
      subtitle: data.heroSubtitle,
      image: data.heroImage,
      ctaLabel: "Admissions",
      ctaLink: "/admissions"
    }];
  }, [data]);
  const slide = heroSlides[activeSlide] || heroSlides[0] || {};

  useEffect(() => {
    setActiveSlide(0);
  }, [heroSlides.length]);

  useEffect(() => {
    if (heroSlides.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [heroSlides.length]);

  function goToSlide(index) {
    setActiveSlide((index + heroSlides.length) % heroSlides.length);
  }

  setSeo(data.seoTitle || settings?.seoTitle, data.seoDescription || settings?.seoDescription);

  if (home.loading) return <Loader />;
  if (home.error) return <ErrorMessage message={home.error} />;

  return (
    <>
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0">
          <img src={slide.image || "https://placehold.co/1600x900"} alt="" className="h-full w-full object-cover opacity-55 transition-opacity duration-500" />
          <div className="absolute inset-0 bg-slate-950/45" />
        </div>
        <div className="container-pad relative flex min-h-[620px] items-center py-16">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-gold">{settings?.motto}</p>
            <h1 className="text-4xl font-black leading-tight md:text-6xl">{slide.title}</h1>
            <p className="mt-5 max-w-2xl text-lg text-slate-100">{slide.subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="btn-primary" to={slide.ctaLink || "/admissions"}>{slide.ctaLabel || "Admissions"}</Link>
              <a className="btn border-white/70 bg-white/10 text-white hover:bg-white/20 focus:ring-white" href={settings?.portalUrl} target="_blank" rel="noreferrer">School Portal</a>
            </div>
          </div>
          {heroSlides.length > 1 && (
            <>
              <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
                {heroSlides.map((item, index) => (
                  <button
                    type="button"
                    key={`${item.title}-${index}`}
                    className={`h-2.5 rounded-full transition-all ${index === activeSlide ? "w-8 bg-white" : "w-2.5 bg-white/50 hover:bg-white/80"}`}
                    onClick={() => goToSlide(index)}
                    aria-label={`Show slide ${index + 1}`}
                  />
                ))}
              </div>
              <div className="absolute bottom-7 right-4 flex gap-2 sm:right-6 lg:right-8">
                <button type="button" className="grid h-10 w-10 place-items-center rounded-full border border-white/60 bg-white/10 text-white hover:bg-white/20" onClick={() => goToSlide(activeSlide - 1)} aria-label="Previous slide"><ChevronLeft size={20} /></button>
                <button type="button" className="grid h-10 w-10 place-items-center rounded-full border border-white/60 bg-white/10 text-white hover:bg-white/20" onClick={() => goToSlide(activeSlide + 1)} aria-label="Next slide"><ChevronRight size={20} /></button>
              </div>
            </>
          )}
        </div>
      </section>
      <section className="container-pad py-16">
        <SectionTitle eyebrow="About" title="A strong start for every learner" text={data.aboutPreview} />
        <div className="grid gap-4 md:grid-cols-3">{data.whyChooseUs?.map((item) => <div className="card p-6" key={item.title}><h3 className="font-bold text-slate-950">{item.title}</h3><p className="mt-2 text-sm text-slate-600">{item.description}</p></div>)}</div>
      </section>
      <section className="bg-white py-16"><div className="container-pad"><SectionTitle eyebrow="Academics" title="Programs designed for growth" /><div className="grid gap-5 md:grid-cols-3">{academics.data?.slice(0, 3).map((p) => <div className="card overflow-hidden" key={p._id}><img src={p.image || "https://placehold.co/800x500"} className="h-44 w-full object-cover" alt="" /><div className="p-5"><h3 className="font-bold">{p.title}</h3><p className="mt-2 text-sm text-slate-600">{p.description}</p></div></div>)}</div></div></section>
      <section className="container-pad py-16"><div className="card flex flex-col justify-between gap-6 bg-brand p-8 text-white md:flex-row md:items-center"><div><h2 className="text-3xl font-bold">{data.admissionsCtaTitle}</h2><p className="mt-2 text-teal-50">{data.admissionsCtaText}</p></div><Link className="btn bg-white text-brand hover:bg-slate-100" to="/admissions">Apply now</Link></div></section>
      <section className="bg-white py-16"><div className="container-pad"><SectionTitle eyebrow="News" title="Latest updates" /><div className="grid gap-5 md:grid-cols-3">{blogs.data?.slice(0, 3).map((post) => <BlogCard key={post._id} post={post} />)}</div></div></section>
      <section className="container-pad py-16"><SectionTitle eyebrow="Gallery" title="Life on campus" /><div className="grid gap-5 md:grid-cols-3">{gallery.data?.filter((g) => g.featured).slice(0, 3).map((item) => <GalleryCard key={item._id} item={item} />)}</div></section>
      <section className="bg-white py-16"><div className="container-pad"><SectionTitle eyebrow="Events" title="Upcoming events" /><div className="grid gap-5 md:grid-cols-2">{events.data?.slice(0, 2).map((event) => <EventCard key={event._id} event={event} />)}</div></div></section>
      <section className="container-pad py-16"><SectionTitle eyebrow="Families" title="What our community says" /><div className="grid gap-5 md:grid-cols-2">{testimonials.data?.slice(0, 2).map((item) => <TestimonialCard key={item._id} item={item} />)}</div></section>
      <section className="bg-white py-16"><div className="container-pad grid gap-8 lg:grid-cols-2"><SectionTitle eyebrow="Contact" title="Talk to the school" text="Send a message and our team will respond promptly." /><ContactForm /></div></section>
    </>
  );
}
