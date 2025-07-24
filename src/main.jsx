import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./routes/AppRoutes"; // Ensure correct import
import { AuthProvider } from "./context/AuthContext";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} /> {/* Ensure router is passed correctly */}
    </AuthProvider>
  </React.StrictMode>
);
