import React from "react";
import Navbar from "../../components/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import AppCards from "../../components/AppCards";
import { ReklamacijeLinks } from "../../config/appConfig";

const Reklamacije: React.FC = () => {
  const AppName = "Reklamacije";

  const location = useLocation();
  return (
    <>
      <Navbar AppName={AppName} Links={ReklamacijeLinks} />
      <div className="mx-2 md:mx-4">
        {location.pathname === "/reklamacije" && (
          <>
            <h3 className="my-4 text-center md:my-8">Aplikacija za obradu reklamacija</h3>
            <AppCards Links={ReklamacijeLinks} />
          </>
        )}
        <Outlet />
      </div>
    </>
  );
};

export default Reklamacije;
