import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FaCoins,
  FaSignOutAlt,
  FaUserCircle,
  FaBell,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { showToast } from "../../utils/showToast";
import useRole from "../../hooks/useRole";
import { getNotifications } from "../../services/notification.service";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { role, coin, loading } = useRole();
  const navigate = useNavigate();

  const [scrollY, setScrollY] = useState(0);
  const [loadingState, setLoadingState] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [newNotificationCount, setNewNotificationCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const notifRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  useEffect(() => {
    // Close dropdowns when clicking outside
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications(user.email);
      setNotifications(data);
      setNewNotificationCount(data.filter((n) => !n.read).length);
    } catch (error) {
      console.error("Error fetching notifications", error);
    }
  };

  const handleLogout = async () => {
    setLoadingState(true);
    await logout();
    showToast("Logged out successfully", "success");
    navigate("/login");
    setLoadingState(false);
  };

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
    if (!showNotifications) {
      fetchNotifications();
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrollY > 30 ? "bg-gray-900 shadow-md" : "bg-gray-900 bg-opacity-90"
      }`}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Logo */}
          <div className="flex-shrink-0 flex items-center space-x-2">
            <Link
              to="/"
              className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors"
              aria-label="MicroTasks Home"
            >
              <img
                src="/logos.png"
                alt="Logo"
                className="w-10 h-10 rounded-full border-2 border-white bg-black object-contain"
              />
              <span className="font-bold text-xl tracking-wide select-none">
                MicroTasks
              </span>
            </Link>
          </div>

          {/* Center: Desktop Links */}
          <nav className="hidden lg:flex space-x-6 font-medium text-white">
            <a
              href="https://github.com/MdMahfujHossenPr"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm bg-gray-800 text-white font-semibold hover:bg-gray-900 transition"
            >
              Join as Developer
            </a>
          </nav>

          {/* Right: User Menu & Icons */}
          <div className="flex items-center space-x-4">
            {!user ? (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive
                      ? "btn btn-sm bg-gray-800 text-white font-semibold"
                      : "btn btn-sm bg-gray-800 text-white hover:bg-gray-900 transition"
                  }
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    isActive
                      ? "btn btn-sm bg-gray-800 text-white font-semibold"
                      : "btn btn-sm bg-gray-800 text-white hover:bg-gray-900 transition"
                  }
                >
                  Register
                </NavLink>
              </>
            ) : (
              <>
                <div className="hidden md:flex items-center space-x-6">
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      isActive
                        ? "text-blue-300 font-semibold underline"
                        : "hover:text-blue-400 transition-colors"
                    }
                    aria-current={({ isActive }) =>
                      isActive ? "page" : undefined
                    }
                  >
                    Dashboard
                  </NavLink>

                  <div
                    className="flex items-center gap-1 text-blue-400 select-none"
                    title="Coins"
                  >
                    <FaCoins />
                    <span>{coin}</span>
                  </div>

                  {role && (
                    <div
                      className="text-gray-400 text-sm select-none"
                      title="User Role"
                    >
                      {role}
                    </div>
                  )}
                </div>

                {/* Notification */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={toggleNotifications}
                    aria-haspopup="true"
                    aria-expanded={showNotifications}
                    aria-label="Notifications"
                    className="text-white text-xl focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
                  >
                    <FaBell />
                    {newNotificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-xs px-2 py-0.5 font-semibold select-none">
                        {newNotificationCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div
                      className="absolute right-0 mt-2 w-80 p-4 bg-gray-800 rounded-md shadow-lg text-white max-h-96 overflow-y-auto z-50"
                      role="menu"
                      aria-label="Notifications"
                    >
                      <h4 className="font-semibold text-lg mb-2">
                        Notifications
                      </h4>
                      {notifications.length > 0 ? (
                        notifications.map((notification, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center py-2 border-b border-gray-600"
                          >
                            <p className="truncate">{notification.message}</p>
                            <time
                              className="text-xs text-gray-400 ml-2 whitespace-nowrap"
                              dateTime={notification.time}
                            >
                              {new Date(notification.time).toLocaleString()}
                            </time>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-gray-400">
                          No notifications available.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* User Avatar Dropdown */}
                <div className="dropdown dropdown-end relative">
                  <button
                    tabIndex={0}
                    aria-haspopup="true"
                    aria-expanded="false"
                    className="btn btn-ghost btn-circle avatar focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-full"
                    aria-label="User menu"
                  >
                    <img
                      src={user?.profilePicture || "/default-avatar.png"}
                      alt="User Avatar"
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => (e.target.src = "/default-avatar.png")}
                    />
                  </button>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu menu-sm mt-3 p-2 shadow bg-gray-800 rounded-box w-48 text-blue-300 absolute right-0"
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

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav
            ref={mobileMenuRef}
            className="lg:hidden bg-gray-900 bg-opacity-95 w-full shadow-md rounded-b-md mt-1 p-4 space-y-4 text-blue-300"
            aria-label="Mobile menu"
          >
            {!user ? (
              <>
                <NavLink
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded hover:bg-blue-700 transition"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded hover:bg-blue-700 transition"
                >
                  Register
                </NavLink>
              </>
            ) : (
              <>
                {/* Common */}
                <NavLink
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded hover:bg-blue-700 transition font-semibold"
                >
                  Dashboard
                </NavLink>

                {/* Buyer Routes */}
                {role === "Buyer" && (
                  <>
                    <NavLink
                      to="/dashboard/buyer-home"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 hover:bg-gray-700 rounded"
                    >
                      Buyer Home
                    </NavLink>
                    <NavLink
                      to="/dashboard/add-task"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 hover:bg-gray-700 rounded"
                    >
                      Add Task
                    </NavLink>
                    <NavLink
                      to="/dashboard/my-tasks"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 hover:bg-gray-700 rounded"
                    >
                      My Tasks
                    </NavLink>
                    <NavLink
                      to="/dashboard/buyer/payment-history"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 hover:bg-gray-700 rounded"
                    >
                      Payment History
                    </NavLink>
                    <NavLink
                      to="/dashboard/purchase-coin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 hover:bg-gray-700 rounded"
                    >
                      Purchase Coin
                    </NavLink>
                    <NavLink
                      to="/dashboard/review-submissions"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 hover:bg-gray-700 rounded"
                    >
                      Review Submissions
                    </NavLink>
                  </>
                )}

                {/* Worker Routes */}
                {role === "Worker" && (
                  <>
                    <NavLink
                      to="/dashboard/worker-home"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 hover:bg-gray-700 rounded"
                    >
                      Worker Home
                    </NavLink>
                    <NavLink
                      to="/dashboard/worker/my-submissions"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 hover:bg-gray-700 rounded"
                    >
                      My Submissions
                    </NavLink>
                    <NavLink
                      to="/dashboard/task-details/1"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 hover:bg-gray-700 rounded"
                    >
                      Task Details
                    </NavLink>
                    <NavLink
                      to="/dashboard/task-list"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 hover:bg-gray-700 rounded"
                    >
                      Task List
                    </NavLink>
                    <NavLink
                      to="/dashboard/withdrawals"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 hover:bg-gray-700 rounded"
                    >
                      Withdrawals
                    </NavLink>
                  </>
                )}

                {/* Admin Routes */}
                {role === "Admin" && (
                  <>
                    <NavLink
                      to="/dashboard/admin-home"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 hover:bg-gray-700 rounded"
                    >
                      Admin Home
                    </NavLink>
                    <NavLink
                      to="/dashboard/manage-tasks"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 hover:bg-gray-700 rounded"
                    >
                      Manage Tasks
                    </NavLink>
                    <NavLink
                      to="/dashboard/manage-users"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 hover:bg-gray-700 rounded"
                    >
                      Manage Users
                    </NavLink>
                    <NavLink
                      to="/dashboard/withdraw-requests"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 hover:bg-gray-700 rounded"
                    >
                      Withdraw Requests
                    </NavLink>
                  </>
                )}

                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded hover:bg-red-600 transition text-red-300"
                >
                  Logout
                </button>
              </>
            )}

            <a
              href="https://github.com/MdMahfujHossenPr"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 py-2 rounded hover:bg-gray-700 transition"
            >
              Join as Developer
            </a>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
