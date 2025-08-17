import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import CountUp from "react-countup";

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
    <section className="text-white py-20">
      <div className="container mx-auto text-center">
        <h2 className="text-5xl font-bold mb-10">Best Workers</h2>

        {loading ? (
          <span className="loading loading-bars loading-lg mx-auto"></span>
        ) : error ? (
          <p className="mt-4 text-red-500 text-lg">{error}</p>
        ) : (
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 ">
            {workers.map((worker) => (
              <motion.div
                key={worker._id}
                className="bg-gray-800 border-2 border-white p-8 rounded-xl shadow-lg transform transition-transform duration-500 hover:scale-105 hover:shadow-white/50"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <img
                  className="w-28 h-28 rounded-full mx-auto mb-6 border-4 border-white-600 shadow-md transition-all duration-500 hover:border-white"
                  src={worker.photo_url || "/default-avatar.png"}
                  alt={worker.name || "Worker"}
                />
                <h3 className="text-2xl font-semibold text-gray-100 mb-2">{worker.name || "Unknown"}</h3>
                <p className="mt-2 text-xl text-gray-300">
                  Coins: <CountUp end={worker.coin ?? 0} duration={1.5} />
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BestWorkers;
