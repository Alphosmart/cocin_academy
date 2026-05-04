export default function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="card p-5">
      {Icon && <Icon className="text-brand" />}
      <p className="mt-4 text-sm text-slate-600">{label}</p>
      <p className="text-3xl font-black">{value}</p>
    </div>
  );
}
