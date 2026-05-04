import http from "../../api/http";
import { useApi } from "../../hooks/useApi";
import Loader from "../../components/public/Loader";
import ErrorMessage from "../../components/public/ErrorMessage";
import { EventCard } from "../../components/public/Cards";
import { defaultEvents } from "../../data/defaultContent";

export default function Events() {
  const { data, loading, error } = useApi(() => http.get("/events"), [], { fallbackData: defaultEvents });
  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  const now = new Date();
  const upcoming = data.filter((e) => new Date(e.date) >= now);
  const past = data.filter((e) => new Date(e.date) < now);
  return <main className="container-pad py-14"><h1 className="text-4xl font-black">Events</h1><h2 className="mt-8 text-2xl font-bold">Upcoming events</h2><div className="mt-4 grid gap-5 md:grid-cols-3">{upcoming.map((event) => <EventCard key={event._id} event={event} />)}</div><h2 className="mt-12 text-2xl font-bold">Past events</h2><div className="mt-4 grid gap-5 md:grid-cols-3">{past.map((event) => <EventCard key={event._id} event={event} />)}</div></main>;
}
