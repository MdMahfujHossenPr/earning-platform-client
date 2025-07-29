// layouts/DashboardLayout.jsx
import React from "react";
import Navbar from "../components/Navbar/Navbar.jsx";
import Sidebar from "../components/Sidebar/Sidebar";
import Footer from "../components/Footer/Footer.jsx";
import { Outlet } from "react-router-dom";  // Used for rendering nested routes

const DashboardLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-600">
      {/* Navbar */}
      <Navbar />

      <div className="flex flex-1 mt-16 ">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <div className="flex-1 p-4">
          <Outlet />  {/* This will render pages like MyTasks, Profile, etc. */}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DashboardLayout;
