import React from "react";
import Navbar from "../../components/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import AppCards from "../../components/AppCards";
import { NabavkeLinks } from "../../config/appConfig.js";

const Nabavke = () => {
  const AppName = "Nabavke";

  const location = useLocation();

  return (
    <>
      <Navbar AppName={AppName} Links={NabavkeLinks} />
      <div className="mx-2 md:mx-4">
        {location.pathname === "/nabavke" && (
          <>
            <h3 className="my-4 text-center md:my-8">Aplikacija za administraciju nabavki</h3>
            <AppCards Links={NabavkeLinks} />
          </>
        )}
        <Outlet />
      </div>
    </>
  );
};

export default Nabavke;
