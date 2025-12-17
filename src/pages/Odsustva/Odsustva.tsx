import React from "react";
import Navbar from "../../components/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import AppCards from "../../components/AppCards";
import { OdsustvaLinks } from "../../config/appConfig";

const Odsustva: React.FC = () => {
  const AppName = "Odsustva";

  const location = useLocation();

  return (
    <>
      <Navbar AppName={AppName} Links={OdsustvaLinks} />
      <div className="mx-2 md:mx-4">
        {location.pathname === "/odsustva" && (
          <>
            <h3 className="my-4 text-center md:my-8">Aplikacija za administraciju dodeljenih odsustva</h3>
            <AppCards Links={OdsustvaLinks} />
          </>
        )}
        <Outlet />
      </div>
    </>
  );
};

export default Odsustva;
