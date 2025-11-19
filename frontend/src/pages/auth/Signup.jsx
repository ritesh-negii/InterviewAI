import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Signup() {
  const navigate = useNavigate();
  const { register } = useAuth();  // ⭐ USE CONTEXT REGISTER
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

    // ⭐⭐ MAIN FIX – USE AuthContext.register()
    const result = await register(
      {
        name: form.name,
        email: form.email,
        password: form.password,
      },
      navigate // pass navigate to context
    );

    setLoading(false);
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

        <label className="text-gray-700 font-medium">Full Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-3 mt-1 mb-4 rounded-xl border border-gray-300 bg-[#eaf1ff]"
        />

        <label className="text-gray-700 font-medium">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 mt-1 mb-4 rounded-xl border border-gray-300"
        />

        <label className="text-gray-700 font-medium">Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-3 mt-1 mb-4 rounded-xl border border-gray-300"
        />

        <label className="text-gray-700 font-medium">Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          className="w-full p-3 mt-1 mb-6 rounded-xl border border-gray-300"
        />

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


