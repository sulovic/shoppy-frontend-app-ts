import { useState, useEffect } from "react";
import Spinner from "./Spinner";
import { useAuth } from "../hooks/useAuth";
import { Outlet } from "react-router-dom";

function PersistLogin() {
  const { authUser, accessToken, refreshAccessToken } = useAuth();
  const [showSpinner, setShowSpinner] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const verifyRefreshToken = async () => {
      try {
        await refreshAccessToken();
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setShowSpinner(false);
      }
    };

    if (!authUser || !accessToken) {
      verifyRefreshToken();
    } else {
      setShowSpinner(false);
    }

    return () => {
      isMounted = false;
    };
  }, [authUser, accessToken, refreshAccessToken]);

  return <>{showSpinner ? <Spinner /> : <Outlet />}</>;
}

export default PersistLogin;
