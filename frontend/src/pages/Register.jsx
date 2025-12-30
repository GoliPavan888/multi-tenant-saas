import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    tenantName: "",
    subdomain: "",
    fullName: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/registerTenant", form);
      alert("Registration successful. Please login.");
      navigate("/login");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "80px auto" }}>
      <h2>Register Tenant</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
  <input
    name="tenantName"
    placeholder="Company Name"
    onChange={handleChange}
    required
    style={{ padding: "10px" }}
  />

  <input
    name="subdomain"
    placeholder="Subdomain (e.g. demo)"
    onChange={handleChange}
    required
    style={{ padding: "10px" }}
  />

  <input
    name="fullName"
    placeholder="Admin Full Name"
    onChange={handleChange}
    required
    style={{ padding: "10px" }}
  />

  <input
    type="email"
    name="email"
    placeholder="Admin Email"
    onChange={handleChange}
    required
    style={{ padding: "10px" }}
  />

  <input
    type="password"
    name="password"
    placeholder="Password"
    onChange={handleChange}
    required
    style={{ padding: "10px" }}
  />

  <button
    type="submit"
    disabled={loading}
    style={{
      padding: "10px",
      background: "#4f46e5",
      color: "white",
      border: "none",
      cursor: "pointer"
    }}
  >
    {loading ? "Registering..." : "Register"}
  </button>
</form>

    </div>
  );
}
