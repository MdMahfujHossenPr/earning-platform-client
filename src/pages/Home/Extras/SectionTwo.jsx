import React from "react";
import { FaClipboardCheck, FaPlayCircle, FaWallet } from "react-icons/fa";
import { motion } from "framer-motion";

const steps = [
  {
    id: 1,
    icon: <FaClipboardCheck />,
    title: "Sign Up",
    description: "Create your free account in seconds with just your phone number.",
    color: "text-cyan-400",
  },
  {
    id: 2,
    icon: <FaPlayCircle />,
    title: "Complete Tasks",
    description: "Watch videos, refer friends or answer surveys to earn coins.",
    color: "text-purple-400",
  },
  {
    id: 3,
    icon: <FaWallet />,
    title: "Withdraw Earnings",
    description: "Cash out your balance anytime via bKash, Nagad, or mobile recharge.",
    color: "text-emerald-400",
  },
];

const SectionTwo = () => {
  return (
    <section className="text-white py-28 px-4 relative">
      <div className="max-w-7xl mx-auto text-center">
        {/* Title */}
        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-6 tracking-tight"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          🛠️ How It Works
        </motion.h2>

        {/* Description */}
        <motion.p
          className="text-lg text-gray-300 max-w-2xl mx-auto mb-20"
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Start earning in just 3 simple steps. No technical skills required.
        </motion.p>

        {/* Steps */}
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gray-700 z-0"></div>

          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className="bg-white/10 border-2 border-white backdrop-blur-lg p-8 rounded-3xl shadow-2xl relative z-10 w-full md:w-1/3 hover:scale-105 transition-transform duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.3 }}
            >
              {/* Step number badge */}
              <div className="w-12 h-12 rounded-full bg-gray-700 text-white flex items-center justify-center font-bold text-lg mb-4 absolute -top-6 left-1/2 transform -translate-x-1/2 shadow-lg">
                {step.id}
              </div>

              {/* Icon */}
              <div className={`text-4xl mb-4 ${step.color}`}>{step.icon}</div>

              {/* Title */}
              <h3 className="text-2xl font-semibold mb-2">{step.title}</h3>

              {/* Description */}
              <p className="text-gray-300">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SectionTwo;
