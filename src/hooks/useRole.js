import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext"; // ✅ path ঠিক রাখুন
import useAxiosSecure from "./useAxiosSecure";

const useRole = () => {
  const { user } = useContext(AuthContext); // ⬅️ এখানেই আগে error আসছিল
  const axiosSecure = useAxiosSecure();
  const [role, setRole] = useState(null);
  const [coin, setCoin] = useState(0); // State to store coin
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`http://localhost:5000/users/role/${user.email}`)
        .then((res) => {
          setRole(res.data.role);
          setCoin(res.data.coin || 0); // Set coin data
          setLoading(false);
        })
        .catch(() => {
          setRole(null);
          setCoin(0); // If error occurs, set coin to 0
          setLoading(false);
        });
    } else {
      setRole(null);
      setCoin(0); // If no user is logged in, set coin to 0
      setLoading(false);
    }
  }, [user, axiosSecure]);

  return { role, coin, loading }; // Return coin along with role and loading
};

export default useRole;
