import React from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { toast } from "react-toastify";

const ProtectRoute: React.FC<{ minRole?: number }> = ({ minRole = 5000 }) => {
  const { authUser } = useAuth();

  if (authUser && authUser?.role_id > minRole) {
    return <Outlet />;
  } else {
    toast.warning(
      <div>
        UPS!!! Izgleda da niste autorizovani da posetite ovu lokaciju!
        <br /> Bićete preusmereni na početnu stranu...
      </div>,
      {
        position: "top-center",
        autoClose: 3000,
      }
    );
    setTimeout(() => {
      window.location.href = "/";
    }, 3500);
    return null;
  }
};

export default ProtectRoute;
