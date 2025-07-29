import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { addWithdrawalRequest } from "../../../services/withdrawal.service";
import { useNavigate } from "react-router-dom";
import useRole from "../../../hooks/useRole";

const Withdrawal = () => {
  const { user } = useAuth();
  const { coin } = useRole();
  const navigate = useNavigate();

  const [withdrawalCoin, setWithdrawalCoin] = useState(0);
  const [withdrawalAmount, setWithdrawalAmount] = useState(0);
  const [paymentSystem, setPaymentSystem] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const paymentSystems = ["Bkash", "Rocket", "Nagad", "Other"];

  const handleCoinChange = (e) => {
    const coins = parseInt(e.target.value);
    setWithdrawalCoin(coins);
    setWithdrawalAmount(coins / 20);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (withdrawalCoin < 200) {
      setErrorMessage("You must have at least 200 coins to withdraw.");
      return;
    }

    if (withdrawalCoin > coin) {
      setErrorMessage("Insufficient coins.");
      return;
    }

    if (!paymentSystem || !accountNumber) {
      setErrorMessage("Please select a payment system and provide an account number.");
      return;
    }

    try {
      const withdrawalData = {
        worker_email: user.email,
        worker_name: user.name,
        withdrawal_coin: withdrawalCoin,
        withdrawal_amount: withdrawalAmount,
        payment_system: paymentSystem,
        account_number: accountNumber,
        withdraw_date: new Date(),
        status: "pending",
      };

      await addWithdrawalRequest(withdrawalData);
      alert("Withdrawal request submitted successfully!");
      navigate("/dashboard/withdrawals");
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("There was an error processing your withdrawal request.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-gradient-to-br from-blue-100 to-purple-200 p-8 rounded-2xl shadow-xl">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">💸 Withdrawal Request</h2>

        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded mb-4 text-center">
            {errorMessage}
          </div>
        )}

        <div className="bg-white p-6 rounded-xl shadow-md mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <p className="text-lg text-gray-700">
            <span className="font-bold">Your Coin Balance:</span> <span className="text-blue-600">{coin}</span> coins
          </p>
          <p className="text-lg text-gray-700">
            <span className="font-bold">You Can Withdraw:</span>{" "}
            <span className="text-green-600">${Math.floor(coin / 20)}</span> USD
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-gray-800 font-semibold mb-1">Coins to Withdraw</label>
            <input
              type="number"
              value={withdrawalCoin}
              onChange={handleCoinChange}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-gray-800 font-semibold mb-1">Withdrawal Amount ($)</label>
            <input
              type="number"
              value={withdrawalAmount}
              readOnly
              className="w-full p-3 rounded-lg border border-gray-200 bg-gray-100 text-gray-600"
            />
          </div>

          <div>
            <label className="block text-gray-800 font-semibold mb-1">Payment System</label>
            <select
              value={paymentSystem}
              onChange={(e) => setPaymentSystem(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled className="text-gray-400">
                -- Select Payment System --
              </option>
              {paymentSystems.map((system) => (
                <option key={system} value={system}>
                  {system}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-800 font-semibold mb-1">Account Number</label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mt-4">
            {withdrawalCoin >= 200 ? (
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg rounded-lg hover:opacity-90 transition"
              >
                Submit Withdrawal
              </button>
            ) : (
              <p className="text-red-500 font-medium text-center">Minimum 200 coins required to withdraw.</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Withdrawal;
