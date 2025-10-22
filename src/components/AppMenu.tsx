import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const AppMenu = ({ AppName = "Unauthorized", Links = [] }: { AppName: string; Links: AppLink[] }) => {
  const { authUser } = useAuth();
  const [menuHidden, setMenuHidden] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenuHidden = () => {
    setMenuHidden(!menuHidden);
  };

  const handleClickOutside = (e: MouseEvent | TouchEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setMenuHidden(true);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="relative m-1" ref={menuRef}>
        <button className="button  flex bg-gray-600 !py-1" type="button" id="dropdownUser" data-dropdown-toggle="dropdown" aria-expanded="false" onClick={toggleMenuHidden}>
          <span className="m-auto pe-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
              <path d="M14.222 9.374c1.037-.61 1.037-2.137 0-2.748L11.528 5.04 8.32 8l3.207 2.96zm-3.595 2.116L7.583 8.68 1.03 14.73c.201 1.029 1.36 1.61 2.303 1.055zM1 13.396V2.603L6.846 8zM1.03 1.27l6.553 6.05 3.044-2.81L3.333.215C2.39-.341 1.231.24 1.03 1.27" />
            </svg>
          </span>
          <span className="text-lg">{AppName}</span>
        </button>
        {authUser && (
          <div className={`${menuHidden ? "hidden" : "absolute left-0"} z-10 my-2 w-auto min-w-56 divide-y divide-gray-100 rounded-lg border border-solid border-gray-600 bg-white shadow dark:bg-gray-600`}>
            <ul className=" mb-0 px-0 py-2 text-base dark:text-gray-200" aria-labelledby="dropdownApps">
              {Links.map(
                (link, index) =>
                  authUser?.role_id > link?.minRole && (
                    <li key={index} className="block px-4 py-2 font-medium text-gray-600  no-underline hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                      <Link to={link?.href} onClick={toggleMenuHidden}>
                        {link?.label}
                      </Link>
                    </li>
                  )
              )}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default AppMenu;
