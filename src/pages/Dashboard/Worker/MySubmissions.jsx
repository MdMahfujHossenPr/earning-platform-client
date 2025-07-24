import React, { useEffect, useState } from "react";
import { getWorkerSubmissions } from "../../../services/submission.service";
import { useAuth } from "../../../context/AuthContext";

const MySubmissions = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // To handle errors

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return; // Return early if no user
    }

    async function fetchSubmissions() {
      try {
        const data = await getWorkerSubmissions(user.email, user.token);
        setSubmissions(data);
      } catch (error) {
        console.error("Failed to fetch submissions:", error);
        setError("There was an error fetching your submissions.");
      } finally {
        setLoading(false);
      }
    }

    fetchSubmissions();
  }, [user]);

  if (loading) {
    return (
      <div className="loading-spinner">
        {/* You can replace this with a more complex loading indicator */}
        Loading...
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!user) {
    return (
      <div className="unauthenticated-message">
        Please log in to see your submissions.
      </div>
    );
  }

  return (
    <div>
      <h2>My Submissions</h2>
      {submissions.length === 0 ? (
        <p>No submissions found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Task Title</th>
              <th>Payable Amount</th>
              <th>Buyer Name</th>
              <th>Status</th>
              <th>Submission Date</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((sub) => (
              <tr
                key={sub._id}
                style={{
                  backgroundColor:
                    sub.status === "approved"
                      ? "#d4edda"
                      : sub.status === "rejected"
                      ? "#f8d7da"
                      : "transparent",
                }}
              >
                <td>{sub.task_title}</td>
                <td>{sub.payable_amount}</td>
                <td>{sub.buyer_name}</td>
                <td>{sub.status}</td>
                <td>
                  {/* Use a more consistent date format */}
                  {new Date(sub.submission_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MySubmissions;
