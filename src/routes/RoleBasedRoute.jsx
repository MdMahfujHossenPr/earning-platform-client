// src/routes/RoleBasedRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook to access user info

const RoleBasedRoute = ({ allowedRoles }) => {
  const { user } = useAuth(); // Fetch the user info from context

  // If the user is not logged in or does not have the required role, redirect to forbidden or home
  if (!user) {
    return <Navigate to="/login" />; // Redirect to login page if not logged in
  }

  // If user role is not allowed, redirect to forbidden page
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/forbidden" />; // Redirect to a forbidden page or home
  }

  return <Outlet />; // If user is authorized, render the nested route components
};

export default RoleBasedRoute;
