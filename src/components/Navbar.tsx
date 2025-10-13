import React, { useRef, useEffect } from "react";
import AppMenu from "./AppMenu";
import UserMenu from "./UserMenu";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { AppLinks } from "../config/Config";


const Navbar: React.FC<{ AppName?: string; Links?: any[] }> = ({ AppName = "Unauthorized", Links = [] }) => {
  const { authUser } = useAuth();
  const currentLocation = useLocation();
  const navbarRef = useRef<HTMLDivElement | null>(null);

  
  //Focus on navbar on new location

  useEffect(() => {
    if (navbarRef.current) {
      navbarRef.current.focus();
    }
  }, [currentLocation]);



  return (
    <nav
      tabIndex={-1}
      ref={navbarRef}
      className={`mb-3 flex flex-wrap items-center justify-between ${authUser?.superAdmin ? `bg-red-500` : `bg-sky-400`} p-2`}>
      <div className="mr-6 flex flex-shrink-0 items-center text-white">
        <AppMenu AppName={AppName} Links={AppLinks} />
      </div>
      <div className="hidden lg:flex lg:w-auto lg:flex-grow lg:items-center">
        {authUser && (
          <ul className="mb-0">
            {Links.map(
              (link, index) =>
                authUser?.role_id > link?.minRole && (
                  <li className="mt-3 text-end	text-lg font-medium lg:!mt-0 lg:inline-block" key={index}>
                    <Link
                      className={`mr-4 no-underline ${currentLocation.pathname === link?.href ? `text-sky-200` : `text-sky-100`} hover:text-white`}
                      to={link?.href}>
                      {link?.label}
                    </Link>
                  </li>
                ),
            )}
          </ul>
        )}
      </div>
      <div className="flex justify-end pe-1">
        <UserMenu Links={Links} />
      </div>
    </nav>
  );
};

export default Navbar;
