import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, tenant, role, logout } = useAuth();

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>

      <p><b>Email:</b> {user?.email}</p>
      <p><b>Role:</b> {role}</p>

      {tenant && (
        <>
          <p><b>Tenant:</b> {tenant.name}</p>
          <p><b>Plan:</b> {tenant.subscriptionPlan}</p>
        </>
      )}

      <hr />

      {role === "tenant_admin" && (
        <>
          <h3>Tenant Admin Actions</h3>
          <ul>
            <li>Manage Projects</li>
            <li>Manage Users</li>
            <li>View Tasks</li>
          </ul>
        </>
      )}

      {role === "user" && (
        <>
          <h3>User Actions</h3>
          <ul>
            <li>View Assigned Tasks</li>
          </ul>
        </>
      )}

      <button onClick={logout}>Logout</button>
    </div>
  );
}
