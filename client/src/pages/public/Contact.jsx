import { useOutletContext } from "react-router-dom";
import ContactForm from "../../components/public/ContactForm";

export default function Contact() {
  const { settings } = useOutletContext();
  return <main className="container-pad grid gap-8 py-14 lg:grid-cols-[.9fr_1.1fr]"><div><h1 className="text-4xl font-black">Contact Us</h1><p className="mt-4 text-slate-600">{settings?.address}</p><p className="mt-4 text-slate-600">{settings?.phone}</p><p className="text-slate-600">{settings?.email}</p>{settings?.googleMapEmbed && <div className="mt-8 overflow-hidden rounded-lg" dangerouslySetInnerHTML={{ __html: settings.googleMapEmbed }} />}</div><ContactForm /></main>;
}
