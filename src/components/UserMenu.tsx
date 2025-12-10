import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Modal from "./Modal";

const UserMenu = ({ Links = [] }: { Links: AppLink[] }) => {
  const { authUser, handleLogoutOK } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [menuHidden, setMenuHidden] = useState(true);
  const navigate = useNavigate();
  const currentLocation = useLocation();
  const menuRef = useRef<HTMLDivElement | null>(null);

  const toggleMenuHidden = () => {
    setMenuHidden(!menuHidden);
  };

  const handleClickOutside = (e: MouseEvent) => {
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

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirmed = () => {
    setMenuHidden(true);
    handleLogoutOK();
    setShowLogoutModal(false);
    navigate("/");
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <div className="relative m-1" ref={menuRef}>
        <button className="button flex bg-gray-600 py-1!" type="button" id="dropdownUser" data-dropdown-toggle="dropdown" aria-expanded="false" onClick={toggleMenuHidden}>
          <span className="text-lg">{authUser ? "MENU" : "LOGIN"}</span>
          <span className="m-auto ps-2">
            {authUser ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ borderRadius: "50%" }}>
                <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
              </svg>
            )}
          </span>
        </button>
        <div className={`${menuHidden ? "hidden" : "absolute right-0"} z-10 my-2 w-auto min-w-56 divide-y divide-gray-100 rounded-lg border border-solid border-gray-600 bg-white shadow dark:bg-gray-600`}>
          {authUser ? (
            <ul className="mb-0 flex w-full flex-col justify-end px-0 py-2 text-end text-base font-medium text-gray-600 dark:text-gray-200 " aria-labelledby="dropdownMenu">
              <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{authUser.firstName + " " + authUser.lastName}</li>
              <div className="my-1 h-0.5 w-full bg-zinc-200"></div>

              {Links.map(
                (link, index) =>
                  authUser.roleId > link.minRole && (
                    <li
                      className={`block px-4 py-2 font-medium no-underline ${
                        currentLocation.pathname === link.href ? `text-gray-500` : `text-gray-600`
                      }  text-gray-600 hover:bg-gray-100 lg:hidden dark:text-gray-100 dark:hover:bg-gray-600 dark:hover:text-white`}
                      key={index}
                      onClick={toggleMenuHidden}
                    >
                      <Link to={link.href}>{link.label}</Link>
                    </li>
                  )
              )}
              <div className="my-1 h-0.5 w-full bg-zinc-200"></div>

              <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                <button className="float-end" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </ul>
          ) : (
            <li className="list-none">
              <div className="float-end p-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                <Link to="/login">Login</Link>
              </div>
            </li>
          )}
        </div>
      </div>

      {showLogoutModal && <Modal onOK={handleLogoutConfirmed} onCancel={handleLogoutCancel} title="Odjava iz aplikacije" question="Da li ste sigurni da želite da se odjavite sa aplikacije?" />}
    </>
  );
};

export default UserMenu;
