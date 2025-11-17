import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("Email & password required!", { id: "login" });
      return;
    }

    setLoading(true);

    const result = await login(form, navigate);

    if (!result.success) setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f5f7ff] flex items-center justify-center px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg animate-fadeIn"
      >
        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          Login to Your Account
        </h1>

        <div className="space-y-5">
          {/* Email */}
          <div>
            <label className="text-gray-700 font-medium">Email</label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              onChange={handleChange}
              className="w-full p-3 mt-1 rounded-xl border border-gray-300 bg-[#eaf1ff] text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-gray-700 font-medium">Password</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              onChange={handleChange}
              className="w-full p-3 mt-1 rounded-xl border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2773ff] hover:bg-[#1d63e8] text-white text-lg py-3 rounded-xl font-semibold transition disabled:bg-blue-300"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Switch */}
          <p className="text-center text-gray-600">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/auth/signup")}
              className="text-blue-600 font-semibold cursor-pointer hover:underline"
            >
              Sign up
            </span>
          </p>
        </div>
      </form>
    </div>
  );
}
