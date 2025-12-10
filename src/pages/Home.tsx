import React from "react";
import Navbar from "../components/Navbar";
import businessapps from "../assets/BusinessApss.jpg";
import { useAuth } from "../hooks/useAuth";
import AppCards from "../components/AppCards";
import { AppLinks } from "../config/Config";

const Home: React.FC = () => {
  const { authUser } = useAuth();
  const AppName = "APPS";
  console.log(authUser, AppLinks);

  return (
    <>
      <Navbar AppName={AppName} Links={AppLinks} />
      <div className="px-4 text-center">
        <h3>Shoppy Business Apps</h3>
        <h3>Dobro došli</h3>
        {!authUser && <h3>Prijavite se kako biste započeli</h3>}
      </div>

      {authUser ? (
        <div className="mx-2 md:mx-4">
          <AppCards Links={AppLinks} />
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center bg-contain bg-center bg-no-repeat md:my-4" style={{ backgroundImage: `url(${businessapps})` }}></div>
      )}
    </>
  );
};

export default Home;
