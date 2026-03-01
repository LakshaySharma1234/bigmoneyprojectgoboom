import { createBrowserRouter } from "react-router";
import LandingPage from "./pages/LandingPage";
import { SignUp } from "./components/SignUp";
import { SignIn } from "./components/SignIn";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/signup",
    Component: SignUp,
  },
  {
    path: "/signin",
    Component: SignIn,
  },
]);
