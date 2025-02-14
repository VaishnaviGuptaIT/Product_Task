import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const PublicRoute: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const { isAuth } = useSelector((state: RootState) => state.auth);

  return isAuth ? <Navigate to="/home" replace /> : children;
};

export default PublicRoute;
