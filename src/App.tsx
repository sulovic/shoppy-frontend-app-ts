import SiteRoutes from "./components/SiteRoutes";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { registerLocale } from "react-datepicker";
import { srLatn } from "date-fns/locale/sr-Latn";
registerLocale("sr-Latn", srLatn);

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("lastRoute", location.pathname);
  }, [location]);

  useEffect(() => {
    const storedPath = localStorage.getItem("lastRoute");
    if (storedPath && storedPath !== location.pathname) {
      navigate(storedPath, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container-2xl min-h-screen mx-auto flex flex-col">
      <ToastContainer />
      <SiteRoutes />
    </div>
  );
};

export default App;
