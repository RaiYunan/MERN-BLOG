import { RouteSignIn } from "@/helpers/RouteName";
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AdminManagement = () => {
  const user = useSelector((state) => state.user);
  if (user && user.isLoggedIn && user.user.role ==="admin") {
    return (
      <div>
        <Outlet />
      </div>
    );
  } else {
    return <Navigate to={RouteSignIn} />;
  }
};

export default AdminManagement;
