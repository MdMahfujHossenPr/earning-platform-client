import React, { useState, useEffect } from 'react';
import { getPaymentHistory } from '../../../services/payment.service'; // Import payment service

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const userId = "user-id-here"; // Replace with actual user ID
        const data = await getPaymentHistory(userId);
        setPayments(data);
      } catch (error) {
        setError('Failed to load payment history.');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (error) return <div>{error}</div>;

  return (
    <div className="payment-history">
      <h2>Payment History</h2>
      {payments.length > 0 ? (
        <ul>
          {payments.map((payment) => (
            <li key={payment._id}>
              <p><strong>Amount:</strong> ${payment.amount}</p>
              <p><strong>Coins:</strong> {payment.coin}</p>
              <p><strong>Date:</strong> {new Date(payment.payment_date).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No payments found.</p>
      )}
    </div>
  );
};

export default PaymentHistory;
