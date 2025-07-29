import React, { useEffect, useState } from "react";
import { getNotifications } from "../../services/notification.service";
import { useAuth } from "../../context/AuthContext";

const NotificationPopUp = () => {
  const { user } = useAuth();  // Auth context থেকে user
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user?.email) {
      getNotifications(user.email)
        .then((data) => {
          setNotifications(data);
        })
        .catch((err) => console.error("Error fetching notifications", err));
    }
  }, [user]);

  return (
    <div className="notification-popup">
      <button className="btn btn-circle btn-ghost">
        <span className="badge">{notifications.length}</span> {/* Show notification count */}
      </button>
      <div className="popup-content">
        {notifications.length === 0 ? (
          <p>No notifications</p>
        ) : (
          notifications.map((notification) => (
            <div key={notification._id} className="notification-item">
              <p>{notification.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPopUp;
