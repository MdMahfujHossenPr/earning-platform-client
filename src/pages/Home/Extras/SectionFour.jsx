import React from "react";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import { FaUsers, FaTasks, FaWallet } from "react-icons/fa";

const stats = [
  { id: 1, icon: <FaUsers />, label: "Active Users", value: 12500 },
  { id: 2, icon: <FaTasks />, label: "Tasks Completed", value: 98500 },
  { id: 3, icon: <FaWallet />, label: "Total Payout ($)", value: 74230 },
];

const SectionFour = () => {
  return (
    <section className="text-white py-28 px-4 ">
      <div className="max-w-7xl mx-auto text-center">
        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-6 tracking-tight"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          🚀 Our Achievements
        </motion.h2>

        <motion.p
          className="text-lg text-gray-300 max-w-2xl mx-auto mb-20"
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          We take pride in our platform's growth and the success of our users.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              className="bg-white/10 border-2 border-white backdrop-blur-lg p-8 rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.3 }}
            >
              <div className="text-4xl mb-4 text-gray-100">{stat.icon}</div>
              <h3 className="text-3xl font-bold">
                <CountUp end={stat.value} duration={2.5} separator="," />
              </h3>
              <p className="text-gray-300 mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SectionFour;
