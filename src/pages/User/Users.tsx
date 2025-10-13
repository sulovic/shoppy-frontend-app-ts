import React from "react";
import Navbar from "../../components/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import AppCards from "../../components/AppCards";
import { UserLinks } from "../../config/Config";

const Users: React.FC = () => {
  const AppName = "Korisnici";
  const location = useLocation();

  return (
    <>
      <Navbar AppName={AppName} Links={UserLinks} />
      <div className="mx-2 md:mx-4">
        {location.pathname === "/users" && (
          <>
            <h3 className="my-4 text-center md:my-8">Aplikacija za administraciju korisnika</h3>
            <AppCards Links={UserLinks} />
          </>
        )}
        <Outlet />
      </div>
    </>
  );
};

export default Users;
