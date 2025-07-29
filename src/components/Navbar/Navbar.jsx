import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaCoins, FaSignOutAlt, FaUserCircle, FaBell } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext"; // AuthContext import করা হয়েছে
import { showToast } from "../../utils/showToast"; // Toast show করার জন্য
import useRole from "../../hooks/useRole"; // useRole হুক ইম্পোর্ট
import { getNotifications } from "../../services/notification.service"; // Notification service import করা হয়েছে

const Navbar = () => {
  const { user, logout } = useAuth(); // Auth context থেকে user এবং logout function
  const { role, coin, loading } = useRole(); // useRole হুক থেকে role, coin এবং loading অবস্থা
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [loadingState, setLoadingState] = useState(false); // Loading state for logout
  const [notifications, setNotifications] = useState([]); // State to store notifications
  const [newNotificationCount, setNewNotificationCount] = useState(0); // Counter for new notifications
  const [showNotifications, setShowNotifications] = useState(false); // To toggle notification dropdown visibility

  useEffect(() => {
    if (user) {
      navigate("/dashboard"); // User login হয়ে গেলে ড্যাশবোর্ডে রিডাইরেক্ট
    }
  }, [user, navigate]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (user) {
      fetchNotifications(); // Fetch notifications when user is logged in
    }
  }, [user]);

  // Fetch notifications using the service function
  const fetchNotifications = async () => {
    try {
      const data = await getNotifications(user.email); // Get notifications using the service
      setNotifications(data);
      setNewNotificationCount(data.filter(notification => !notification.read).length); // Set unread notifications count
    } catch (error) {
      console.error("Error fetching notifications", error);
    }
  };

  const handleLogout = async () => {
    setLoadingState(true); // Logout হওয়ার সময় loading শুরু হবে
    await logout(); // Logout function call
    showToast("Logged out successfully", "success");
    navigate("/login");
    setLoadingState(false); // Logout হওয়ার পর loading শেষ হবে
  };

  // Toggle the notifications dropdown
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications); // Toggle notification dropdown visibility
    if (!showNotifications) {
      fetchNotifications(); // Fetch notifications when the dropdown is shown
    }
  };

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrollY > 30 ? "bg-gray-900 shadow-md" : "bg-gray-900 bg-opacity-90"}`}
    >
      <div className="navbar px-6 py-3 max-w-7xl mx-auto">
        {/* Left Navbar */}
        <div className="navbar-start">
          <Link
            to="/"
            className="text-white text-2xl font-bold tracking-wide hover:text-blue-400 transition-colors"
          >
            MicroTasks
          </Link>
        </div>

        {/* Center Navbar Links */}
        <div className="navbar-center hidden lg:flex">
          <ul className="space-x-6 text-white font-medium">
            <li>
              <a
                href="https://github.com/YOUR_GITHUB_CLIENT_REPO"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white font-semibold hover:underline"
              >
                <button className="btn btn-sm bg-gray-800 text-white font-semibold hover:bg-gray-900 transition">
                  Join as Developer
                </button>
              </a>
            </li>
          </ul>
        </div>

        {/* Right Navbar */}
        <div className="navbar-end flex items-center gap-4">
          {!user ? (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? "btn btn-sm bg-gray-800 text-white font-semibold transition" : "btn btn-sm bg-gray-800 text-white hover:bg-gray-900 transition"
                }
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className={({ isActive }) =>
                  isActive ? "btn btn-sm bg-gray-800 text-white font-semibold transition" : "btn btn-sm bg-gray-800 text-white hover:bg-gray-900 transition"
                }
              >
                Register
              </NavLink>
            </>
          ) : (
            <>
              {/* Profile and Dashboard Links */}
              <div className="flex items-center gap-4">
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    isActive ? "text-blue-300 font-semibold underline" : "hover:text-blue-400 transition-colors"
                  }
                >
                  Dashboard
                </NavLink>

                {/* Coin Display */}
                <div className="flex items-center gap-2 text-blue-400">
                  <FaCoins />
                  <span>{coin}</span> {/* Display coins based on role */}
                </div>

                {/* Role-based Display */}
                {role && <div className="text-gray-400 text-sm">{role}</div>} {/* Display user role */}
              </div>

              {/* Notification Icon */}
              <div className="relative">
                <FaBell
                  className="text-white text-xl cursor-pointer"
                  onClick={toggleNotifications} // Toggle notification dropdown visibility
                />
                {newNotificationCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs px-2 py-1">
                    {newNotificationCount}
                  </span>
                )}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 p-4 bg-gray-800 rounded-md shadow-lg text-white">
                    <h4 className="font-semibold text-lg">Notifications</h4>
                    {notifications.length > 0 ? (
                      notifications.map((notification, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center py-2 border-b border-gray-600"
                        >
                          <span>{notification.message}</span>
                          <span className="text-sm text-gray-400">
                            {new Date(notification.time).toLocaleString()}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div>No notifications available.</div>
                    )}
                  </div>
                )}
              </div>

              {/* User Avatar and Logout */}
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-full"
                >
                  <div className="w-10 rounded-full ring ring-blue-400 ring-offset-base-100 ring-offset-2">
                    <img
                      src={user?.profilePicture || "/default-avatar.png"} // Fallback image path
                      alt="User Avatar"
                      className="object-cover rounded-full"
                      onError={(e) => (e.target.src = "/default-avatar.png")}
                    />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-gray-800 rounded-box w-48 text-blue-300"
                >
                  <li className="text-center text-sm font-semibold px-2 py-1 border-b border-blue-400 truncate">
                    {user?.name || "User"}
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-left text-blue-300 hover:bg-blue-500 rounded-md transition"
                    >
                      <FaSignOutAlt />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Mobile Navbar */}
        <div className="dropdown lg:hidden ml-2">
          <label tabIndex={0} className="btn btn-square btn-ghost">
            <svg
              className="w-6 h-6 text-blue-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-gray-900 rounded-box w-52 text-blue-300"
          >
            {!user ? (
              <>
                <li>
                  <NavLink to="/login">Login</NavLink>
                </li>
                <li>
                  <NavLink to="/register">Register</NavLink>
                </li>
              </>
            ) : (
              <div>
                <li>
                  <NavLink to="/dashboard">Dashboard</NavLink>
                </li>
                <li className="flex items-center gap-1">
                  <FaCoins />
                  <span>{coin}</span>
                </li>
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </div>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
