import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Role: {user?.role}</p>
      <p>Tenant ID: {user?.tenantId || "SYSTEM"}</p>

      <button onClick={logout}>Logout</button>
    </div>
  );
}
