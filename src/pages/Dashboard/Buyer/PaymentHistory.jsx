import React, { useEffect, useState } from 'react';
import { getPaymentHistory } from '../../../services/payment.service'; // Ensure this import is correct
import { useAuth } from '../../../context/AuthContext';

const PaymentHistory = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // For handling error state

  useEffect(() => {
    if (!user?._id) return; // Prevent fetch if user._id is null or undefined

    const fetchPayments = async () => {
      try {
        const data = await getPaymentHistory(user._id); // Fetch payments using the user ID
        setPayments(data); // Set the payments data
      } catch (error) {
        console.error('Failed to fetch payment history:', error);
        setError('Error fetching payment history.'); // Set error message if fetching fails
      } finally {
        setLoading(false); // Set loading to false after the request completes
      }
    };

    fetchPayments();
  }, [user?._id]); // Trigger effect when the user._id changes

  if (loading) {
    return <div className="p-4 text-lg font-medium text-blue-600">Loading payment history...</div>;
  }

  if (error) {
    return <div className="p-4 text-lg text-red-600">{error}</div>; // Show error message if available
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Payment History</h2>
      {payments.length === 0 ? (
        <p className="text-gray-600">No payments found.</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 border">Amount</th>
              <th className="py-2 px-4 border">Coins</th>
              <th className="py-2 px-4 border">Date</th>
              <th className="py-2 px-4 border">Payment Method</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id} className="text-center">
                <td className="py-2 px-4 border">${payment.amount}</td>
                <td className="py-2 px-4 border">{payment.coins}</td>
                <td className="py-2 px-4 border">{new Date(payment.payment_date).toLocaleDateString()}</td>
                <td className="py-2 px-4 border">{payment.payment_method}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PaymentHistory;
