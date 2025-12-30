import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <strong>Multi-Tenant SaaS</strong>
      </div>

      <div style={styles.right}>
        {/* DASHBOARD */}
        {user.role === "super_admin" && (
          <Link to="/superadmin/dashboard">Dashboard</Link>
        )}

        {user.role === "tenant_admin" && (
          <Link to="/tenant/dashboard">Dashboard</Link>
        )}

        {user.role === "user" && (
          <Link to="/user/dashboard">Dashboard</Link>
        )}

        {/* PROJECTS */}
        {user.role !== "super_admin" && (
          <Link to="/projects">Projects</Link>
        )}

        {/* USERS (TENANT ADMIN ONLY) */}
        {user.role === "tenant_admin" && (
          <Link to="/users">Users</Link>
        )}

        {/* TENANTS (SUPER ADMIN ONLY) */}
        {user.role === "super_admin" && (
          <Link to="/superadmin/tenants">Tenants</Link>
        )}

        <button onClick={logout} style={styles.logout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 20px",
    backgroundColor: "#222",
    color: "#fff"
  },
  left: {
    fontSize: "18px"
  },
  right: {
    display: "flex",
    gap: "15px",
    alignItems: "center"
  },
  logout: {
    background: "red",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer"
  }
};
