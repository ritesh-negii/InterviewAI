import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-[#f5f7ff] flex items-center justify-center px-4">
      <Outlet />
    </div>
  );
}


