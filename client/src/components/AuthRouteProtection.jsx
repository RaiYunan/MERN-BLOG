import { RouteSignIn } from "@/helpers/RouteName";
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AuthRouteProtection = () => {
  const user = useSelector((state) => state.user);
  console.log("User in redux state:", user);
  if (user && user.isLoggedIn) {
    return (
      <div>
        <Outlet />
      </div>
    );
  }else{
    return <Navigate to={RouteSignIn}/>
  }
};

export default AuthRouteProtection;
