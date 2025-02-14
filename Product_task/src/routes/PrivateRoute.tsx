import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import Layout from "../components/common/Layout";

const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const { isAuth } = useSelector((state: RootState) => state.auth);

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
};

export default PrivateRoute;
