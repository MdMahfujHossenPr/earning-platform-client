import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";

const ErrorPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-sky-100 via-white to-indigo-100 px-4 py-10">
      <title>Error</title>
      <motion.img
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6 }}
        src="https://i.ibb.co/N658SVPv/error.png"
        alt="404 Error"
        className="w-full max-w-md mb-6"
      />

      <motion.h1
        className="text-5xl font-bold text-rose-800 text-center mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        404 - Page Not Found
      </motion.h1>

      <motion.p
        className="text-rose-600 text-lg text-center max-w-2xl mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        We're Sorry, but the page you requested could not be found. It might
        have been removed, renamed, or did not exist in the first place.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 text-white bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 rounded-full transition duration-300 shadow-lg"
        >
          <FaArrowLeft /> Go Back to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default ErrorPage;
