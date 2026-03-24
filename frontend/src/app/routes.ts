import { createBrowserRouter } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import { SignUp } from "./components/SignUp";
import { SignIn } from "./components/SignIn";
import StaffDashboardPage from "./pages/StaffDashboardPage";
import EmployerDashboardPage from "./pages/EmployerDashboardPage";
import { PublicOnlyRoute } from "./components/routing/PublicOnlyRoute";
import { EmployerOnlyRoute, StaffOnlyRoute } from "./components/routing/RequireRoleRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    Component: PublicOnlyRoute,
    children: [
      {
        path: "/signup",
        Component: SignUp,
      },
      {
        path: "/signin",
        Component: SignIn,
      },
    ],
  },
  {
    Component: StaffOnlyRoute,
    children: [
      {
        path: "/staff/dashboard",
        Component: StaffDashboardPage,
      },
    ],
  },
  {
    Component: EmployerOnlyRoute,
    children: [
      {
        path: "/employer/dashboard",
        Component: EmployerDashboardPage,
      },
    ],
  },
]);
