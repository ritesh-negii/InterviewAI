import axios from "axios";
import { toast } from "react-hot-toast";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",
  timeout: 10000,
});

// ❌ REMOVE default Content-Type
// headers: { "Content-Type": "application/json" },

// REQUEST INTERCEPTOR
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 🔥 Only set JSON content-type if NOT sending FormData
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
API.interceptors.response.use(
  (response) => response,

  (error) => {
    const errorMsg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Something went wrong";

    toast.error(errorMsg, { id: "global-error" });

 // if (
 // error.response?.status === 401 &&
 // error.response.data?.message === "Invalid token"
//) {
 // localStorage.removeItem("token");
//}


   // return Promise.reject(error);
  }
);

export default API;
