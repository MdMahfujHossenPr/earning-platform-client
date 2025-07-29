import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";
import useRole from "../../hooks/useRole"; // useRole hook import করা হয়েছে

const BuyerProfile = () => {
  const { user } = useAuth();  // Auth context থেকে user
  const { role, loading } = useRole(); // Role এবং loading তথ্য নেয়ার জন্য useRole hook
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (user) {
      // এখানে আপনি user data টা API থেকে নিয়ে আসতে পারেন
      setUserProfile(user);
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>; // Loading state
  }

  return (
    <div className="profile-container p-6">
      <div className="profile-header text-center">
        <h2 className="text-2xl font-bold text-gray-800">Buyer Profile</h2>
      </div>
      <div className="profile-details mt-4">
        <div className="profile-avatar flex justify-center">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-400">
            <img
              src={userProfile?.photo_url || "/default-avatar.png"}
              alt="Profile"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
        <div className="profile-info mt-4 text-center">
          <p className="text-xl font-medium">{userProfile?.name || "User Name"}</p>
          <p className="text-sm text-gray-500">{userProfile?.email}</p>
        </div>
        <div className="profile-coins mt-4 text-center">
          <p className="text-lg font-semibold">Coins: {userProfile?.coin || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default BuyerProfile;
