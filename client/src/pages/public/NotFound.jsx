import { Link } from "react-router-dom";

export default function NotFound() {
  return <main className="container-pad py-24"><h1 className="text-5xl font-black">Page not found</h1><p className="mt-4 text-slate-600">The page you requested does not exist.</p><Link className="btn-primary mt-8" to="/">Go home</Link></main>;
}
