import { useState, useEffect } from "react";
import Spinner from "./Spinner";
import { useAuth } from "../hooks/useAuth";
import { Outlet } from "react-router-dom";

function PersistLogin() {
  const { authUser, accessToken, refreshAccessToken } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("PersistLogin");
    const verifyToken = async () => {
      try {
        if (!authUser || !accessToken) {
          await refreshAccessToken();
        }
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [authUser]);

  return <>{loading ? <Spinner /> : <Outlet />}</>;
}

export default PersistLogin;
