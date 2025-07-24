import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

const ProtectedLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <main className="flex-1 px-4 md:px-8 py-6">{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ProtectedLayout;
