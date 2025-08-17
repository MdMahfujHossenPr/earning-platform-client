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
    <div className="min-h-screen bg-gray-700 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-3xl shadow-2xl p-10">
        <h2 className="text-4xl font-extrabold text-center text-white mb-8">
          💸 Withdrawal Request
        </h2>

        {errorMessage && (
          <div className="bg-red-600 text-red-100 p-4 rounded-lg mb-6 text-center font-semibold">
            {errorMessage}
          </div>
        )}

        <div className="bg-gray-700 p-6 rounded-2xl shadow-md mb-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <p className="text-lg text-gray-200">
            <span className="font-bold">Your Coin Balance:</span>{" "}
            <span className="text-gray-400">{coin}</span> coins
          </p>
          <p className="text-lg text-gray-200">
            <span className="font-bold">You Can Withdraw:</span>{" "}
            <span className="text-green-400">${Math.floor(coin / 20)}</span> USD
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-gray-200 font-semibold mb-2">
              Coins to Withdraw
            </label>
            <input
              type="number"
              value={withdrawalCoin}
              onChange={handleCoinChange}
              className="w-full p-4 rounded-xl border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
              min="1"
              placeholder="Enter coins to withdraw"
              required
            />
          </div>

          <div>
            <label className="block text-gray-200 font-semibold mb-2">
              Withdrawal Amount ($)
            </label>
            <input
              type="number"
              value={withdrawalAmount}
              readOnly
              className="w-full p-4 rounded-xl border border-gray-600 bg-gray-600 text-gray-200"
            />
          </div>

          <div>
            <label className="block text-gray-200 font-semibold mb-2">
              Payment System
            </label>
            <select
              value={paymentSystem}
              onChange={(e) => setPaymentSystem(e.target.value)}
              className="w-full p-4 rounded-xl border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-400"
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
            <label className="block text-gray-200 font-semibold mb-2">
              Account Number
            </label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full p-4 rounded-xl border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="Enter account number"
              required
            />
          </div>

          <div className="mt-6">
            {withdrawalCoin >= 200 ? (
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-gray-400 to-gray-600 text-gray-900 font-bold text-lg rounded-2xl shadow-lg hover:opacity-90 transition duration-300"
              >
                Submit Withdrawal
              </button>
            ) : (
              <p className="text-red-400 font-medium text-center">
                Minimum 200 coins required to withdraw.
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Withdrawal;
