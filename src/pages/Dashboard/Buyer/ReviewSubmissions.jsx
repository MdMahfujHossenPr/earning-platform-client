import React, { useEffect, useState } from "react";
import {
  getPendingSubmissions,
  approveSubmission,
  rejectSubmission,
} from "../../../services/submission.service";
import { getAuth } from "firebase/auth";

const ReviewSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        const userId = currentUser?.uid;

        if (!userId) {
          console.error("User not logged in");
          setLoading(false);
          return;
        }

        const data = await getPendingSubmissions(userId);
        if (Array.isArray(data)) {
          const pending = data.filter((s) => s.status === "pending");
          setSubmissions(pending);
        } else {
          console.error("Unexpected data format:", data);
        }
      } catch (err) {
        console.error("Failed to fetch pending submissions", err);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleApprove = async (submission) => {
    try {
      await approveSubmission(
        submission._id,
        submission.worker_email,
        submission.payable_amount
      );
      setSubmissions((prev) => prev.filter((s) => s._id !== submission._id));
      setModalOpen(false);
    } catch (error) {
      console.error("Approve failed:", error);
    }
  };

  const handleReject = async (submission) => {
    try {
      await rejectSubmission(submission._id, submission.task_id);
      setSubmissions((prev) => prev.filter((s) => s._id !== submission._id));
      setModalOpen(false);
    } catch (error) {
      console.error("Reject failed:", error);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-600">
      <h2 className="text-4xl font-extrabold mb-8 text-center text-white tracking-wide drop-shadow-md">
        Pending Submissions
      </h2>

      {loading ? (
        <div className="text-center text-lg text-gray-200 font-semibold animate-pulse">
          Loading...
        </div>
      ) : submissions.length === 0 ? (
        <div className="text-center text-gray-300 text-xl italic font-medium">
          No pending submissions.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-500 mx-auto max-w-7xl bg-gray-700/50 backdrop-blur-md">
          <table className="min-w-full divide-y divide-gray-500">
            <thead className="bg-gray-800/90 text-white">
              <tr>
                {["Worker Name", "Task Title", "Payable Amount", "Action"].map(
                  (header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-lg font-semibold select-none"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub, idx) => (
                <tr
                  key={sub._id}
                  className={`${
                    idx % 2 === 0 ? "bg-gray-700/40" : "bg-gray-700/20"
                  } hover:bg-gray-600/50 transition-colors duration-150 cursor-pointer`}
                >
                  <td className="px-6 py-4 text-white font-semibold whitespace-normal max-w-xs break-words">
                    {sub.worker_name}
                  </td>
                  <td className="px-6 py-4 text-gray-200 whitespace-normal max-w-sm break-words">
                    {sub.task_title}
                  </td>
                  <td className="px-6 py-4 text-green-400 font-medium">
                    ${sub.payable_amount}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        setSelected(sub);
                        setModalOpen(true);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modalOpen && selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-gray-700/70 rounded-xl shadow-xl max-w-md w-full p-6 relative backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold mb-4 text-white">
              Submission Details
            </h3>

            <p className="mb-2">
              <strong>Worker:</strong>{" "}
              <span className="text-gray-200">{selected.worker_name}</span>
            </p>
            <p className="mb-2">
              <strong>Task:</strong>{" "}
              <span className="text-gray-200">{selected.task_title}</span>
            </p>
            <p className="mb-2 whitespace-pre-wrap">
              <strong>Details:</strong>{" "}
              <span className="text-gray-300">{selected.submission_details}</span>
            </p>
            <p className="mb-4">
              <strong>Payable:</strong>{" "}
              <span className="text-green-400 font-semibold">
                ${selected.payable_amount}
              </span>
            </p>

            <div className="flex justify-between space-x-3">
              <button
                onClick={() => handleApprove(selected)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                Approve
              </button>
              <button
                onClick={() => handleReject(selected)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                Reject
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded shadow transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewSubmissions;
