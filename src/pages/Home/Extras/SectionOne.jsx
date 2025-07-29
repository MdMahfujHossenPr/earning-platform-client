import React from "react";
import { FaMoneyBillWave, FaUsers, FaRocket } from "react-icons/fa";

const SectionOne = () => {
  return (
    <section className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white py-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
          💸 Start Earning Instantly
        </h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-12">
          Join thousands of users who are earning real money by completing simple tasks, watching ads, and referring friends. It’s free, secure, and easy to use!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
          {/* Card 1 */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-xl hover:scale-105 transition-transform duration-300">
            <div className="text-4xl text-green-400 mb-4">
              <FaMoneyBillWave />
            </div>
            <h3 className="text-2xl font-semibold mb-2">Earn Effortlessly</h3>
            <p className="text-gray-300">
              Complete micro tasks, watch videos, and earn daily without investment.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-xl hover:scale-105 transition-transform duration-300">
            <div className="text-4xl text-blue-400 mb-4">
              <FaUsers />
            </div>
            <h3 className="text-2xl font-semibold mb-2">Refer & Grow</h3>
            <p className="text-gray-300">
              Invite friends and earn bonus commissions for every active user.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-xl hover:scale-105 transition-transform duration-300">
            <div className="text-4xl text-yellow-400 mb-4">
              <FaRocket />
            </div>
            <h3 className="text-2xl font-semibold mb-2">Quick Payouts</h3>
            <p className="text-gray-300">
              Get your earnings instantly via mobile banking or e-wallets.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionOne;
