import React, { useState, useEffect } from "react";
import { getPaymentHistory } from "../../../services/payment.service";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userId = user.uid;
          const data = await getPaymentHistory(userId);
          setPayments(data);
          setError(null);
        } catch (err) {
          setError("Failed to load payment history.");
          setPayments([]);
        } finally {
          setLoading(false);
        }
      } else {
        setError("User is not logged in.");
        setPayments([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div className="text-center p-10 text-gray-500 text-lg">Loading payment history...</div>;

  if (error)
    return (
      <div className="text-center p-10 font-semibold text-red-600 bg-red-100 rounded-md max-w-lg mx-auto">
        {error}
      </div>
    );

  return (
    <div className="payment-history p-8 max-w-5xl mx-auto bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-4xl font-extrabold text-gray-800 mb-8 text-center tracking-wide">
        Payment History
      </h2>

      {payments.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-md shadow-sm">
            <thead className="bg-gray-100 border-b border-gray-300">
              <tr>
                <th className="text-gray-700 text-left px-6 py-4 text-lg font-semibold tracking-wide">Amount ($)</th>
                <th className="text-gray-700 text-left px-6 py-4 text-lg font-semibold tracking-wide">Coins</th>
                <th className="text-gray-700 text-left px-6 py-4 text-lg font-semibold tracking-wide">Payment Date</th>
                <th className="text-gray-700 text-left px-6 py-4 text-lg font-semibold tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, idx) => (
                <tr
                  key={payment._id}
                  className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="px-6 py-4 text-gray-900 font-medium text-base">${payment.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-gray-700 text-base">{payment.coin}</td>
                  <td className="px-6 py-4 text-gray-700 text-base">
                    {new Date(payment.createdAt || payment.payment_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-gray-700 text-base capitalize">{payment.status || "pending"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg italic mt-10">
          No payment history found.
        </p>
      )}
    </div>
  );
};

export default PaymentHistory;
