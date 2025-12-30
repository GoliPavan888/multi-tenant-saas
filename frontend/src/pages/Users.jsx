import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Users() {
  const { user, loading: authLoading } = useAuth();
  const tenantId = user?.tenantId || user?.tenant?.id;

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!tenantId) {
      setError("Tenant not resolved");
      setLoading(false);
      return;
    }

    const loadUsers = async () => {
      try {
        const res = await api.get(`/tenants/${tenantId}/users`);
        setUsers(res.data?.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [authLoading, tenantId]);

  if (authLoading || loading) return <p>Loading users...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Users</h2>

      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.email}</td>
                <td>{u.fullName}</td>
                <td>{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
