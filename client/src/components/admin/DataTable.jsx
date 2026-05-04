export default function DataTable({ loading, columns, items, onEdit, onDelete }) {
  if (loading) return <p className="p-5 text-sm text-slate-600">Loading...</p>;
  return (
    <table className="w-full text-left text-sm">
      <thead className="bg-slate-50 text-slate-600">
        <tr>{columns.map((column) => <th className="p-3" key={column}>{column}</th>)}<th className="p-3">Actions</th></tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr className="border-t" key={item._id}>
            {columns.map((column) => <td className="p-3" key={column}>{String(item[column] ?? "")}</td>)}
            <td className="whitespace-nowrap p-3">
              <button className="mr-2 text-brand" onClick={() => onEdit(item)}>Edit</button>
              <button className="text-red-600" onClick={() => onDelete(item)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
