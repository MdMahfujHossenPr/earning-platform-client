import React, { useEffect, useState } from 'react';
import {
  getWithdrawRequests,
  approveWithdrawRequest,
} from '../../../services/withdraw.service';
import { toast } from 'react-hot-toast';

const WithdrawRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await getWithdrawRequests();
      setRequests(data);
    } catch (error) {
      console.error("Failed to fetch withdrawal requests:", error);
      toast.error('❌ Failed to fetch withdrawal requests.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    if (window.confirm('Approve this withdrawal request?')) {
      try {
        await approveWithdrawRequest(requestId);
        toast.success('✅ Withdrawal request approved!');
        fetchRequests();
      } catch (error) {
        console.error(error);
        toast.error('❌ Approval failed. Try again.');
      }
    }
  };

  return (
    <div className="px-4 md:px-10 py-8 max-w-7xl mx-auto min-h-screen">
      <h2 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white animate-fade-in">
        Withdrawal Requests
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : requests.length > 0 ? (
        <div className="overflow-x-auto shadow-2xl rounded-xl border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md animate-slide-up">
          <table className="table w-full text-sm md:text-base">
            <thead className="bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 uppercase text-xs sm:text-sm">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Coins</th>
                <th className="py-3 px-4">Amount ($)</th>
                <th className="py-3 px-4">Payment System</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-800 dark:text-gray-200">
              {requests.map((req, index) => (
                <tr
                  key={req._id}
                  className={`transition-all duration-200 hover:bg-blue-50 dark:hover:bg-gray-700 ${
                    index % 2 === 0 ? 'bg-white/50 dark:bg-gray-800/50' : 'bg-white/30 dark:bg-gray-700/30'
                  }`}
                >
                  <td className="py-3 px-4 font-medium">{req.worker_name}</td>
                  <td className="py-3 px-4">{req.withdrawal_coin}</td>
                  <td className="py-3 px-4 text-green-600 font-semibold">
                    ${req.withdrawal_amount}
                  </td>
                  <td className="py-3 px-4">{req.payment_system}</td>
                  <td className="py-3 px-4">
                    {new Date(req.withdraw_date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        req.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {req.status === 'pending' && (
                      <button
                        onClick={() => handleApprove(req._id)}
                        className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-semibold px-4 py-2 rounded-lg shadow-lg transition-all duration-300"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center mt-16 animate-fade-in">
          <p className="text-gray-500 dark:text-gray-300 text-lg font-medium">
            No withdrawal requests found.
          </p>
        </div>
      )}
    </div>
  );
};

export default WithdrawRequests;
