import API from "./axiosInstance";

// SIGNUP API
export const signupApi = async (data) => {
  try {
    const response = await API.post("/api/auth/signup", data);
    return response.data; 
  } catch (error) {
    const msg = error.response?.data?.message || "Signup failed";
    throw new Error(msg);
  }
};

// LOGIN API
export const loginApi = async (data) => {
  try {
    const response = await API.post("/api/auth/login", data);
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.message || "Login failed";
    throw new Error(msg);
  }
};

// GET CURRENT USER
export const getMeApi = async () => {
  try {
    const response = await API.get("/api/auth/me");
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.message || "Failed to load profile";
    throw new Error(msg);
  }
};
