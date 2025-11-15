import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/auth/Login.jsx";
import Signup from "../pages/auth/Signup.jsx";

const authRoutes = [
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
    ],
  },
];

export default authRoutes;
