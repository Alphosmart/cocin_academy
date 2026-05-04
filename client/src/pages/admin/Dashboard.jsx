import { BookOpen, Calendar, FileText, Images, MessageSquare, Users } from "lucide-react";
import http from "../../api/http";
import { useApi } from "../../hooks/useApi";
import StatCard from "../../components/admin/StatCard";

const cards = [
  ["Posts", "/blogs", FileText],
  ["Gallery", "/gallery", Images],
  ["Events", "/events", Calendar],
  ["Staff", "/staff", Users],
  ["Messages", "/contact", MessageSquare],
  ["Programs", "/academics", BookOpen]
];

export default function Dashboard() {
  return <div><h1 className="text-3xl font-black">Dashboard Overview</h1><div className="mt-6 grid gap-5 md:grid-cols-3">{cards.map(([label, endpoint, Icon]) => <Stat key={label} label={label} endpoint={endpoint} Icon={Icon} />)}</div></div>;
}

function Stat({ label, endpoint, Icon }) {
  const { data } = useApi(() => http.get(endpoint), [endpoint]);
  return <StatCard label={label} value={Array.isArray(data) ? data.length : 0} icon={Icon} />;
}
