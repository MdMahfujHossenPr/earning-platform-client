import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext"; // ✅ path ঠিক রাখুন
import useAxiosSecure from "./useAxiosSecure";

const useRole = () => {
  const { user } = useContext(AuthContext); // ⬅️ এখানেই আগে error আসছিল
  const axiosSecure = useAxiosSecure();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`http://localhost:5000/users/role/${user.email}`)
        .then((res) => {
          setRole(res.data.role);
          setLoading(false);
        })
        .catch(() => {
          setRole(null);
          setLoading(false);
        });
    } else {
      setRole(null);
      setLoading(false);
    }
  }, [user, axiosSecure]);

  return { role, loading };
};

export default useRole;
