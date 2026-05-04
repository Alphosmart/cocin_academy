export default function ErrorMessage({ message }) {
  return <div className="container-pad py-12 text-sm text-red-700">{message || "Unable to load content."}</div>;
}
