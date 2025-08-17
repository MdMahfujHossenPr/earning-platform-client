import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import useAxiosSecure from "./useAxiosSecure";

const useRole = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [role, setRole] = useState(null);
  const [coin, setCoin] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) {
      setRole(null);
      setCoin(0);
      setLoading(false);
      return;
    }

    const getUserData = async () => {
      try {
        const encodedEmail = encodeURIComponent(user.email);
        const res = await axiosSecure.get(`/users/role/${encodedEmail}`);

        setRole(res.data?.role || null);
        setCoin(res.data?.coin || 0);
      } catch (err) {
        console.error("❌ Error getting role/coin:", err);
        setRole(null);
        setCoin(0);
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, [user?.email, axiosSecure]);

  return { role, coin, loading };
};

export default useRole;
