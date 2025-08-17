import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { getPendingSubmissions } from "../../../services/submission.service";

const MySubmissions = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchSubmissions = async () => {
      try {
        const allSubmissions = await getPendingSubmissions(user.uid);
        const userSubmissions = allSubmissions.filter(
          (sub) => sub.worker_email === user.email
        );
        setSubmissions(userSubmissions);
      } catch (err) {
        console.error("Error fetching submissions:", err);
        setError("Failed to load submissions.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="w-10 h-10 border-4 border-blue-400 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-200/20 text-red-400 rounded-lg text-center shadow">
        {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 bg-yellow-200/20 text-yellow-300 text-center rounded-lg shadow">
        Please log in to view your submissions.
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-100">
        📄 My Task Submissions
      </h2>

      {submissions.length === 0 ? (
        <div className="p-6 bg-gray-700 text-gray-200 text-center rounded-lg shadow">
          No submissions found. Start completing tasks to earn coins!
        </div>
      ) : (
        <div className="overflow-x-auto bg-gray-700 shadow-lg rounded-lg border border-gray-500/40">
          <table className="min-w-full divide-y divide-gray-600">
            <thead className="bg-gray-800 text-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase">Title</th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase">Buyer</th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase">Worker</th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {submissions.map((sub) => (
                <tr
                  key={sub._id}
                  className={`hover:bg-gray-600/50 transition ${
                    sub.status === "approved"
                      ? "bg-green-900/30"
                      : sub.status === "rejected"
                      ? "bg-red-900/30"
                      : ""
                  }`}
                >
                  <td className="px-4 py-3 text-sm text-gray-100">{sub.task_title}</td>
                  <td className="px-4 py-3 text-sm text-gray-100">{sub.payable_amount}</td>
                  <td className="px-4 py-3 text-sm text-gray-100">{sub.buyer_name || "N/A"}</td>
                  <td className="px-4 py-3 text-sm font-bold">
                    {sub.status === "pending" && (
                      <span className="text-yellow-400">⏳ Pending</span>
                    )}
                    {sub.status === "approved" && (
                      <span className="text-green-400">✅ Approved</span>
                    )}
                    {sub.status === "rejected" && (
                      <span className="text-red-400">❌ Rejected</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {sub.createdAt
                      ? new Date(sub.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "N/A"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-100">{sub.worker_name || "N/A"}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">{sub.submission_details || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MySubmissions;
