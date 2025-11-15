import axios from "axios";
import { toast } from "react-hot-toast";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Add token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE interceptor
API.interceptors.response.use(
  (response) => response,

  (error) => {
    const errorMsg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Something went wrong";

    // ❌ Before: toast.error(errorMsg);
    // ✅ After: Prevent duplicates with toastId

    toast.error(errorMsg, { id: "api-error" });

    // Auto-logout if token expired
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/auth/login";
    }

    return Promise.reject(error);
  }
);

export default API;

