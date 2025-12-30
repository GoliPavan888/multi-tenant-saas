import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Restore session on refresh
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    api.get("/auth/me")
      .then(res => {
        setUser(res.data.data);
      })
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
  const res = await api.post("/auth/login", credentials);

  localStorage.setItem("token", res.data.data.token);

  // 🔥 FETCH FULL USER + TENANT
  const meRes = await api.get("/auth/me");

  setUser(meRes.data.data); // 👈 includes tenant
};

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
