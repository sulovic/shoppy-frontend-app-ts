import React, { useState, useEffect } from "react";
import Spinner from "./Spinner";
import { useAuth } from "../Context/AuthContext";
import { Outlet } from "react-router-dom";

function PersistLogin() {
  const { authUser, accessToken, refreshAccessToken } = useAuth();
  const [showSpinner, setShowSpinner] = useState(true);

  useEffect(() => {

    const verifyRefreshToken = async () => {
      try {
        await refreshAccessToken();
      } catch (err) {
        console.error(err);
      } finally {
        setShowSpinner(false);
      }
    };
    !( authUser && accessToken) ? verifyRefreshToken() : setShowSpinner(false);

  }, []);


  return (
    <>{showSpinner ? <Spinner /> : <Outlet />}</>
  );
}

export default PersistLogin;
