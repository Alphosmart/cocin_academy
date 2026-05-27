import ResourceManager from "../../components/admin/ResourceManager";

export default function Users() {
  return <ResourceManager title="Admin Users" endpoint="/users" fields={[{ name: "name", label: "Name" }, { name: "email", label: "Email", type: "email" }, { name: "password", label: "Password", type: "password" }, { name: "isActive", label: "Active", type: "checkbox", defaultValue: true }]} columns={["name", "email", "isActive"]} />;
}
