import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const BestWorkers = () => {
  const [workers, setWorkers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        "https://earning-platform-server-seven.vercel.app/api/users?role=Worker&limit=6"
      )
      .then((response) => {
        let fetchedWorkers = Array.isArray(response.data) ? response.data.slice(0, 6) : [];
        
        // যদি কম থাকে, default worker add করা
        while (fetchedWorkers.length < 6) {
          fetchedWorkers.push({
            _id: `empty-${fetchedWorkers.length}`,
            name: "No Worker",
            coin: 0,
            photo_url: "/default-avatar.png",
          });
        }

        setWorkers(fetchedWorkers);
        setError(null);
      })
      .catch((error) => {
        console.error("Error fetching workers:", error);
        setError("An error occurred while fetching the workers.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="text-white py-16">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-semibold mb-6">Best Workers</h2>

        {loading ? (
          <span className="loading loading-bars loading-lg mx-auto"></span>
        ) : error ? (
          <p className="mt-4 text-red-500">{error}</p>
        ) : (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {workers.map((worker) => (
              <motion.div
                key={worker._id}
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
                <h3 className="text-xl font-semibold text-gray-100">{worker.name || "Unknown"}</h3>
                <p className="mt-2 text-lg text-gray-300">Coins: {worker.coin ?? 0}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BestWorkers;
