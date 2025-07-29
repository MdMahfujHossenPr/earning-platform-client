import React, { useEffect, useState } from "react";
import { getPendingSubmissions } from "../../../services/submission.service";
import { useAuth } from "../../../context/AuthContext";

const WorkerHome = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchWorkerData = async () => {
      try {
        const pendingData = await getPendingSubmissions(user.uid);
        setSubmissions(pendingData);

        const totalSubmissions = pendingData.length;
        const totalPending = pendingData.filter(sub => sub.status === "pending").length;
        const totalEarnings = pendingData.reduce((acc, sub) => {
          return sub.status === "approved" ? acc + sub.payable_amount : acc;
        }, 0);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="h-10 w-10 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-4 text-center font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center text-white">🎯 Worker Dashboard</h2>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gradient-to-tr from-blue-500 to-blue-700 text-white p-6 rounded-xl shadow-lg text-center">
          <h4 className="font-semibold text-lg">Total Submissions</h4>
          <p className="text-3xl font-bold mt-2">{totalSubmissions}</p>
        </div>
        <div className="bg-gradient-to-tr from-yellow-400 to-yellow-600 text-white p-6 rounded-xl shadow-lg text-center">
          <h4 className="font-semibold text-lg">Pending Submissions</h4>
          <p className="text-3xl font-bold mt-2">{totalPending}</p>
        </div>
        <div className="bg-gradient-to-tr from-green-500 to-green-700 text-white p-6 rounded-xl shadow-lg text-center">
          <h4 className="font-semibold text-lg">Total Earnings</h4>
          <p className="text-3xl font-bold mt-2">${totalEarnings}</p>
        </div>
      </div>

      {/* Pending Submissions Table */}
      <h3 className="text-2xl font-semibold mb-4 text-white">📋 Submission Details</h3>

      {submissions.length === 0 ? (
        <p className="text-center text-white text-lg">No pending submissions found.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-xl rounded-xl border border-gray-200">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wide">
                <th className="px-6 py-3 text-left">Task Title</th>
                <th className="px-6 py-3 text-left">Payable Amount</th>
                <th className="px-6 py-3 text-left">Buyer Name</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{submission.task_title}</td>
                  <td className="px-6 py-4 font-medium">${submission.payable_amount}</td>
                  <td className="px-6 py-4">{submission.buyer_name}</td>
                  <td className="px-6 py-4">
                    {submission.status === "pending" && (
                      <span className="text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full text-sm font-semibold">
                        Pending
                      </span>
                    )}
                    {submission.status === "approved" && (
                      <span className="text-green-700 bg-green-100 px-3 py-1 rounded-full text-sm font-semibold">
                        Approved
                      </span>
                    )}
                    {submission.status === "rejected" && (
                      <span className="text-red-700 bg-red-100 px-3 py-1 rounded-full text-sm font-semibold">
                        Rejected
                      </span>
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
