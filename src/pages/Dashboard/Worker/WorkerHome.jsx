import React, { useEffect, useState } from "react";
import { getPendingSubmissions } from "../../../services/submission.service";  // Import functions from submission.service
import { useAuth } from "../../../context/AuthContext";  // To access the logged-in user info

const WorkerHome = () => {
  const { user } = useAuth();  // Access logged-in user's information
  const [submissions, setSubmissions] = useState([]); // State to store submissions
  const [totalSubmissions, setTotalSubmissions] = useState(0);  // Total submissions count
  const [totalPending, setTotalPending] = useState(0);  // Total pending submissions count
  const [totalEarnings, setTotalEarnings] = useState(0);  // Total earnings from approved submissions
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to store any error

  // Fetch worker submissions data when the component is mounted
  useEffect(() => {
    if (!user) return; // If user is not logged in, stop further execution

    const fetchWorkerData = async () => {
      try {
        const pendingData = await getPendingSubmissions(user.uid);  // Fetch the pending submissions for the logged-in worker
        setSubmissions(pendingData);  // Set the fetched submissions in state

        // Calculate total submissions, total pending, and total earnings
        const totalSubmissions = pendingData.length; // Total submissions
        const totalPending = pendingData.filter(sub => sub.status === "pending").length; // Filter for pending status
        const totalEarnings = pendingData.reduce((acc, sub) => {
          return sub.status === "approved" ? acc + sub.payable_amount : acc;
        }, 0); // Calculate total earnings

        setTotalSubmissions(totalSubmissions);
        setTotalPending(totalPending);
        setTotalEarnings(totalEarnings);
      } catch (err) {
        setError("Failed to load submissions.");
        console.error("Error fetching submissions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkerData();
  }, [user]);

  // If loading, show a loading spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center p-10">
        <div className="spinner-border animate-spin h-8 w-8 border-t-4 border-blue-500 rounded-full"></div>
      </div>
    );
  }

  // If there's an error, show an error message
  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-4">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Worker Dashboard</h2>

      {/* Stats Section */}
      <div className="mb-6">
        <div className="flex space-x-6">
          <div className="bg-blue-100 p-4 rounded-lg shadow-md text-center">
            <h4 className="font-semibold text-xl">Total Submissions</h4>
            <p className="text-2xl">{totalSubmissions}</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg shadow-md text-center">
            <h4 className="font-semibold text-xl">Total Pending Submissions</h4>
            <p className="text-2xl">{totalPending}</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg shadow-md text-center">
            <h4 className="font-semibold text-xl">Total Earnings</h4>
            <p className="text-2xl">${totalEarnings}</p>
          </div>
        </div>
      </div>

      {/* Pending Submissions Table */}
      <h3 className="text-xl font-semibold mb-4">Pending Submissions</h3>
      {submissions.length === 0 ? (
        <p>No pending submissions found.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Task Title</th>
                <th className="px-4 py-2 text-left">Payable Amount</th>
                <th className="px-4 py-2 text-left">Buyer Name</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{submission.task_title}</td>
                  <td className="px-4 py-2">{submission.payable_amount}</td>
                  <td className="px-4 py-2">{submission.buyer_name}</td>
                  <td className="px-4 py-2">
                    {submission.status === "pending" && (
                      <span className="text-yellow-500 font-semibold">Pending</span>
                    )}
                    {submission.status === "approved" && (
                      <span className="text-green-500 font-semibold">Approved</span>
                    )}
                    {submission.status === "rejected" && (
                      <span className="text-red-500 font-semibold">Rejected</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WorkerHome;
