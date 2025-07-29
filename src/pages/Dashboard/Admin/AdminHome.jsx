import React, { useState, useEffect } from "react";
import { getAdminStats, getPendingWithdrawals, approvePayment } from "../../../services/admin.service"; // Import the service functions
import { showToast } from "../../../utils/showToast"; // For showing toast notifications

const AdminHome = () => {
  const [adminStats, setAdminStats] = useState({
    totalWorker: 0,
    totalBuyer: 0,
    totalCoin: 0,
    totalPayments: 0,
  });
  const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch admin stats and pending withdrawals on component mount
  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        const stats = await getAdminStats();
        setAdminStats(stats);
        const withdrawals = await getPendingWithdrawals();
        setPendingWithdrawals(withdrawals);
      } catch (error) {
        console.error("Error fetching admin data:", error);
        showToast("Error fetching admin data", "error");
      }
      setLoading(false);
    };
    fetchAdminData();
  }, []);

  // Handle approving a withdrawal request
  const handleApprovePayment = async (withdrawalId, workerEmail, amount) => {
    try {
      await approvePayment(withdrawalId, workerEmail, amount);
      showToast("Payment approved successfully", "success");
      // Reload the withdrawals after approving
      const updatedWithdrawals = await getPendingWithdrawals();
      setPendingWithdrawals(updatedWithdrawals);
    } catch (error) {
      console.error("Error approving payment:", error);
      showToast("Error approving payment", "error");
    }
  };

  return (
    <div className="admin-dashboard p-6">
      <h1 className="text-3xl font-semibold text-center mb-6">Admin Dashboard</h1>

      {/* Admin Stats */}
      <div className="admin-stats grid grid-cols-4 gap-6 mb-6">
        <div className="stat-card bg-white p-4 rounded-lg shadow-lg">
          <h3 className="font-semibold text-lg">Total Workers</h3>
          <p className="text-2xl">{adminStats.totalWorker}</p>
        </div>
        <div className="stat-card bg-white p-4 rounded-lg shadow-lg">
          <h3 className="font-semibold text-lg">Total Buyers</h3>
          <p className="text-2xl">{adminStats.totalBuyer}</p>
        </div>
        <div className="stat-card bg-white p-4 rounded-lg shadow-lg">
          <h3 className="font-semibold text-lg">Total Coins</h3>
          <p className="text-2xl">{adminStats.totalCoin}</p>
        </div>
        <div className="stat-card bg-white p-4 rounded-lg shadow-lg">
          <h3 className="font-semibold text-lg">Total Payments</h3>
          <p className="text-2xl">{adminStats.totalPayments}</p>
        </div>
      </div>

      {/* Pending Withdrawals Table */}
      <div className="withdrawals-table bg-white p-4 rounded-lg shadow-lg">
        <h3 className="font-semibold text-lg mb-4">Pending Withdrawal Requests</h3>
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Worker Name</th>
              <th className="px-4 py-2">Withdrawal Amount</th>
              <th className="px-4 py-2">Payment System</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingWithdrawals.map((withdrawal) => (
              <tr key={withdrawal._id}>
                <td className="px-4 py-2">{withdrawal.worker_name}</td>
                <td className="px-4 py-2">${withdrawal.withdrawal_amount}</td>
                <td className="px-4 py-2">{withdrawal.payment_system}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() =>
                      handleApprovePayment(
                        withdrawal._id,
                        withdrawal.worker_email,
                        withdrawal.withdrawal_amount
                      )
                    }
                    className="btn btn-primary bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Approve Payment
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminHome;
