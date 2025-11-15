import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import RootLayout from "../layouts/RootLayout";
import authRoutes from "./authRoutes";
import LandingPage from "../pages/LandingPage";
import dashboardRoutes from "./dashboardRoutes";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <App>
        <RootLayout />
      </App>
    ),
    children: [
    { index: true, element: <LandingPage /> },


      ...authRoutes,
      ...dashboardRoutes,
    ],
  },
]);

export default router;


