import http from "../../api/http";
import { useApi } from "../../hooks/useApi";
import Loader from "../../components/public/Loader";
import ErrorMessage from "../../components/public/ErrorMessage";
import { StaffCard } from "../../components/public/Cards";
import { defaultStaff } from "../../data/defaultContent";

export default function Staff() {
  const { data, loading, error } = useApi(() => http.get("/staff?active=true"), [], { fallbackData: defaultStaff });
  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  return <main className="container-pad py-14"><h1 className="text-4xl font-black">Staff and Leadership</h1><div className="mt-8 grid gap-5 md:grid-cols-4">{data.map((m) => <StaffCard key={m._id} member={m} />)}</div></main>;
}
