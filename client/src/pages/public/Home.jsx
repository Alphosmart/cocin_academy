import { BookOpen, CheckCircle2, ChevronLeft, ChevronRight, GraduationCap, HeartHandshake, MapPin, Phone, ShieldCheck, Sparkles } from "lucide-react";
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

const quickLinks = [
  {
    title: "Admissions",
    text: "Enrollment for all grades is through a diagnostic test. Reading Readiness and Learning to Read/Grade 1 placements follow Academic Information instructional manuals.",
    to: "/admissions"
  },
  {
    title: "About Us",
    text: "COCIN Academy provides a Biblically-based worldview of learning that prepares the hearts, minds, and spirits of learners.",
    to: "/about"
  },
  {
    title: "Academic Programs",
    text: "Prekindergarten through Grade 12, with mastery-based, individualized learning and Bible-integrated curriculum.",
    to: "/academics"
  },
  {
    title: "Faith and Spiritual Growth",
    text: "Chapel, Bible memory work, discipleship, and the 90 ideal traits of Jesus Christ shape school life.",
    to: "#faith"
  }
];

const values = [
  {
    title: "Faith",
    text: "Teaching boys and girls to grow in the love of God and in the knowledge of our Lord Jesus Christ."
  },
  {
    title: "Excellence",
    text: "A mastery-based curriculum supported by individualized learning methodology."
  },
  {
    title: "Integrity",
    text: "Character training built around the 90 traits demonstrated in the life of Jesus Christ, with corresponding Bible memory verses."
  },
  {
    title: "Service",
    text: "Growing a heart of total devotion to God and love for humanity."
  }
];

const faithStatements = [
  "The verbal inspiration of the Bible, equally and in all parts, and without error.",
  "One God, eternally existent as Father, Son, and Holy Spirit, who created man by a direct, immediate act.",
  "The preexistence, incarnation, virgin birth, sinless life, miracles, substitutionary death, bodily resurrection, ascension to Heaven, and second coming of the Lord Jesus Christ.",
  "The fall of man, the need for regeneration by the Holy Spirit through personal faith in Jesus Christ as Saviour on the basis of grace alone, and the resurrection of every person to either eternal life or eternal damnation.",
  "The spiritual relationship of all believers in the Lord Jesus Christ, living righteous lives, separated from the world, and witnessing of His saving grace through the Holy Spirit.",
  "The Biblical mandate of the Great Commandment and the Great Commission for all believers to proclaim the Gospel and disciple all nations."
];

const admissionsSteps = [
  "Fill out the online application form.",
  "Submit required documents: birth certificate, immunization record, previous school records, and a soft copy of the applicant's passport photograph.",
  "Attend the compulsory parents orientation programme for all new families.",
  "Attend a parent-student interview.",
  "Receive admission confirmation."
];

const fees = [
  ["Prekindergarten", "N237,000"],
  ["Reading Readiness", "N272,000"],
  ["Learning to Read/Grade 1", "N281,000"],
  ["Grades 2-6", "N312,500"],
  ["Middle School", "N339,500"],
  ["High School", "N335,500"]
];

const subjects = ["Math", "English", "Word Building", "Literature and Creative Writing", "Science", "Social Studies", "Bible Reading"];
const activities = ["Arts and crafts", "Worship and choir", "Sports huddles", "Press club", "ICT and web design", "Community service projects"];
const schoolEvents = ["Yearly inter-house sports week", "Cultural Christmas program", "Field trips", "National, Regional, and International Student Conventions", "COCIN Academy yearly thanksgiving Sunday service", "Graduation and special resurrection programs"];
const IMAGE_SLIDE_MS = 6500;
const VIDEO_FALLBACK_MS = 45000;

function normalizeHeroSlide(slide = {}) {
  const media = slide.media || slide.video || slide.image || "";
  const mediaType = slide.mediaType || (slide.video ? "video" : "image");
  return { ...slide, media, mediaType };
}

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
    const slides = Array.isArray(data.heroSlides) ? data.heroSlides.map(normalizeHeroSlide).filter((slide) => slide.isActive !== false && (slide.title || slide.subtitle || slide.media)) : [];
    const primarySlide = normalizeHeroSlide({
      title: data.heroTitle,
      subtitle: data.heroSubtitle,
      media: data.heroMediaActive === false ? "" : data.heroMedia || data.heroVideo || data.heroImage,
      mediaType: data.heroMediaType || (data.heroVideo ? "video" : "image"),
      image: data.heroImage,
      ctaLabel: "Admissions",
      ctaLink: "/admissions"
    });
    if (primarySlide.media) return [primarySlide, ...slides];
    if (slides.length > 0) return slides;
    return [primarySlide];
  }, [data]);
  const slide = heroSlides[activeSlide] || heroSlides[0] || {};

  useEffect(() => {
    setActiveSlide(0);
  }, [heroSlides.length]);

  useEffect(() => {
    if (heroSlides.length < 2) return undefined;
    if (slide.mediaType === "video" && slide.media) {
      const timer = window.setTimeout(() => {
        setActiveSlide((current) => (current + 1) % heroSlides.length);
      }, VIDEO_FALLBACK_MS);
      return () => window.clearTimeout(timer);
    }
    const timer = window.setTimeout(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, IMAGE_SLIDE_MS);
    return () => window.clearTimeout(timer);
  }, [heroSlides.length, slide.media, slide.mediaType]);

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
          {slide.mediaType === "video" && slide.media ? (
            <video
              key={slide.media}
              className="h-full w-full object-cover opacity-55 transition-opacity duration-500"
              poster={slide.image || undefined}
              autoPlay
              muted
              playsInline
              onEnded={() => {
                if (heroSlides.length > 1) goToSlide(activeSlide + 1);
              }}
            >
              <source src={slide.media} />
            </video>
          ) : (
            <img src={slide.media || slide.image || "https://placehold.co/1600x900"} alt="" className="h-full w-full object-cover opacity-55 transition-opacity duration-500" />
          )}
          <div className="absolute inset-0 bg-slate-950/45" />
        </div>
        <div className="container-pad relative flex min-h-[620px] items-center py-16">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-accent">{settings?.motto}</p>
            <h1 className="text-4xl font-black leading-tight md:text-6xl">{slide.title}</h1>
            <p className="mt-5 max-w-2xl text-lg text-slate-100">{slide.subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="btn-primary" to={slide.ctaLink || "/admissions"}>{slide.ctaLabel || "Admissions"}</Link>
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
      <section className="bg-white py-12">
        <div className="container-pad">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-lg font-semibold leading-8 text-slate-800">
              Finally, brethren, whatsoever things are true, whatsoever things are honest, whatsoever things are pure,
              whatsoever things are lovely, whatsoever things are of good report; if there be any virtue, and if there be
              any praise, think on these things.
            </p>
            <p className="mt-3 text-sm font-bold uppercase tracking-wide text-brand">Philippians 4:8</p>
          </div>
        </div>
      </section>
      <section className="container-pad py-16">
        <SectionTitle eyebrow="Welcome" title="Biblically-based learning for the whole child" text={data.aboutPreview} />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((item) => (
            <Link className="card p-6 transition hover:-translate-y-1 hover:shadow-md" to={item.to} key={item.title}>
              <h3 className="font-bold text-slate-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="bg-white py-16" id="faith">
        <div className="container-pad grid gap-8 lg:grid-cols-2">
          <div className="rounded-lg bg-brand p-8 text-white">
            <div className="flex items-center gap-3"><ShieldCheck /><h2 className="text-3xl font-black">Our Mission</h2></div>
            <p className="mt-4 leading-7 text-[#eef8fc]">
              The school seeks to build lives on the Solid Rock, Christ Jesus our Lord, and to be involved in true
              Christian education for children, meeting their spiritual, social, mental, and physical needs.
            </p>
          </div>
          <div className="rounded-lg bg-slate-950 p-8 text-white">
            <div className="flex items-center gap-3"><Sparkles className="text-accent" /><h2 className="text-3xl font-black">Vision</h2></div>
            <p className="mt-4 leading-7 text-slate-100">
              Training children through total education, which is only found in Christ Jesus. It is life that begets
              life: a holistic education, one child at a time for Christ.
            </p>
          </div>
        </div>
      </section>
      <section className="container-pad py-16">
        <SectionTitle eyebrow="Core Values" title="Character formed in Christ" />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {values.map((item) => (
            <div className="card p-6" key={item.title}>
              <h3 className="text-lg font-bold text-slate-950">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-white py-16">
        <div className="container-pad">
          <SectionTitle eyebrow="Admissions" title="How to apply" text="Our admissions process helps the school understand each learner and place them where they can grow well." />
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="card p-6">
              <div className="grid gap-4">
                {admissionsSteps.map((step, index) => (
                  <div className="flex gap-3" key={step}>
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand text-sm font-bold text-white">{index + 1}</span>
                    <p className="pt-1 text-sm leading-6 text-slate-700">{step}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="card overflow-hidden">
              <div className="bg-slate-950 px-6 py-4 text-white">
                <h3 className="text-xl font-bold">First Term Tuition</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {fees.map(([level, amount]) => (
                  <div className="flex items-center justify-between gap-4 px-6 py-3 text-sm" key={level}>
                    <span className="font-medium text-slate-700">{level}</span>
                    <span className="font-bold text-brand">{amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="container-pad py-16">
        <SectionTitle eyebrow="Why Choose Us" title="Learning shaped by faith, mastery, and care" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.whyChooseUs?.map((item) => (
            <div className="card p-6" key={item.title}>
              <CheckCircle2 className="text-brand" />
              <h3 className="mt-4 font-bold text-slate-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-white py-16">
        <div className="container-pad">
          <SectionTitle eyebrow="Academics" title="Programs designed for growth" text="From Prekindergarten to Grade 12, learners build strong academic foundations through mastery-based instruction." />
          <div className="grid gap-5 md:grid-cols-3">{academics.data?.slice(0, 3).map((p) => <div className="card overflow-hidden" key={p._id}><img src={p.image || "https://placehold.co/800x500"} className="h-44 w-full object-cover" alt="" /><div className="p-5"><h3 className="font-bold">{p.title}</h3><p className="mt-2 text-sm text-slate-600">{p.description}</p></div></div>)}</div>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="card p-6">
              <div className="flex items-center gap-3"><BookOpen className="text-brand" /><h3 className="text-xl font-bold">Core Curriculum</h3></div>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {subjects.map((subject) => <span className="rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700" key={subject}>{subject}</span>)}
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">Additional electives are available for high school students, including college-level options for advanced learners.</p>
            </div>
            <div className="card p-6">
              <div className="flex items-center gap-3"><GraduationCap className="text-brand" /><h3 className="text-xl font-bold">Extracurricular Activities</h3></div>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {activities.map((activity) => <span className="rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700" key={activity}>{activity}</span>)}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="container-pad py-16"><div className="card flex flex-col justify-between gap-6 bg-brand p-8 text-white md:flex-row md:items-center"><div><h2 className="text-3xl font-bold">{data.admissionsCtaTitle}</h2><p className="mt-2 text-[#eef8fc]">{data.admissionsCtaText}</p></div><Link className="btn bg-white text-brand hover:bg-[#eef8fc]" to="/admissions">Apply now</Link></div></section>
      <section className="bg-white py-16">
        <div className="container-pad grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionTitle eyebrow="Faith" title="Spiritual growth in daily school life" text="Opening exercises include chapel services, learning centre devotion, Bible memory work, and weekly inspirational activities." />
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {["Christian discipleship", "Mission and outreach", "Parents, staff, and community"].map((title, index) => (
              <div className="card p-6" key={title}>
                <HeartHandshake className="text-brand" />
                <h3 className="mt-4 font-bold text-slate-950">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {index === 0 && "Students are mentored by the school chaplain and pastors in Christ-like character and Biblical virtues."}
                  {index === 1 && "Students are encouraged through conventions, mission trips, evangelism, and charity work."}
                  {index === 2 && "Parents-staff-fellowship and volunteer opportunities strengthen partnership across the school community."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="container-pad py-16">
        <SectionTitle eyebrow="Statement of Faith" title="What COCIN Academy believes" />
        <div className="grid gap-3">
          {faithStatements.map((statement, index) => (
            <div className="card flex gap-4 p-5" key={statement}>
              <span className="font-black text-brand">{String.fromCharCode(65 + index)}.</span>
              <p className="text-sm leading-6 text-slate-700">{statement}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-white py-16"><div className="container-pad"><SectionTitle eyebrow="News" title="Latest updates" /><div className="grid gap-5 md:grid-cols-3">{blogs.data?.slice(0, 3).map((post) => <BlogCard key={post._id} post={post} />)}</div></div></section>
      <section className="container-pad py-16"><SectionTitle eyebrow="Gallery" title="Life on campus" /><div className="grid gap-5 md:grid-cols-3">{gallery.data?.filter((g) => g.featured).slice(0, 3).map((item) => <GalleryCard key={item._id} item={item} />)}</div></section>
      <section className="bg-white py-16"><div className="container-pad"><SectionTitle eyebrow="Events" title="Upcoming events" /><div className="grid gap-5 md:grid-cols-2">{events.data?.slice(0, 2).map((event) => <EventCard key={event._id} event={event} />)}</div></div></section>
      <section className="container-pad py-16">
        <SectionTitle eyebrow="School Events" title="Community life through the year" />
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {schoolEvents.map((event) => <div className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700" key={event}>{event}</div>)}
        </div>
      </section>
      <section className="container-pad py-16"><SectionTitle eyebrow="Families" title="What our community says" /><div className="grid gap-5 md:grid-cols-2">{testimonials.data?.slice(0, 2).map((item) => <TestimonialCard key={item._id} item={item} />)}</div></section>
      <section className="bg-white py-16">
        <div className="container-pad grid gap-8 lg:grid-cols-2">
          <div>
            <SectionTitle eyebrow="Contact" title="Talk to the school" text="Send a message and our team will respond promptly." />
            <div className="mt-6 grid gap-4 text-sm text-slate-700">
              <p className="flex gap-3"><MapPin className="mt-1 h-5 w-5 shrink-0 text-brand" />900241 Cadastral Street, Plot 5/7 Durumi District, Area 1, F.C.T. Abuja</p>
              <p className="flex gap-3"><Phone className="mt-1 h-5 w-5 shrink-0 text-brand" />07046272361, 09018690022, 08180705629</p>
              <p className="font-medium text-brand">cocinacademy07@gmail.com</p>
              <p>cocinacademyabuja.com</p>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
