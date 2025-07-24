// src/context/NotificationProvider.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "../services/axios";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext();
export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchNotifications() {
      if (!user) return;
      setLoading(true);
      try {
        const res = await axios.get("/api/notifications");
        setNotifications(res.data);
      } catch (err) {
        // handle error
      }
      setLoading(false);
    }
    fetchNotifications();
  }, [user]);

  return (
    <NotificationContext.Provider value={{ notifications, loading }}>
      {children}
    </NotificationContext.Provider>
  );
};
