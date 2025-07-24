import React, { useEffect, useState } from "react";
import {
  getWithdrawals,
  requestWithdrawal,
} from "../../../services/withdrawal.service";
import { useAuth } from "../../../context/AuthContext";

const Withdrawals = () => {
  const { user } = useAuth();
  const [coinToWithdraw, setCoinToWithdraw] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [paymentSystem, setPaymentSystem] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [userCoins, setUserCoins] = useState(0);
  const [withdrawRequests, setWithdrawRequests] = useState([]);

  useEffect(() => {
    // Fetch user coin from backend or context
    setUserCoins(user.coin || 0);

    async function fetchWithdrawals() {
      const data = await getWithdrawals(user.email);
      setWithdrawRequests(data);
    }
    fetchWithdrawals();
  }, [user]);

  const handleCoinChange = (e) => {
    const val = e.target.value;
    setCoinToWithdraw(val);
    setWithdrawAmount(val ? val / 20 : 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (coinToWithdraw > userCoins) {
      alert("You do not have enough coins");
      return;
    }
    if (!paymentSystem || !accountNumber) {
      alert("Please fill all fields");
      return;
    }
    await requestWithdrawal({
      worker_email: user.email,
      worker_name: user.display_name,
      withdrawal_coin: coinToWithdraw,
      withdrawal_amount: withdrawAmount,
      payment_system: paymentSystem,
      account_number: accountNumber,
      withdraw_date: new Date(),
      status: "pending",
    });
    alert("Withdrawal request submitted");
    setCoinToWithdraw("");
    setWithdrawAmount(0);
    setPaymentSystem("");
    setAccountNumber("");
  };

  return (
    <div>
      <h2>Withdraw Coins</h2>
      <p>Your Available Coins: {userCoins}</p>
      {userCoins < 200 ? (
        <p>Insufficient coins to withdraw (minimum 200 coins required)</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <label>
            Coins to Withdraw:
            <input
              type="number"
              value={coinToWithdraw}
              onChange={handleCoinChange}
              max={userCoins}
              min="20"
              required
            />
          </label>
          <p>Withdraw Amount ($): {withdrawAmount.toFixed(2)}</p>
          <label>
            Payment System:
            <select
              value={paymentSystem}
              onChange={(e) => setPaymentSystem(e.target.value)}
              required
            >
              <option value="">Select</option>
              <option value="Bkash">Bkash</option>
              <option value="Rocket">Rocket</option>
              <option value="Nagad">Nagad</option>
              <option value="Other">Other</option>
            </select>
          </label>
          <label>
            Account Number:
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              required
            />
          </label>
          <button type="submit">Withdraw</button>
        </form>
      )}

      <h3>Withdrawal Requests</h3>
      <table>
        <thead>
          <tr>
            <th>Coins</th>
            <th>Amount ($)</th>
            <th>Payment System</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {withdrawRequests.map((req) => (
            <tr key={req._id}>
              <td>{req.withdrawal_coin}</td>
              <td>{req.withdrawal_amount}</td>
              <td>{req.payment_system}</td>
              <td>{req.status}</td>
              <td>{new Date(req.withdraw_date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Withdrawals;
