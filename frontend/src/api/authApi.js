// src/api/authApi.js
import API from "./axiosInstance";

// SIGNUP API
export const signupApi = (data) => API.post("/api/auth/signup", data);

// LOGIN API
export const loginApi = (data) => API.post("/api/auth/login", data);
