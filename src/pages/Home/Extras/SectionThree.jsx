import React from "react";
import { FaLock, FaHeadset, FaChartLine } from "react-icons/fa";

const SectionThree = () => {
  return (
    <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-white py-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">✅ Why Choose Us?</h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-12">
          We prioritize your security, support and success. Here's what makes us different:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Point 1 */}
          <div className="bg-white/5 border border-white/10 p-8 rounded-2xl shadow-xl">
            <div className="text-4xl text-pink-400 mb-4">
              <FaLock />
            </div>
            <h3 className="text-xl font-semibold mb-2">100% Secure Platform</h3>
            <p className="text-gray-300">Your data and earnings are fully protected with top-grade encryption.</p>
          </div>

          {/* Point 2 */}
          <div className="bg-white/5 border border-white/10 p-8 rounded-2xl shadow-xl">
            <div className="text-4xl text-indigo-400 mb-4">
              <FaHeadset />
            </div>
            <h3 className="text-xl font-semibold mb-2">24/7 Live Support</h3>
            <p className="text-gray-300">We’re always here for you with fast, helpful support when you need it.</p>
          </div>

          {/* Point 3 */}
          <div className="bg-white/5 border border-white/10 p-8 rounded-2xl shadow-xl">
            <div className="text-4xl text-yellow-400 mb-4">
              <FaChartLine />
            </div>
            <h3 className="text-xl font-semibold mb-2">Proven Results</h3>
            <p className="text-gray-300">Thousands of users have already earned and withdrawn real money.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionThree;
