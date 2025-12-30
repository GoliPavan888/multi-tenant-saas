import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function TenantDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return <p>Loading dashboard...</p>;

  return (
    <div style={container}>
      <h2>Tenant Admin Dashboard</h2>

      <div style={card}>
        <h3>Welcome, {user.fullName}</h3>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> Tenant Admin</p>

        <hr />

        <h4>Tenant Information</h4>
        <p>
          <strong>Tenant ID:</strong>{" "}
          {user.tenantId || user.tenant?.id}
        </p>
      </div>

      <div style={actions}>
        <button
          type="button"
          onClick={() => navigate("/projects")}
        >
          View Projects
        </button>

        <button
          type="button"
          onClick={() => navigate("/users")}
        >
          Manage Users
        </button>
      </div>
    </div>
  );
}

const container = { padding: "30px" };
const card = {
  background: "#1e1e1e",
  padding: "20px",
  borderRadius: "8px",
  maxWidth: "500px",
  marginBottom: "20px"
};
const actions = { display: "flex", gap: "15px" };
