import { useState } from "react";
import { loginApi } from "../../api/authApi";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      toast.error("Email & password required!", { id: "login" });
      return;
    }

    setLoading(true);

    try {
      const res = await loginApi(form);

      localStorage.setItem("token", res.data.token);

      toast.success("Logged in successfully!", { id: "login" });
      navigate("/dashboard");

    } catch (error) {
      // axios interceptor will show toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl animate-fadeIn">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">
        Welcome Back 👋
      </h1>

      <div className="space-y-5">
        {/* Email */}
        <div className="space-y-1">
          <label className="text-gray-700 font-medium">Email</label>
          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            onChange={handleChange}
            className="w-full p-3 rounded-xl border border-gray-300 bg-[#eaf1ff]"
          />
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="text-gray-700 font-medium">Password</label>
          <input
            name="password"
            type="password"
            placeholder="••••••••"
            onChange={handleChange}
            className="w-full p-3 rounded-xl border border-gray-300"
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-[#2773ff] hover:bg-[#1d63e8] text-white text-lg py-3 rounded-xl"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-gray-600">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/auth/signup")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}


