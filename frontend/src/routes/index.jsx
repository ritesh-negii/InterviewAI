// src/routes/index.jsx
import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";

import LandingPage from "../pages/LandingPage";
import authRoutes from "./authRoutes";
import dashboardRoutes from "./dashboardRoutes";

// Pages
import ProfileSetup from "../pages/profile/ProfileSetup";
import ResumeUpload from "../pages/resume/ResumeUpload";   // <-- ADD THIS

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <LandingPage /> },

      ...authRoutes,
      ...dashboardRoutes,

      { path: "profile-setup", element: <ProfileSetup /> },

      { path: "resume-upload", element: <ResumeUpload /> },
    ],
  },
]);

export default router;




