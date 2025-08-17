import React from "react";
import { motion } from "framer-motion";
import { FaQuoteLeft } from "react-icons/fa";

const testimonials = [
  {
    id: 1,
    name: "John Carter",
    message:
      "This platform completely changed the way I earn online. Reliable, fast, and user-friendly.",
    image: "https://i.ibb.co/Rkdh6phJ/profile-pic1.jpg",
  },
  {
    id: 2,
    name: "Sara Collins",
    message:
      "I was able to earn extra money while studying. The interface is so smooth and clean!",
    image: "https://i.ibb.co/NnjtVjw8/profile-three.jpg",
  },
  {
    id: 3,
    name: "Leo Williams",
    message:
      "Tasks are simple yet rewarding. I recommend it to everyone who wants legit income.",
    image: "https://i.ibb.co/Q7mvxFCb/Screenshot-2025-05-14-102943.png",
  },
];

const Testimonials = () => {
  return (
    <section className="relative py-24 px-4 ">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-white mb-20 text-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          💬 Hear From Our Users
        </motion.h2>

        <div className="relative before:absolute before:top-0 before:bottom-0 before:left-1/2 before:w-1 before:bg-gray-700 before:-translate-x-1/2">
          {testimonials.map((t, index) => {
            const isLeft = index % 2 === 0;
            return (
              <motion.div
                key={t.id}
                className={`mb-16 flex flex-col md:flex-row items-center md:justify-${isLeft ? "start" : "end"} w-full`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <div
                  className={`bg-gray-800 text-white p-8 border-2 border-white rounded-xl shadow-lg w-full md:w-5/12 relative ${
                    isLeft ? "md:mr-auto md:text-left" : "md:ml-auto md:text-right"
                  }`}
                >
                  <FaQuoteLeft className="text-3xl text-gray-400 mb-4" />
                  <p className="text-lg italic leading-relaxed">{t.message}</p>
                  <div className="mt-4 flex items-center space-x-4 justify-start md:justify-end">
                    <img
                      src={t.image}
                      alt={t.name}
                      className="w-14 h-14 rounded-full border-2 border-white object-cover"
                    />
                    <span className="font-semibold text-gray-100">{t.name}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
