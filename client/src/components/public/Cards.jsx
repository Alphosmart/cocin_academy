import { Calendar, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export function BlogCard({ post }) {
  return (
    <article className="card overflow-hidden">
      <img src={post.featuredImage || "https://placehold.co/800x500"} alt="" className="h-48 w-full object-cover" />
      <div className="p-5">
        <p className="text-xs font-semibold uppercase text-accent">{post.category}</p>
        <h3 className="mt-2 text-xl font-bold text-slate-950">{post.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm text-slate-600">{post.excerpt}</p>
        <Link className="mt-4 inline-flex text-sm font-semibold text-brand" to={`/blog/${post.slug}`}>Read more</Link>
      </div>
    </article>
  );
}

export function GalleryCard({ item, onOpen }) {
  return (
    <button onClick={() => onOpen?.(item)} className="card overflow-hidden text-left">
      <img src={item.image} alt={item.title} className="h-56 w-full object-cover" />
      <div className="p-4">
        <h3 className="font-semibold text-slate-950">{item.title}</h3>
        <p className="text-sm text-slate-600">{item.category}</p>
      </div>
    </button>
  );
}

export function EventCard({ event }) {
  return (
    <article className="card overflow-hidden">
      <img src={event.image || "https://placehold.co/800x500"} alt="" className="h-44 w-full object-cover" />
      <div className="p-5">
        <h3 className="text-xl font-bold text-slate-950">{event.title}</h3>
        <p className="mt-3 flex items-center gap-2 text-sm text-slate-600"><Calendar size={16} /> {new Date(event.date).toLocaleDateString()}</p>
        {event.location && <p className="mt-1 flex items-center gap-2 text-sm text-slate-600"><MapPin size={16} /> {event.location}</p>}
        <Link className="mt-4 inline-flex text-sm font-semibold text-brand" to={`/events/${event.slug}`}>View event</Link>
      </div>
    </article>
  );
}

export function StaffCard({ member }) {
  return (
    <article className="card overflow-hidden">
      <img src={member.image || "https://placehold.co/600x600"} alt="" className="h-64 w-full object-cover" />
      <div className="p-5">
        <h3 className="font-bold text-slate-950">{member.name}</h3>
        <p className="text-sm font-medium text-brand">{member.role}</p>
        <p className="mt-2 text-sm text-slate-600">{member.qualification}</p>
      </div>
    </article>
  );
}

export function TestimonialCard({ item }) {
  return (
    <blockquote className="card p-6">
      <p className="text-slate-700">"{item.message}"</p>
      <footer className="mt-4 font-semibold text-slate-950">{item.name}<span className="block text-sm font-normal text-slate-500">{item.role}</span></footer>
    </blockquote>
  );
}
