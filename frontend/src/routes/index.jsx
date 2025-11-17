// src/routes/index.jsx
import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";

import LandingPage from "../pages/LandingPage";
import authRoutes from "./authRoutes";
import dashboardRoutes from "./dashboardRoutes";

// Profile setup page
import ProfileSetup from "../pages/profile/ProfileSetup";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <LandingPage /> },

      ...authRoutes,        // /auth/login, /auth/signup
      ...dashboardRoutes,   // /dashboard/*

      // 🔥 ADD THIS
      { path: "profile-setup", element: <ProfileSetup /> },
    ],
  },
]);

export default router;




