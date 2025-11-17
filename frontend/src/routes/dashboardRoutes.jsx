// src/routes/dashboardRoutes.jsx
import DashboardLayout from "../layouts/DashboardLayout";

// Protected
import ProtectedRoute from "../utils/ProtectedRoute";

// Pages
import DashboardHome from "../pages/dashboard/Home";
//import ProfilePage from "../pages/dashboard/Profile";
//import ResumePage from "../pages/dashboard/Resume";
//import InterviewSetup from "../pages/dashboard/InterviewSetup";
//import AnalyticsPage from "../pages/dashboard/Analytics";

const dashboardRoutes = [
  {
    path: "dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),

    children: [
      { path: "", element: <DashboardHome /> },               // DEFAULT HOME
   //   { path: "profile", element: <ProfilePage /> },
    //  { path: "resume", element: <ResumePage /> },
     // { path: "interview", element: <InterviewSetup /> },
     // { path: "analytics", element: <AnalyticsPage /> },
    ],
  },
];

export default dashboardRoutes;

