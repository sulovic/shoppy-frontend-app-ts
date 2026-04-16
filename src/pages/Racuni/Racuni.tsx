import Navbar from "../../components/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import AppCards from "../../components/AppCards";
import { RacuniLinks } from "../../config/appConfig.js";

const Nabavke = () => {
  const AppName = "Računi";

  const location = useLocation();

  return (
    <>
      <Navbar AppName={AppName} Links={RacuniLinks} />
      <div className="mx-2 md:mx-4">
        {location.pathname === "/racuni" && (
          <>
            <h3 className="my-4 text-center md:my-8">Aplikacija za rad sa Fiskalnim Računima</h3>
            <AppCards Links={RacuniLinks} />
          </>
        )}
        <Outlet />
      </div>
    </>
  );
};

export default Nabavke;
