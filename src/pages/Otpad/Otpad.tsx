import React from "react";
import Navbar from "../../components/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import AppCards from "../../components/AppCards";
import { OtpadLinks } from "../../config/appConfig";

const Otpad: React.FC = () => {
  const AppName = "Otpad";
  const location = useLocation();

  return (
    <>
      <Navbar AppName={AppName} Links={OtpadLinks} />
      <div className="mx-2 md:mx-4">
        {location?.pathname === "/otpad" && (
          <>
            <h3 className="my-4 text-center md:my-8">Aplikacija za evidenciju tokova otpada</h3>
            <AppCards Links={OtpadLinks} />
          </>
        )}
        <Outlet />
      </div>
    </>
  );
};

export default Otpad;
