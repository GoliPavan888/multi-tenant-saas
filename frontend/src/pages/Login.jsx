import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    tenantSubdomain: ""
  });

  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    try {
      await login(form);

      // ✅ REDIRECT AFTER LOGIN
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed"
      );
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "80px auto" }}>
      <h2>Login</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        placeholder="Email"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
      />

      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={e => setForm({ ...form, password: e.target.value })}
      />

      <input
        placeholder="Tenant Subdomain"
        value={form.tenantSubdomain}
        onChange={e => setForm({ ...form, tenantSubdomain: e.target.value })}
      />

      <button onClick={submit}>Login</button>
    </div>
  );
}
