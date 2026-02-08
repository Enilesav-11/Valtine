import { createBrowserRouter } from "react-router";
import { Invitation } from "./components/Invitation";
import { Admin } from "./components/Admin";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Invitation,
  },
  {
    path: "/admin",
    Component: Admin,
  },
]);
