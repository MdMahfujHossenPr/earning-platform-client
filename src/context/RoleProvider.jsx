// src/context/RoleProvider.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const RoleContext = createContext();
export const useRole = () => useContext(RoleContext);

export const RoleProvider = ({ children }) => {
  const { user } = useAuth();
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (user && user.role) {
      setRole(user.role);
    } else {
      setRole(null);
    }
  }, [user]);

  return (
    <RoleContext.Provider value={{ role }}>{children}</RoleContext.Provider>
  );
};
