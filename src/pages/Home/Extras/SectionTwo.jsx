import React from "react";
import { FaClipboardCheck, FaPlayCircle, FaWallet } from "react-icons/fa";

const SectionTwo = () => {
  return (
    <section className="bg-gray-950 text-white py-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
          🛠️ How It Works
        </h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-12">
          Start earning in just 3 simple steps. No technical skills required.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Step 1 */}
          <div className="bg-white/5 border border-white/10 p-8 rounded-2xl shadow-xl">
            <div className="text-4xl text-cyan-400 mb-4">
              <FaClipboardCheck />
            </div>
            <h3 className="text-xl font-semibold mb-2">1. Sign Up</h3>
            <p className="text-gray-300">Create your free account in seconds with just your phone number.</p>
          </div>

          {/* Step 2 */}
          <div className="bg-white/5 border border-white/10 p-8 rounded-2xl shadow-xl">
            <div className="text-4xl text-purple-400 mb-4">
              <FaPlayCircle />
            </div>
            <h3 className="text-xl font-semibold mb-2">2. Complete Tasks</h3>
            <p className="text-gray-300">Watch videos, refer friends or answer surveys to earn coins.</p>
          </div>

          {/* Step 3 */}
          <div className="bg-white/5 border border-white/10 p-8 rounded-2xl shadow-xl">
            <div className="text-4xl text-emerald-400 mb-4">
              <FaWallet />
            </div>
            <h3 className="text-xl font-semibold mb-2">3. Withdraw Earnings</h3>
            <p className="text-gray-300">Cash out your balance anytime via bKash, Nagad, or mobile recharge.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionTwo;
