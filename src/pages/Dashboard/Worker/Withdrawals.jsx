import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { addWithdrawalRequest } from "../../../services/withdrawal.service"; // Ensure this service function is defined
import { useNavigate } from "react-router-dom";
import useRole from "../../../hooks/useRole"; // useRole হুক ব্যবহার করা হচ্ছে


const Withdrawal = () => {
  const { user } = useAuth();
  const { coin } = useRole(); // Get coin from useRole hook
  const navigate = useNavigate();
  const [withdrawalCoin, setWithdrawalCoin] = useState(0);
  const [withdrawalAmount, setWithdrawalAmount] = useState(0);
  const [paymentSystem, setPaymentSystem] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const paymentSystems = ["Bkash", "Rocket", "Nagad", "Other"]; // Payment system options

  const handleCoinChange = (e) => {
    const coins = e.target.value;
    setWithdrawalCoin(coins);
    setWithdrawalAmount(coins / 20); // Calculate the withdrawal amount (20 coins = 1 dollar)
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

      // Call the service to save the withdrawal request in the database
      await addWithdrawalRequest(withdrawalData);

      alert("Withdrawal request submitted successfully!");
      navigate("/dashboard/withdrawals"); // Redirect to withdrawals page
    } catch (error) {
      console.error("Error submitting withdrawal request:", error);
      setErrorMessage("There was an error processing your withdrawal request.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-xl">
      <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">Withdrawal Form</h2>

      {errorMessage && <div className="text-red-500 text-center mb-4">{errorMessage}</div>}

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <p className="text-gray-700">
          <strong>Your Current Coin Balance:</strong> {coin} Coins
        </p>
        <p className="text-gray-700">
          <strong>Your Total Withdrawal Amount:</strong> ${Math.floor(coin / 20)} USD
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium">Coin To Withdraw</label>
          <input
            type="number"
            name="withdrawalCoin"
            value={withdrawalCoin}
            onChange={handleCoinChange}
            className="input input-bordered w-full text-gray-700 p-3 mt-2 rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Withdrawal Amount ($)</label>
          <input
            type="number"
            name="withdrawalAmount"
            value={withdrawalAmount}
            readOnly
            className="input input-bordered w-full text-gray-700 p-3 mt-2 rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Select Payment System</label>
          <select
            name="paymentSystem"
            value={paymentSystem}
            onChange={(e) => setPaymentSystem(e.target.value)}
            className="input input-bordered w-full text-gray-700 p-3 mt-2 rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Payment System</option>
            {paymentSystems.map((system) => (
              <option key={system} value={system}>
                {system}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Account Number</label>
          <input
            type="text"
            name="accountNumber"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            className="input input-bordered w-full text-gray-700 p-3 mt-2 rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="text-center mt-4">
          {withdrawalCoin >= 200 ? (
            <button
              type="submit"
              className="btn btn-primary w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none"
            >
              Submit Withdrawal
            </button>
          ) : (
            <p className="text-red-500">Insufficient coin balance for withdrawal (min 200 coins).</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Withdrawal;
