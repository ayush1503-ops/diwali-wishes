import axios from "axios";

const API = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// Attach JWT to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("dw_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  register: (data) => API.post("/auth/register", data),
  login: (data) => API.post("/auth/login", data),
  forgotPassword: (data) => API.post("/auth/forgot-password", data),
};

export const wishAPI = {
  generate: (data) => API.post("/wishes/generate", data),
  getPublic: (slug) => API.get(`/wishes/public/${slug}`),
  getMy: () => API.get("/wishes/my"),
  update: (id, data) => API.patch(`/wishes/${id}`, data),
  remove: (id) => API.delete(`/wishes/${id}`),
  share: (id) => API.post(`/wishes/${id}/share`),
  download: (id) => API.post(`/wishes/${id}/download`),
};

export const adminAPI = {
  getTemplates: () => API.get("/admin/templates"),
  createTemplate: (data) => API.post("/admin/templates", data),
  updateTemplate: (id, data) => API.patch(`/admin/templates/${id}`, data),
  getAnalytics: () => API.get("/admin/analytics"),
  getUsers: () => API.get("/admin/users"),
  toggleUserStatus: (id) => API.patch(`/admin/users/${id}/block`),
};

export default API;
