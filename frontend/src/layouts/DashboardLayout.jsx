import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  FileText,
  Mic,
  BarChart2,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import { Outlet } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { dark, toggleTheme } = useTheme();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/dashboard",
    },
    { name: "Profile", icon: <User size={20} />, path: "/dashboard/profile" },
    { name: "Resume", icon: <FileText size={20} />, path: "/dashboard/resume" },
    {
      name: "Start Interview",
      icon: <Mic size={20} />,
      path: "/dashboard/interview",
    },
    {
      name: "Analytics",
      icon: <BarChart2 size={20} />,
      path: "/dashboard/analytics",
    },
  ];

  const logoutHandler = () => {
    localStorage.removeItem("token");
    navigate("/auth/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      {/* Sidebar */}
      <aside
        className={`p-5 shadow-xl transition-all duration-300
    ${sidebarOpen ? "w-64" : "w-20"}
    bg-white dark:bg-gray-800 dark:text-gray-200
    h-full min-h-screen flex flex-col
  `}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div
            className="bg-blue-600 text-white p-2 rounded-lg cursor-pointer"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            IA
          </div>

          {sidebarOpen && (
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              InterviewAI
            </h2>
          )}
        </div>

        {/* Menu */}
        <nav className="space-y-3">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all
          ${
            isActive
              ? "bg-blue-600 text-white shadow-md"
              : "text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-gray-700"
          }`
              }
            >
              {item.icon}
              {sidebarOpen && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout at bottom */}
        <button
          onClick={logoutHandler}
          className="mt-auto flex items-center gap-3 text-red-600 dark:text-red-400 p-3 rounded-xl
      hover:bg-red-100 dark:hover:bg-red-900 transition-all w-full"
        >
          <LogOut size={20} />
          {sidebarOpen && "Logout"}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ">
        {/* Navbar */}
        <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex justify-end items-center transition-colors">
          <div className="flex items-center gap-4">
            {/* Dark mode toggle button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-gray-200 dark:bg-gray-700 transition"
            >
              {dark ? (
                <Sun size={20} className="text-yellow-400" />
              ) : (
                <Moon size={20} />
              )}
            </button>

            <img
              src="https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff"
              alt="Avatar"
              className="w-10 h-10 rounded-full shadow"
            />
          </div>
        </header>

        {/* Page content */}
        <section className="p-6 text-gray-900  dark:text-gray-100 transition-colors">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
