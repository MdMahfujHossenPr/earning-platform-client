import React, { useEffect, useState } from "react";
import { getWorkerStats } from "../../../services/worker.service";
import { useAuth } from "../../../context/AuthContext";

const WorkerHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    pendingSubmissions: 0,
    totalEarnings: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      const data = await getWorkerStats(user.email);
      setStats(data);
    }
    fetchStats();
  }, [user.email]);

  return (
    <div>
      <h2>Worker Dashboard</h2>
      <p>Total Submissions: {stats.totalSubmissions}</p>
      <p>Pending Submissions: {stats.pendingSubmissions}</p>
      <p>Total Earnings: {stats.totalEarnings} Coins</p>
    </div>
  );
};

export default WorkerHome;
