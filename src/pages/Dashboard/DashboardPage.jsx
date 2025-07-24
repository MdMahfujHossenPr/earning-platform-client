// src/layouts/DashboardLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";  // Used for nested routing
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";  // Sidebar Component
import Footer from "../components/Footer/Footer";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/5 bg-gray-800">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-gray-100">
        {/* Navbar - fixed at the top */}
        <div className="sticky top-0 z-10">
          <Navbar />
        </div>

        {/* Main Content Section */}
        <main className="flex-1 p-6 mt-16 overflow-auto"> {/* Adjusted margin-top for Navbar */}
          {/* Render the page content */}
          <Outlet /> 
        </main>

        {/* Footer - fixed at the bottom */}
        <div className="sticky bottom-0 w-full z-10">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
