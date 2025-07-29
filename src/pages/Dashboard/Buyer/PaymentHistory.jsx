import React, { useState, useEffect } from "react";
import { getPaymentHistory } from "../../../services/payment.service";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const statusColors = {
  succeeded: "bg-green-100 text-green-800",
  success: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  failed: "bg-red-100 text-red-800",
  error: "bg-red-100 text-red-800",
};

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const data = await getPaymentHistory(user.uid);
          setPayments(data);
          setError(null);
        } catch {
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

  if (loading)
    return (
      <div className="text-center p-10 text-gray-500 text-lg font-semibold">
        Loading payment history...
      </div>
    );

  if (error)
    return (
      <div className="max-w-lg mx-auto p-6 bg-red-100 text-red-700 rounded-lg font-semibold text-center mt-10 shadow-md">
        {error}
      </div>
    );

  return (
    <div className="payment-history max-w-6xl mx-auto p-8 bg-white rounded-xl shadow-lg mt-12">
      <h2 className="text-4xl font-extrabold text-blue-800 mb-10 text-center tracking-wide">
        Payment History
      </h2>

      {payments.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-gray-300 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-600">
              <tr>
                {[
                  "Amount ($)",
                  "Coins",
                  "Payment Date",
                  "Status",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-4 text-left text-white text-lg font-semibold tracking-wide select-none"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {payments.map((payment, idx) => {
                const status = (payment.status || "pending").toLowerCase();
                const statusClass = statusColors[status] || "bg-gray-100 text-gray-800";

                return (
                  <tr
                    key={payment._id}
                    className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium text-base">
                      ${payment.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 text-base">
                      {payment.coin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 text-base">
                      {new Date(payment.createdAt || payment.payment_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${statusClass}`}
                      >
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500 italic mt-16 text-lg font-medium">
          No payment history found.
        </p>
      )}
    </div>
  );
};

export default PaymentHistory;
