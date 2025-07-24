import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar.jsx";
import Footer from "../components/Footer/Footer.jsx";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-600">
      {/* Navigation bar */}
      <Navbar />

      {/* Main content area with padding top to avoid overlap */}
      <main className="flex-grow relative z-10 pt-16">
        {/* Render matched child route components here */}
        <Outlet />
      </main>

      {/* Footer section */}
      <Footer />
    </div>
  );
};

export default MainLayout;
