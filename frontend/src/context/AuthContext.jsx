import { createContext, useState, useEffect, useContext } from "react";
import { loginApi, signupApi, getMeApi } from "../api/authApi";
import toast from "react-hot-toast";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      setLoading(false);
      return;
    }

    try {
      const res = await getMeApi();
      setUser(res.user);
      setToken(storedToken);
    } catch {
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  // ✅ ADD THIS: Refresh user data function
  const refreshUser = async () => {
    try {
      const res = await getMeApi();
      setUser(res.user);
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  };

  // 🔵 SIGNUP + AUTO LOGIN
  const register = async (userData, navigate) => {
    try {
      const res = await signupApi(userData);

      localStorage.setItem("token", res.token);
      setToken(res.token);
      setUser(res.user);

      toast.success("Signup successful!");

      navigate("/profile-setup");

      return { success: true };
    } catch (err) {
      toast.error(err.message || "Signup failed");
      return { success: false };
    }
  };

  // 🔵 LOGIN
  const login = async (credentials, navigate) => {
    try {
      const res = await loginApi(credentials);

      localStorage.setItem("token", res.token);
      setToken(res.token);
      setUser(res.user);

      toast.success(`Welcome back, ${res.user.name}!`);
      navigate("/dashboard");

      return { success: true };
    } catch (err) {
      toast.error("Invalid email or password");
      return { success: false };
    }
  };

  const logout = (navigate) => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    toast.success("Logged out");
    if (navigate) navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        register,
        login,
        logout,
        refreshUser, // ✅ ADD THIS
        setUser,
        setToken,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};



