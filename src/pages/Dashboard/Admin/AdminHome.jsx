import React, { useEffect, useState } from 'react';
import { getUsersCount, getTotalCoins, getTotalPayments } from '../../../services/admin.service';

const AdminHome = () => {
  const [stats, setStats] = useState({
    totalWorkers: 0,
    totalBuyers: 0,
    totalCoins: 0,
    totalPayments: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      // এই ফাংশনগুলো আপনাকে নিজে সার্ভার থেকে ডাটা নিয়ে আসতে হবে
      const workers = await getUsersCount('worker');
      const buyers = await getUsersCount('buyer');
      const coins = await getTotalCoins();
      const payments = await getTotalPayments();

      setStats({
        totalWorkers: workers,
        totalBuyers: buyers,
        totalCoins: coins,
        totalPayments: payments,
      });
    }
    fetchStats();
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <div>Total Workers: {stats.totalWorkers}</div>
      <div>Total Buyers: {stats.totalBuyers}</div>
      <div>Total Available Coins: {stats.totalCoins}</div>
      <div>Total Payments: ${stats.totalPayments}</div>
    </div>
  );
};

export default AdminHome;

