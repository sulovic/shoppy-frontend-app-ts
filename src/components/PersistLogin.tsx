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
      if (!authUser || !accessToken) {
        await refreshAccessToken();
        setLoading(false);
      }
    };

    verifyToken();
  }, []); // run once on mount

  return <>{loading ? <Spinner /> : <Outlet />}</>;
}

export default PersistLogin;
