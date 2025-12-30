import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function SuperAdminDashboard() {
  const { user } = useAuth();

  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔹 Load all tenants (super admin only)
  const loadTenants = async () => {
    try {
      setLoading(true);
      const res = await api.get("/tenants");

      console.log("Tenants API response:", res.data);

      // backend may return:
      // { success:true, data:{ tenants:[...] } }
      // OR
      // { success:true, data:[...] }
      const data =
        res.data?.data?.tenants ||
        res.data?.data ||
        [];

      setTenants(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load tenants");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Update tenant (plan / status)
  const updateTenant = async (tenantId, payload) => {
    try {
      console.log("Updating tenant:", tenantId, payload);

      await api.put(`/tenants/${tenantId}`, payload);

      // refresh list after update
      loadTenants();
    } catch (err) {
      console.error("Update failed:", err.response?.data);
      alert(err.response?.data?.message || "Update failed");
    }
  };

  useEffect(() => {
    loadTenants();
  }, []);

  if (loading) return <p>Loading tenants...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Super Admin Dashboard</h1>

      <p><b>Email:</b> {user.email}</p>
      <p><b>Role:</b> Super Admin</p>

      <h2>All Tenants</h2>

      {tenants.length === 0 ? (
        <p>No tenants found</p>
      ) : (
        <table border="1" cellPadding="8" cellSpacing="0">
          <thead>
            <tr>
              <th>Name</th>
              <th>Subdomain</th>
              <th>Status</th>
              <th>Plan</th>
              <th>Change</th>
            </tr>
          </thead>

          <tbody>
            {tenants.map((t) => (
              <tr key={t.id}>
                <td>{t.name}</td>
                <td>{t.subdomain}</td>
                <td>{t.status}</td>
                <td>{t.subscriptionPlan}</td>
                <td>
                  {/* 🔹 CHANGE PLAN */}
                  <select
                    value={t.subscriptionPlan}
                    onChange={(e) =>
                      updateTenant(t.id, {
                        subscriptionPlan: e.target.value
                      })
                    }
                  >
                    <option value="free">free</option>
                    <option value="pro">pro</option>
                    <option value="enterprise">enterprise</option>
                  </select>

                  {/* 🔹 CHANGE STATUS */}
                  <select
                    value={t.status}
                    onChange={(e) =>
                      updateTenant(t.id, {
                        status: e.target.value
                      })
                    }
                    style={{ marginLeft: "8px" }}
                  >
                    <option value="active">active</option>
                    <option value="suspended">suspended</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
