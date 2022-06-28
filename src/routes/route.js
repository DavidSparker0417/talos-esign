import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { isLoggedIn } from "../redux/auth";

export default function PrivateRoute({children}) {
  const isLogged = useSelector(isLoggedIn);

  if (!isLogged)
    return <Navigate to="/login" replace/>
  
  return children;
}

export function PublicRoute({children}) {
  const isLogged = useSelector(isLoggedIn);

  if (!isLogged)
    return children;
  
  return <Navigate to="/" replace/>
}
