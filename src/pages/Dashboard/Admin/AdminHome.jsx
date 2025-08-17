import React, { useState, useEffect } from "react";
import {
  getAdminStats,
  getPendingPayments,
  approvePayment,
} from "../../../services/admin.service";
import { toast } from "react-hot-toast";
import { FaUsers, FaUserTie, FaCoins, FaMoneyCheckAlt } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const AdminHome = () => {
  const [stats, setStats] = useState({
    totalWorker: 0,
    totalBuyer: 0,
    totalCoin: 0,
    totalPayments: 0,
  });
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const statsData = await getAdminStats();
      setStats({
        totalWorker: statsData?.totalWorker || 0,
        totalBuyer: statsData?.totalBuyer || 0,
        totalCoin: statsData?.totalCoin || 0,
        totalPayments: statsData?.totalPayments || 0,
      });

      const pending = await getPendingPayments();
      setPendingPayments(pending);
    } catch (error) {
      console.error("Error fetching admin data:", error);
      toast.error("❌ Failed to load admin data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (paymentId) => {
    try {
      await approvePayment(paymentId);
      toast.success("✅ Payment approved and coins added to buyer.");
      fetchData();
    } catch (error) {
      console.error("Error approving payment:", error);
      toast.error("❌ Failed to approve payment.");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-xl font-medium text-white">
        Loading...
      </div>
    );
  }

  const chartData = [
    { name: "Workers", value: stats.totalWorker, color: "#34D399" },
    { name: "Buyers", value: stats.totalBuyer, color: "#3B82F6" },
    { name: "Coins", value: stats.totalCoin, color: "#FACC15" },
    { name: "Payments ($)", value: stats.totalPayments, color: "#EF4444" },
  ];

  return (
    <div className="p-6 bg-gray-600 min-h-screen">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">
        Admin Dashboard
      </h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Total Workers"
          value={stats.totalWorker}
          icon={<FaUserTie className="text-green-400 text-3xl" />}
        />
        <StatCard
          title="Total Buyers"
          value={stats.totalBuyer}
          icon={<FaUsers className="text-blue-400 text-3xl" />}
        />
        <StatCard
          title="Total Coins"
          value={stats.totalCoin}
          icon={<FaCoins className="text-yellow-400 text-3xl" />}
        />
        <StatCard
          title="Total Payments"
          value={`$${stats.totalPayments}`}
          icon={<FaMoneyCheckAlt className="text-red-400 text-3xl" />}
        />
      </div>

      {/* Bar Chart */}
      <div className="bg-gray-700/50 backdrop-blur-md rounded-xl p-6 mb-10 shadow-lg border border-gray-500">
        <h3 className="text-2xl font-bold text-white mb-4 text-center">
          Overview Chart
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="white" />
            <YAxis stroke="white" />
            <Tooltip
              contentStyle={{ backgroundColor: "#1F2937", border: "none", color: "white" }}
            />
            {chartData.map((entry, idx) => (
              <Bar
                key={idx}
                dataKey="value"
                data={[entry]}
                name={entry.name}
                fill={entry.color}
                barSize={40}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pending Payments Table */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-4">
          Pending Coin Payments
        </h3>
        {pendingPayments.length === 0 ? (
          <p className="text-gray-300">No pending payments found.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-500 bg-gray-700/50 backdrop-blur-md">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-800/90 text-white text-sm uppercase">
                  <th className="px-6 py-3 text-left">#</th>
                  <th className="px-6 py-3 text-left">Buyer ID</th>
                  <th className="px-6 py-3 text-left">Amount</th>
                  <th className="px-6 py-3 text-left">Coin</th>
                  <th className="px-6 py-3 text-left">Stripe ID</th>
                  <th className="px-6 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingPayments.map((payment, index) => (
                  <tr
                    key={payment._id}
                    className={`border-t ${
                      index % 2 === 0 ? "bg-gray-700/30" : "bg-gray-700/20"
                    } hover:bg-gray-600/40 transition-colors`}
                  >
                    <td className="px-6 py-4 text-white">{index + 1}</td>
                    <td className="px-6 py-4 text-gray-200">{payment.buyer_id}</td>
                    <td className="px-6 py-4 text-green-400">${payment.amount}</td>
                    <td className="px-6 py-4 text-yellow-300">{payment.coin}</td>
                    <td className="px-6 py-4 text-gray-300">{payment.stripe_id}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleApprove(payment._id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm"
                      >
                        Approve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// StatCard component
const StatCard = ({ title, value, icon }) => (
  <div className="bg-gray-700/50 backdrop-blur-md border border-gray-500 p-5 rounded-xl shadow-md flex items-center gap-4">
    {icon}
    <div>
      <h4 className="text-sm text-gray-300">{title}</h4>
      <p className="text-xl font-bold text-white">{value}</p>
    </div>
  </div>
);

export default AdminHome;
