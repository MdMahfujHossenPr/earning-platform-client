// layouts/DashboardLayout.jsx
import React, { useState } from "react";
import Navbar from "../components/Navbar/Navbar.jsx";
import Sidebar from "../components/Sidebar/Sidebar.jsx";
import Footer from "../components/Footer/Footer.jsx";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-gray-600 text-white min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-800 shadow">
        <Navbar
          menuOpen={sidebarOpen}
          setMenuOpen={setSidebarOpen}
          isDashboard={true}
        />
      </header>

      {/* Sidebar overlay on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Layout Container */}
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <aside
          className={` 
            w-64 bg-gray-900 shadow-md z-40
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            fixed top-16 bottom-0 overflow-y-auto
            md:translate-x-0 md:relative md:top-0 md:flex-shrink-0
            h-[calc(100vh-4rem)]
          `}
        >
          <Sidebar closeSidebar={() => setSidebarOpen(false)} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-0 h-[calc(100vh-4rem)] overflow-y-auto flex flex-col">
          <div className="flex-1">
            <Outlet />
          </div>

          {/* Footer */}
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
