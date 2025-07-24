import React, { useEffect, useState } from 'react';
import { getWithdrawRequests, approveWithdrawRequest } from '../../../services/withdraw.service';

const WithdrawRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const data = await getWithdrawRequests();
    setRequests(data);
  };

  const handleApprove = async (requestId) => {
    if(window.confirm("Approve this withdrawal request?")) {
      await approveWithdrawRequest(requestId);
      fetchRequests();
    }
  };

  return (
    <div>
      <h2>Withdrawal Requests</h2>
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
