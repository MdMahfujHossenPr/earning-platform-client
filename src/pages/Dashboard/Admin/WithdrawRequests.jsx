import React, { useEffect, useState } from 'react';
import { getWithdrawRequests, approveWithdrawRequest } from '../../../services/withdraw.service';
import { showToast } from '../../../utils/showToast'; // Import the showToast function

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
      setLoading(false);
    } catch (error) {
      showToast("Failed to fetch withdrawal requests", "error"); // Show error toast if fetching fails
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    if (window.confirm("Approve this withdrawal request?")) {
      await approveWithdrawRequest(requestId);
      fetchRequests(); // Refresh the requests after approval
    }
  };

  return (
    <div>
      <h2>Withdrawal Requests</h2>
      {loading && <p>Loading...</p>} {/* Show loading text while fetching */}
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Withdrawal Coins</th>
            <th>Amount ($)</th>
            <th>Payment System</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(req => (
            <tr key={req._id}>
              <td>{req.worker_name}</td>
              <td>{req.withdrawal_coin}</td>
              <td>{req.withdrawal_amount}</td>
              <td>{req.payment_system}</td>
              <td>{new Date(req.withdraw_date).toLocaleDateString()}</td>
              <td>{req.status}</td>
              <td>
                {req.status === 'pending' && (
                  <button onClick={() => handleApprove(req._id)}>Payment Success</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WithdrawRequests;
