import React, { useEffect, useState } from 'react';
import { getBuyerStats } from '../../../services/buyer.service';  // API call for buyer stats
import { useAuth } from '../../../context/AuthContext';  // Import Auth context

const BuyerHome = () => {
  const [stats, setStats] = useState({ totalTasks: 0, pendingTasks: 0, totalPayments: 0 });
  const [loading, setLoading] = useState(true); // Loading state for fetching stats
  const [error, setError] = useState(null); // Error state for handling API errors

  const { user, loading: authLoading } = useAuth(); // Access the current user from Auth context

  useEffect(() => {
    async function fetchStats() {
      if (authLoading) {
        return;  // If auth is still loading, don't make the API call
      }

      if (!user || !user.uid) {
        setError("User ID is missing");  // Check if user or user.id is not available
        setLoading(false);
        return;
      }

      try {
        const data = await getBuyerStats(user.uid);  // Pass user.id or user.uid here
        setStats(data);
      } catch (error) {
        setError("Error fetching stats, please try again later.");
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false); // Stop loading once data is fetched
      }
    }

    fetchStats();
  }, [user, authLoading]); // Run the effect again if `user` or `authLoading` changes

  // Display loading state while data is being fetched
  if (loading) {
    return <div className="p-4 text-lg font-medium text-blue-600">Loading payment history...</div>;
  }

  // Display error message if fetching fails
  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Buyer Dashboard</h2>
      <div className="bg-gray-100 p-4 rounded-lg shadow-md">
        <div className="mb-4">
          <strong>Total Tasks:</strong> {stats.totalTasks}
        </div>
        <div className="mb-4">
          <strong>Pending Tasks:</strong> {stats.pendingTasks}
        </div>
        <div className="mb-4">
          <strong>Total Payments:</strong> ${stats.totalPayments}
        </div>
      </div>
    </div>
  );
};

export default BuyerHome;
