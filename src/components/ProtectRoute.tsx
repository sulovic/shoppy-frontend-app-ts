import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";

const ProtectRoute = ({ minRole = 5000 }: { minRole: number }) => {
  const { authUser } = useAuth();
  const navigate = useNavigate();

  console.log("Protect route");

  useEffect(() => {
    if (!authUser || authUser.roleId <= minRole) {
      console.log("Here");
      toast.warning("PROTCTED ROUTE: UPS!!! Izgleda da niste autorizovani da posetite ovu lokaciju!", { position: "top-center", autoClose: 3000 });

      navigate("/login", { replace: true });
    }
  }, [authUser, minRole, navigate]);

  if (authUser && authUser.roleId > minRole) {
    return <Outlet />;
  }

  return null;
};

export default ProtectRoute;
