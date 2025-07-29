import React, { useState, useEffect } from "react";
import {
  getAdminStats,           // প্রথম কোডের মতো API কল
  getPendingPayments,      // দ্বিতীয় কোডের মতো API কল (Pending Payments)
  approvePayment,
} from "../../../services/admin.service";
import { toast } from "react-hot-toast";
import { FaUsers, FaUserTie, FaCoins, FaMoneyCheckAlt } from "react-icons/fa";

const AdminHome = () => {
  const [stats, setStats] = useState({
    totalWorker: 0,      // প্রথম কোডের মতো key নাম
    totalBuyer: 0,
    totalCoin: 0,
    totalPayments: 0,
  });
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      // প্রথম কোড থেকে admin stats (key গুলো first code style এ expect করা হয়েছে)
      const statsData = await getAdminStats();

      setStats({
        totalWorker: statsData?.totalWorker || 0,
        totalBuyer: statsData?.totalBuyer || 0,
        totalCoin: statsData?.totalCoin || 0,
        totalPayments: statsData?.totalPayments || 0,
      });

      // দ্বিতীয় কোডের মতো pending payments
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
      <div className="text-center py-10 text-xl font-medium">Loading...</div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Admin Dashboard
      </h2>

      {/* Stats Cards - প্রথম কোডের স্ট্যাটস ডেটা, কিন্তু দ্বিতীয় কোডের ডিজাইন */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Total Workers"
          value={stats.totalWorker}
          icon={<FaUserTie className="text-green-600 text-3xl" />}
        />
        <StatCard
          title="Total Buyers"
          value={stats.totalBuyer}
          icon={<FaUsers className="text-blue-600 text-3xl" />}
        />
        <StatCard
          title="Total Coins"
          value={stats.totalCoin}
          icon={<FaCoins className="text-yellow-600 text-3xl" />}
        />
        <StatCard
          title="Total Payments"
          value={`$${stats.totalPayments}`}
          icon={<FaMoneyCheckAlt className="text-red-600 text-3xl" />}
        />
      </div>

      {/* Pending Payments Table - দ্বিতীয় কোডের মতো */}
      <div>
        <h3 className="text-2xl font-bold text-gray-700 mb-4">
          Pending Coin Payments
        </h3>
        {pendingPayments.length === 0 ? (
          <p className="text-gray-500">No pending payments found.</p>
        ) : (
          <div className="overflow-x-auto rounded shadow-sm border border-gray-200">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-sm uppercase">
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
                  <tr key={payment._id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4">{payment.buyer_id}</td>
                    <td className="px-6 py-4">${payment.amount}</td>
                    <td className="px-6 py-4">{payment.coin}</td>
                    <td className="px-6 py-4">{payment.stripe_id}</td>
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
  <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-md flex items-center gap-4">
    {icon}
    <div>
      <h4 className="text-sm text-gray-500">{title}</h4>
      <p className="text-xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

export default AdminHome;









// import { useEffect, useState } from "react";
// import {
//   getAdminStats,
//   getPendingPayments,
//   approvePayment,
// } from "../../../services/admin.service";
// import { toast } from "react-hot-toast";
// import { FaUsers, FaUserTie, FaCoins, FaMoneyCheckAlt } from "react-icons/fa";

// const AdminHome = () => {
//   const [stats, setStats] = useState({
//     totalBuyers: 0,
//     totalWorkers: 0,
//     totalCoins: 0,
//     totalPayments: 0,
//   });
//   const [pendingPayments, setPendingPayments] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchData = async () => {
//     try {
//       const statsData = await getAdminStats();
//       console.log("Stats from API:", statsData); // ✅ Debug
//       const pending = await getPendingPayments();

//       setStats({
//         totalBuyers: statsData?.totalBuyers || 0,
//         totalWorkers: statsData?.totalWorkers || 0,
//         totalCoins: statsData?.totalCoins || 0,
//         totalPayments: statsData?.totalPayments || 0,
//       });
//       setPendingPayments(pending);
//     } catch (error) {
//       console.error("Error fetching admin data:", error);
//       toast.error("❌ Failed to load admin data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleApprove = async (paymentId) => {
//     try {
//       await approvePayment(paymentId);
//       toast.success("✅ Payment approved and coins added to buyer.");
//       fetchData();
//     } catch (error) {
//       console.error("Error approving payment:", error);
//       toast.error("❌ Failed to approve payment.");
//     }
//   };

//   if (loading) {
//     return <div className="text-center py-10 text-xl font-medium">Loading...</div>;
//   }

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Admin Dashboard</h2>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
//         <StatCard title="Total Buyers" value={stats.totalBuyers} icon={<FaUsers className="text-blue-600 text-3xl" />} />
//         <StatCard title="Total Workers" value={stats.totalWorkers} icon={<FaUserTie className="text-green-600 text-3xl" />} />
//         <StatCard title="Total Coins" value={stats.totalCoins} icon={<FaCoins className="text-yellow-600 text-3xl" />} />
//         <StatCard title="Total Payments" value={`$${stats.totalPayments}`} icon={<FaMoneyCheckAlt className="text-red-600 text-3xl" />} />
//       </div>

//       {/* Pending Payments */}
//       <div>
//         <h3 className="text-2xl font-bold text-gray-700 mb-4">Pending Coin Payments</h3>
//         {pendingPayments.length === 0 ? (
//           <p className="text-gray-500">No pending payments found.</p>
//         ) : (
//           <div className="overflow-x-auto rounded shadow-sm border border-gray-200">
//             <table className="min-w-full bg-white">
//               <thead>
//                 <tr className="bg-gray-100 text-gray-700 text-sm uppercase">
//                   <th className="px-6 py-3 text-left">#</th>
//                   <th className="px-6 py-3 text-left">Buyer ID</th>
//                   <th className="px-6 py-3 text-left">Amount</th>
//                   <th className="px-6 py-3 text-left">Coin</th>
//                   <th className="px-6 py-3 text-left">Stripe ID</th>
//                   <th className="px-6 py-3 text-left">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {pendingPayments.map((payment, index) => (
//                   <tr key={payment._id} className="border-t hover:bg-gray-50">
//                     <td className="px-6 py-4">{index + 1}</td>
//                     <td className="px-6 py-4">{payment.buyer_id}</td>
//                     <td className="px-6 py-4">${payment.amount}</td>
//                     <td className="px-6 py-4">{payment.coin}</td>
//                     <td className="px-6 py-4">{payment.stripe_id}</td>
//                     <td className="px-6 py-4">
//                       <button
//                         onClick={() => handleApprove(payment._id)}
//                         className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm"
//                       >
//                         Approve
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // StatCard component
// const StatCard = ({ title, value, icon }) => (
//   <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-md flex items-center gap-4">
//     {icon}
//     <div>
//       <h4 className="text-sm text-gray-500">{title}</h4>
//       <p className="text-xl font-bold text-gray-800">{value}</p>
//     </div>
//   </div>
// );

// export default AdminHome;