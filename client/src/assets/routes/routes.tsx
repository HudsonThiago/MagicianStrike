import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/login";
import Register from "../pages/register";
import Dashboard from "../pages/dashboard";
import PrivateRoute from "./privateRoute";
import Main from "../pages/dashboard/main";
import Lobby from "../pages/dashboard/lobby";

export const routes = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/register", element: <Register /> },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard>
          <Main/>
        </Dashboard>
      </PrivateRoute>
    ),
  },
  {
    path: "/dashboard/lobby/:id",
    element: (
      <PrivateRoute>
        <Dashboard>
          <Lobby/>
        </Dashboard>
      </PrivateRoute>
    ),
  },
]);