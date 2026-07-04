import { Activity, BookOpen, Calendar, ExternalLink, FileText, FolderOpen, HelpCircle, Home, Images, LayoutDashboard, LogOut, MessageSquare, Quote, Settings, Shield, Users } from "lucide-react";
import { NavLink } from "react-router-dom";

const nav = [
  ["Overview", "/admin", LayoutDashboard],
  ["Settings", "/admin/settings", Settings],
  ["Homepage", "/admin/homepage", Home],
  ["Pages", "/admin/pages", FileText],
  ["Blog", "/admin/blog", FileText],
  ["Gallery", "/admin/gallery", Images],
  ["Events", "/admin/events", Calendar],
  ["Academics", "/admin/academics", BookOpen],
  ["Admissions", "/admin/admissions", BookOpen],
  ["Staff", "/admin/staff", Users],
  ["Testimonials", "/admin/testimonials", Quote],
  ["FAQ", "/admin/faqs", HelpCircle],
  ["Messages", "/admin/messages", MessageSquare],
  ["Activity Log", "/admin/activity", Activity],
  ["Admin Users", "/admin/users", Users]
];

// Developer-only entries appended to the nav for developer accounts.
const developerNav = [
  ["Media Files", "/admin/files", FolderOpen]
];

export default function AdminSidebar({ onLogout, user }) {
  const items = user?.isDeveloper ? [...nav, ...developerNav] : nav;
  return (
    <aside className="border-r border-slate-200 bg-slate-950 p-4 text-white lg:min-h-screen">
      <div className="mb-6 px-2 text-xl font-black">School CMS</div>
      <nav className="grid gap-1">
        {items.map(([label, to, Icon]) => (
          <NavLink key={to} end={to === "/admin"} to={to} className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-2 text-sm ${isActive ? "bg-white text-slate-950" : "text-slate-300 hover:bg-slate-900"}`}>
            <Icon size={18} /> {label}
          </NavLink>
        ))}
        <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-slate-900"><ExternalLink size={18} /> View live site</a>
        <NavLink to="/admin/security" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-slate-900"><Shield size={18} /> Security (2FA)</NavLink>
        <NavLink to="/admin/change-password" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-slate-900"><Settings size={18} /> Change Password</NavLink>
        <button onClick={onLogout} className="flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-slate-300 hover:bg-slate-900"><LogOut size={18} /> Logout</button>
      </nav>
    </aside>
  );
}
