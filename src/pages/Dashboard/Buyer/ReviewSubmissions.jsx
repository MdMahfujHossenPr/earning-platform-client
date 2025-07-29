import React, { useEffect, useState } from "react";
import { getPendingSubmissions, approveSubmission, rejectSubmission } from "../../../services/submission.service";
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

        // Ensure data is an array before filtering
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
      await approveSubmission(submission._id, submission.worker_email, submission.payable_amount);
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
    <div className="p-6 min-h-screen bg-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Pending Submissions</h2>

      {loading ? (
        <div className="text-center text-lg text-gray-600">Loading...</div>
      ) : submissions.length === 0 ? (
        <div className="text-center text-gray-500">No pending submissions.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto bg-white rounded shadow">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="px-4 py-2">Worker Name</th>
                <th className="px-4 py-2">Task Title</th>
                <th className="px-4 py-2">Payable Amount</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub) => (
                <tr key={sub._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{sub.worker_name}</td>
                  <td className="px-4 py-2">{sub.task_title}</td>
                  <td className="px-4 py-2">${sub.payable_amount}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => {
                        setSelected(sub);
                        setModalOpen(true);
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
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

      {modalOpen && selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Submission Details</h3>
            <p><strong>Worker:</strong> {selected.worker_name}</p>
            <p><strong>Task:</strong> {selected.task_title}</p>
            <p><strong>Details:</strong> {selected.submission_details}</p>
            <p><strong>Payable:</strong> ${selected.payable_amount}</p>

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => handleApprove(selected)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                Approve
              </button>
              <button
                onClick={() => handleReject(selected)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Reject
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
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
