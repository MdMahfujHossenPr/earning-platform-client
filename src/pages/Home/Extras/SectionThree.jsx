import React from "react";
import { FaLock, FaHeadset, FaChartLine } from "react-icons/fa";
import { motion } from "framer-motion";

const points = [
  {
    id: 1,
    icon: <FaLock />,
    title: "100% Secure Platform",
    description:
      "Your data and earnings are fully protected with top-grade encryption.",
    color: "text-pink-400",
  },
  {
    id: 2,
    icon: <FaHeadset />,
    title: "24/7 Live Support",
    description:
      "We’re always here for you with fast, helpful support when you need it.",
    color: "text-indigo-400",
  },
  {
    id: 3,
    icon: <FaChartLine />,
    title: "Proven Results",
    description:
      "Thousands of users have already earned and withdrawn real money.",
    color: "text-yellow-400",
  },
];

const SectionThree = () => {
  return (
    <section className="text-white py-28 px-4">
      <div className="max-w-7xl mx-auto text-center">
        {/* Title */}
        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-6 tracking-tight"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          ✅ Why Choose Us?
        </motion.h2>

        {/* Description */}
        <motion.p
          className="text-lg text-gray-300 max-w-2xl mx-auto mb-20"
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          We prioritize your security, support and success. Here's what makes us different:
        </motion.p>

        {/* Points */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {points.map((point, index) => (
            <motion.div
              key={point.id}
              className="bg-white/10 border-2 border-white backdrop-blur-lg p-8 rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              {/* Icon */}
              <div className={`text-4xl mb-4 ${point.color}`}>{point.icon}</div>

              {/* Title */}
              <h3 className="text-2xl font-semibold mb-2">{point.title}</h3>

              {/* Description */}
              <p className="text-gray-300">{point.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SectionThree;
