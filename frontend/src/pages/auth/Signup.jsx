import { useState } from "react";
import { signupApi } from "../../api/authApi";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      toast.error("All fields are required!", { id: "signup" });
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match!", { id: "signup" });
      return;
    }

    setLoading(true);

    try {
      const res = await signupApi({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      console.log("SIGNUP RESPONSE:", res);

      if (!res.success) {
        toast.error(res.message || "Signup failed", { id: "signup" });
        return;
      }

      // ⭐ AUTO-LOGIN: save token instantly
      if (res.token) {
        localStorage.setItem("token", res.token);
      }

      toast.success("Signup successful 🎉", { id: "signup" });

      // ⭐ Redirect to Profile Setup Page
      navigate("/profile-setup");

    } catch (error) {
      console.log("SIGNUP ERROR:", error);
      // axios interceptor already shows error toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7ff] flex items-center justify-center px-4">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg animate-fadeIn"
      >
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">
          Create Your Account
        </h1>

        {/* Full Name */}
        <label className="text-gray-700 font-medium">Full Name</label>
        <input
          type="text"
          name="name"
          placeholder="John Doe"
          value={form.name}
          onChange={handleChange}
          className="w-full p-3 mt-1 mb-4 rounded-xl border border-gray-300 bg-[#eaf1ff]"
        />

        {/* Email */}
        <label className="text-gray-700 font-medium">Email</label>
        <input
          type="email"
          name="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 mt-1 mb-4 rounded-xl border border-gray-300"
        />

        {/* Password */}
        <label className="text-gray-700 font-medium">Password</label>
        <input
          type="password"
          name="password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          className="w-full p-3 mt-1 mb-4 rounded-xl border border-gray-300"
        />

        {/* Confirm Password */}
        <label className="text-gray-700 font-medium">Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          placeholder="••••••••"
          value={form.confirmPassword}
          onChange={handleChange}
          className="w-full p-3 mt-1 mb-6 rounded-xl border border-gray-300"
        />

        {/* Sign Up Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#2773ff] hover:bg-[#1d63e8] text-white text-lg py-3 rounded-xl font-semibold transition disabled:bg-blue-300"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/auth/login")}
            className="text-blue-600 cursor-pointer font-semibold hover:underline"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}

