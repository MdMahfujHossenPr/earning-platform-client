import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { getPendingSubmissions } from "../../../services/submission.service";
import { showToast } from "../../../utils/showToast";

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
        const data = await getPendingSubmissions(user.uid);
        setSubmissions(data);
      } catch (error) {
        console.error("Failed to fetch submissions:", error);
        setError("There was an error fetching your submissions.");
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
      <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-4 text-center font-semibold shadow">
        {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 text-center bg-yellow-100 text-yellow-700 rounded-lg font-medium shadow">
        Please log in to see your submissions.
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
        📄 My Task Submissions
      </h2>

      {submissions.length === 0 ? (
        <div className="p-6 text-center bg-blue-100 text-blue-700 rounded-lg font-medium shadow">
          No submissions found. Start completing tasks to earn coins!
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-xl rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">Task Title</th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">Buyer</th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">Worker</th>
                <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {submissions
                .filter((sub) => sub.worker_email === user.email)
                .map((sub) => (
                  <tr
                    key={sub._id}
                    className={`transition duration-200 hover:bg-blue-50 ${
                      sub.status === "approved"
                        ? "bg-green-50"
                        : sub.status === "rejected"
                        ? "bg-red-50"
                        : ""
                    }`}
                  >
                    <td className="px-4 py-3 text-sm text-gray-800">{sub.task_title}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{sub.payable_amount}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{sub.buyer_name || "No buyer"}</td>
                    <td className="px-4 py-3 text-sm font-semibold">
                      {sub.status === "pending" && (
                        <span className="text-yellow-500">Pending</span>
                      )}
                      {sub.status === "approved" && (
                        <span className="text-green-600">Approved</span>
                      )}
                      {sub.status === "rejected" && (
                        <span className="text-red-500">Rejected</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {sub.createdAt
                        ? new Date(sub.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "No date"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{sub.worker_name || "No worker"}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {sub.submission_details || "No details"}
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

export default MySubmissions;
