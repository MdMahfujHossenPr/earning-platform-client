import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const BestWorkers = () => {
  const [workers, setWorkers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users?role=Worker&limit=6")
      .then((response) => {
        setWorkers(response.data);
        setError(null); // Reset error state on successful fetch
      })
      .catch((error) => {
        console.error("Error fetching workers:", error);
        setError("An error occurred while fetching the workers."); // Set error message in state
      });
  }, []);

  return (
    <section className="bg-gray-800 text-white py-16">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-semibold mb-6">Best Workers</h2>
        {error && <p className="mt-4 text-red-500">{error}</p>}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {workers.length > 0 ? (
            workers.map((worker) => (
              <motion.div
                key={worker._id || worker.email}
                className="bg-gray-700 p-6 rounded-lg transform transition-transform duration-300 hover:scale-105"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <img
                  className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-gray-600 shadow-lg transition-all duration-300 hover:border-yellow-400"
                  src={worker.photo_url || "/default-avatar.png"}
                  alt={worker.name || "Worker"}
                />
                <h3 className="text-xl font-semibold text-gray-100">{worker.name}</h3>
                <p className="mt-2 text-lg text-gray-300">Coins: {worker.coin}</p>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-400 mt-4">No workers found.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default BestWorkers;
