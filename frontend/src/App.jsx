import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import TenantDashboard from "./pages/TenantDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import Users from "./pages/Users";
import Projects from "./pages/Projects";

function Protected({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" />;
  return children;
}

function DashboardRouter() {
  const { user } = useAuth();

  if (user.role === "super_admin") return <SuperAdminDashboard />;
  if (user.role === "tenant_admin") return <TenantDashboard />;
  return <UserDashboard />;
}

function RoleRoute({ role, children }) {
  const { user } = useAuth();
  if (user.role !== role) return <Navigate to="/dashboard" />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <Protected>
                <DashboardRouter />
              </Protected>
            }
          />

          <Route
            path="/users"
            element={
              <Protected>
                <RoleRoute role="tenant_admin">
                  <Users />
                </RoleRoute>
              </Protected>
            }
          />

          <Route
            path="/projects"
            element={
              <Protected>
                <Projects />
              </Protected>
            }
          />

          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
