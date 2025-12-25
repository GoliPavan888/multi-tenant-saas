import api from "./api";

export const loginApi = (email, password) =>
  api.post("/auth/login", { email, password });

export const meApi = () => api.get("/auth/me");
