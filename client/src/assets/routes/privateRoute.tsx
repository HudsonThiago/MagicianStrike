import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import type { JSX } from "react";

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/" />;
};

export default PrivateRoute;