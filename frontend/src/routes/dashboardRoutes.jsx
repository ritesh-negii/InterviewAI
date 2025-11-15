// src/routes/dashboardRoutes.jsx
import DashboardLayout from "../layouts/DashboardLayout";

// Pages
import DashboardHome from "../pages/dashboard/Home";
import ProfilePage from "../pages/dashboard/Profile";
import ResumePage from "../pages/dashboard/Resume";
import InterviewSetupPage from "../pages/dashboard/InterviewSetup";
import InterviewRoomPage from "../pages/dashboard/InterviewRoom";
import InterviewResultsPage from "../pages/dashboard/InterviewResults";
import AnalyticsPage from "../pages/dashboard/Analytics";

// Protected Route (your version in utils)
import ProtectedRoute from "../utils/ProtectedRoute";

const dashboardRoutes = [
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),

    children: [
      // Dashboard Default Page
      {
        index: true,
        element: <DashboardHome />,
      },

      // Profile Edit Page
      {
        path: "profile",
        element: <ProfilePage />,
      },

      // Resume Upload + Edit Page
      {
        path: "resume",
        element: <ResumePage />,
      },

      // Interview Setup Page
      {
        path: "interview",
        element: <InterviewSetupPage />,
      },

      // Interview Room
      {
        path: "interview/:sessionId",
        element: <InterviewRoomPage />,
      },

      // Interview Results Page
      {
        path: "interview/:sessionId/results",
        element: <InterviewResultsPage />,
      },

      // Analytics Page
      {
        path: "analytics",
        element: <AnalyticsPage />,
      },
    ],
  },
];

export default dashboardRoutes;
