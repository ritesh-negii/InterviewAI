import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Outlet />
    </main>
  );
}
