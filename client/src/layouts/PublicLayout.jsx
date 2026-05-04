import { Facebook, Instagram, Menu, MessageCircle, X, Youtube } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import http from "../api/http";
import { useApi } from "../hooks/useApi";
import { defaultSettings } from "../data/defaultContent";

const links = [
  ["Home", "/"],
  ["About", "/about"],
  ["Academics", "/academics"],
  ["Admissions", "/admissions"],
  ["Blog", "/blog"],
  ["Gallery", "/gallery"],
  ["Events", "/events"],
  ["Staff", "/staff"],
  ["FAQ", "/faq"],
  ["Contact", "/contact"]
];

export default function PublicLayout() {
  const [open, setOpen] = useState(false);
  const { data: settings } = useApi(() => http.get("/settings"), [], { fallbackData: defaultSettings });
  const portal = settings?.portalUrl || "#";
  const whatsapp = settings?.whatsapp?.replace(/[^\d]/g, "");

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="container-pad flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            {settings?.logo ? <img src={settings.logo} alt="" className="h-11 w-11 rounded-md object-cover" /> : <div className="h-11 w-11 rounded-md bg-brand" />}
            <span className="max-w-[180px] text-lg font-bold leading-tight text-slate-950">{settings?.schoolName || "School"}</span>
          </Link>
          <nav className="hidden items-center gap-5 lg:flex">
            {links.map(([label, to]) => <NavLink key={to} to={to} className={({ isActive }) => `text-sm font-medium ${isActive ? "text-brand" : "text-slate-700 hover:text-brand"}`}>{label}</NavLink>)}
            <a className="btn-primary" href={portal} target="_blank" rel="noreferrer">School Portal</a>
          </nav>
          <button className="btn-secondary lg:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
        {open && (
          <nav className="container-pad grid gap-2 pb-5 lg:hidden">
            {links.map(([label, to]) => <NavLink key={to} onClick={() => setOpen(false)} to={to} className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">{label}</NavLink>)}
            <a className="btn-primary mt-2" href={portal} target="_blank" rel="noreferrer">School Portal</a>
          </nav>
        )}
      </header>
      <Outlet context={{ settings }} />
      {whatsapp && <a className="fixed bottom-5 right-5 z-40 rounded-full bg-green-600 p-4 text-white shadow-lg" href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle /></a>}
      <footer className="border-t border-slate-200 bg-white">
        <div className="container-pad grid gap-8 py-12 md:grid-cols-4">
          <div>
            <h2 className="text-xl font-bold text-slate-950">{settings?.schoolName}</h2>
            <p className="mt-3 text-sm text-slate-600">{settings?.footerText}</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-950">Quick Links</h3>
            <div className="mt-3 grid gap-2 text-sm">{links.slice(1, 6).map(([label, to]) => <Link key={to} to={to} className="text-slate-600 hover:text-brand">{label}</Link>)}</div>
            <Link to="/admin/login" className="mt-3 inline-flex text-sm font-medium text-slate-500 hover:text-brand">Admin Login</Link>
          </div>
          <div>
            <h3 className="font-semibold text-slate-950">Contact</h3>
            <p className="mt-3 text-sm text-slate-600">{settings?.address}</p>
            <p className="mt-2 text-sm text-slate-600">{settings?.phone}</p>
            <p className="mt-2 text-sm text-slate-600">{settings?.email}</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-950">Connect</h3>
            <div className="mt-3 flex gap-3">
              {settings?.facebookUrl && <a href={settings.facebookUrl}><Facebook size={20} /></a>}
              {settings?.instagramUrl && <a href={settings.instagramUrl}><Instagram size={20} /></a>}
              {settings?.youtubeUrl && <a href={settings.youtubeUrl}><Youtube size={20} /></a>}
            </div>
            <a className="btn-primary mt-5" href={portal} target="_blank" rel="noreferrer">School Portal</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
