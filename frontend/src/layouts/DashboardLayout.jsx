import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, User, FileText, Mic, BarChart2, LogOut } from "lucide-react";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
    { name: "Profile", icon: <User size={20} />, path: "/dashboard/profile" },
    { name: "Resume", icon: <FileText size={20} />, path: "/dashboard/resume" },
    { name: "Start Interview", icon: <Mic size={20} />, path: "/dashboard/interview" },
    { name: "Analytics", icon: <BarChart2 size={20} />, path: "/dashboard/analytics" },
  ];

  const logoutHandler = () => {
    localStorage.removeItem("token");
    navigate("/auth/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <aside
        className={`bg-white shadow-xl h-screen p-5 transition-all duration-300
          ${sidebarOpen ? "w-64" : "w-20"}`}
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
            <h2 className="text-2xl font-bold text-gray-800">InterviewAI</h2>
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
                    : "text-gray-700 hover:bg-blue-100"
                }`
              }
            >
              {item.icon}
              {sidebarOpen && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={logoutHandler}
          className="mt-12 flex items-center gap-3 text-red-600 p-3 rounded-xl
          hover:bg-red-100 transition-all w-full"
        >
          <LogOut size={20} />
          {sidebarOpen && "Logout"}
        </button>
      </aside>

      {/* Main content area */}
      <main className="flex-1">
        
        {/* Top Navbar */}
        <header className="bg-white shadow-sm p-4 flex justify-end items-center">
          <div className="flex items-center gap-3">
            <p className="text-gray-800 font-medium hidden md:block">
              Welcome 👋
            </p>
            <img
              src="https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff"
              alt="User Avatar"
              className="w-10 h-10 rounded-full shadow"
            />
          </div>
        </header>

        {/* Page Content */}
        <section className="p-6">
          <Outlet />
        </section>

      </main>
    </div>
  );
}

