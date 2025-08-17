import React from "react";
import { FaMoneyBillWave, FaUsers, FaRocket } from "react-icons/fa";
import { motion } from "framer-motion";

const features = [
  {
    id: 1,
    icon: <FaMoneyBillWave />,
    title: "Earn Effortlessly",
    description:
      "Complete micro tasks, watch videos, and earn daily without investment.",
    color: "text-gray-100",
  },
  {
    id: 2,
    icon: <FaUsers />,
    title: "Refer & Grow",
    description:
      "Invite friends and earn bonus commissions for every active user.",
    color: "text-gray-100",
  },
  {
    id: 3,
    icon: <FaRocket />,
    title: "Quick Payouts",
    description:
      "Get your earnings instantly via mobile banking or e-wallets.",
    color: "text-gray-100",
  },
];

const SectionOne = () => {
  return (
    <section className="text-white py-24 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-6 tracking-tight"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          💸 Start Earning Instantly
        </motion.h2>

        <motion.p
          className="text-lg text-gray-300 max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Join thousands of users who are earning real money by completing simple tasks,
          watching ads, and referring friends. It’s free, secure, and easy to use!
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              className="bg-white/10 border-2 border-white backdrop-blur-lg p-8 rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <div className={`text-4xl mb-4 ${feature.color}`}>{feature.icon}</div>
              <h3 className="text-2xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SectionOne;
