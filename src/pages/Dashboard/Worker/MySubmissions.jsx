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
        <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg text-center shadow">
        {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 bg-yellow-100 text-yellow-800 text-center rounded-lg shadow">
        Please log in to view your submissions.
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
        📄 My Task Submissions
      </h2>

      {submissions.length === 0 ? (
        <div className="p-6 bg-blue-100 text-blue-700 text-center rounded-lg shadow">
          No submissions found. Start completing tasks to earn coins!
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-xl rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
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
            <tbody className="bg-white divide-y divide-gray-100">
              {submissions.map((sub) => (
                <tr
                  key={sub._id}
                  className={`hover:bg-blue-50 transition ${
                    sub.status === "approved"
                      ? "bg-green-50"
                      : sub.status === "rejected"
                      ? "bg-red-50"
                      : ""
                  }`}
                >
                  <td className="px-4 py-3 text-sm">{sub.task_title}</td>
                  <td className="px-4 py-3 text-sm">{sub.payable_amount}</td>
                  <td className="px-4 py-3 text-sm">{sub.buyer_name || "N/A"}</td>
                  <td className="px-4 py-3 text-sm font-bold">
                    {sub.status === "pending" && (
                      <span className="text-yellow-500">⏳ Pending</span>
                    )}
                    {sub.status === "approved" && (
                      <span className="text-green-600">✅ Approved</span>
                    )}
                    {sub.status === "rejected" && (
                      <span className="text-red-500">❌ Rejected</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {sub.createdAt
                      ? new Date(sub.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "N/A"}
                  </td>
                  <td className="px-4 py-3 text-sm">{sub.worker_name || "N/A"}</td>
                  <td className="px-4 py-3 text-sm">{sub.submission_details || "N/A"}</td>
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
