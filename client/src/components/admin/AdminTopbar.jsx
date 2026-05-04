export default function AdminTopbar({ user }) {
  return (
    <header className="border-b border-slate-200 bg-white px-6 py-4">
      <p className="text-sm text-slate-600">Signed in as <span className="font-semibold text-slate-950">{user?.name}</span></p>
    </header>
  );
}
