import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, BookOpen, Calendar, ExternalLink, Eye, FileText, Home, Images, Mail, Users } from "lucide-react";
import http from "../../api/http";
import StatCard from "../../components/admin/StatCard";

const gettingStarted = [
  ["Edit your homepage", "/admin/homepage", Home],
  ["Add a blog post or news", "/admin/blog", FileText],
  ["Add photos to the gallery", "/admin/gallery", Images],
  ["Update school settings", "/admin/settings", Users]
];

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    http.get("/analytics/summary")
      .then((res) => setSummary(res.data))
      .catch(() => setSummary(null))
      .finally(() => setLoading(false));
  }, []);

  const maxDaily = Math.max(1, ...(summary?.daily?.map((d) => d.count) || [1]));

  return (
    <div>
      <h1 className="text-3xl font-black">Dashboard Overview</h1>

      <section className="card mt-6 border-l-4 border-brand p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold">Getting started</h2>
            <p className="text-sm text-slate-600">New here? Pick a task below to start editing your website. Your changes go live as soon as you save.</p>
          </div>
          <a href="/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark">
            View your live site <ExternalLink size={16} />
          </a>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {gettingStarted.map(([label, to, Icon]) => (
            <Link key={to} to={to} className="flex items-center justify-between gap-2 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-brand hover:text-brand">
              <span className="flex items-center gap-2"><Icon size={18} /> {label}</span>
              <ArrowRight size={16} className="shrink-0" />
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Views (30d)" value={summary?.views?.last30 ?? "—"} icon={Eye} />
        <StatCard label="Views (7d)" value={summary?.views?.last7 ?? "—"} icon={BarChart3} />
        <StatCard label="Blog posts" value={summary?.content?.blogs ?? "—"} icon={FileText} />
        <StatCard label="Unread messages" value={summary?.unreadMessages ?? "—"} icon={Mail} />
        <StatCard label="Events" value={summary?.content?.events ?? "—"} icon={Calendar} />
        <StatCard label="Gallery items" value={summary?.content?.gallery ?? "—"} icon={Images} />
        <StatCard label="Staff" value={summary?.content?.staff ?? "—"} icon={Users} />
        <StatCard label="Total views" value={summary?.views?.total ?? "—"} icon={BookOpen} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="card p-5">
          <h2 className="text-lg font-bold">Page views (last 30 days)</h2>
          {loading ? (
            <p className="mt-4 text-sm text-slate-500">Loading…</p>
          ) : !summary?.daily?.length ? (
            <p className="mt-4 text-sm text-slate-500">No view data yet. Views are collected as visitors browse the public site.</p>
          ) : (
            <div className="mt-4 flex h-40 items-end gap-1">
              {summary.daily.map((d) => (
                <div key={d.date} className="group relative flex-1" title={`${d.date}: ${d.count}`}>
                  <div className="rounded-t bg-brand/70 transition-all group-hover:bg-brand" style={{ height: `${(d.count / maxDaily) * 100}%`, minHeight: "2px" }} />
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="card p-5">
          <h2 className="text-lg font-bold">Top pages</h2>
          {loading ? (
            <p className="mt-4 text-sm text-slate-500">Loading…</p>
          ) : !summary?.topPages?.length ? (
            <p className="mt-4 text-sm text-slate-500">No data yet.</p>
          ) : (
            <ul className="mt-4 space-y-2 text-sm">
              {summary.topPages.map((p) => (
                <li key={p.path} className="flex items-center justify-between gap-3">
                  <span className="truncate text-slate-700">{p.path}</span>
                  <span className="shrink-0 font-semibold text-slate-900">{p.count}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="card mt-6 p-5">
        <h2 className="text-lg font-bold">Recent activity</h2>
        {summary?.recentActivity?.length ? (
          <ul className="mt-4 divide-y divide-slate-100 text-sm">
            {summary.recentActivity.map((log) => (
              <li key={log._id} className="flex items-center justify-between gap-3 py-2">
                <span className="text-slate-700">
                  <span className="font-medium">{log.userName || "System"}</span> {log.action} {log.resource}
                  {log.detail ? ` — ${log.detail}` : ""}
                </span>
                <span className="shrink-0 text-xs text-slate-400">{new Date(log.createdAt).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-slate-500">No recent activity.</p>
        )}
      </section>
    </div>
  );
}
