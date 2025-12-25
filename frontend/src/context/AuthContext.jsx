import { createContext, useContext, useEffect, useState } from "react";
import { meApi } from "../services/auth.service";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (jwt) => {
    localStorage.setItem("token", jwt);
    setToken(jwt);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await meApi();
        setUser(res.data.data);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{ token, user, login, logout, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
