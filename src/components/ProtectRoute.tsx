import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";

const ProtectRoute = ({ minRole = 5000 }: { minRole: number }) => {
  const { authUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authUser || authUser.role_id <= minRole) {
      toast.warning("UPS!!! Izgleda da niste autorizovani da posetite ovu lokaciju!", { position: "top-center", autoClose: 3000 });

      const timer = setTimeout(() => {
        navigate("/", { replace: true });
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [authUser, minRole, navigate]);

  if (authUser && authUser.role_id > minRole) {
    return <Outlet />;
  }

  return null;
};

export default ProtectRoute;
