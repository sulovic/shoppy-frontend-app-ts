import React from "react";
import { useAuth } from "../../Context/AuthContext";
import "./ToggleSwitch.css";
import type { AuthUser } from "../../types/global";

const SuperAdmin: React.FC = () => {
  const { authUser, setAuthUser } = useAuth();

  const handleToggle = () => {
    setAuthUser((prev: AuthUser) => ({ ...prev, superAdmin: !prev?.superAdmin }));
  };

  const superAdmin = authUser?.superAdmin ?? false;

  return (
    authUser?.role_id > 5000 && (
      <>
        <h3 className="my-4">Super Admin Privilegije</h3>
        <div className="my-3 mt-16 flex h-full w-full items-center justify-center gap-2">
          <div className="w-full rounded-xl border-2 border-solid border-zinc-100 bg-gray-100 p-4  shadow-sm md:w-3/4 xl:w-1/2 dark:bg-gray-800">
            <h3 className="mb-4 ">Aktiviranje - Deaktiviranje Super Admin Privilegija</h3>
            <div className="my-4 h-0.5 w-full bg-zinc-400"></div>

            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <div className="mt-5 flex justify-center">
                  <label className="switch">
                    <input checked={superAdmin} onChange={handleToggle} className="switch-input" type="checkbox" />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>
              <div className="md:col-span-3">
                <p>Aktiviranjem Super User Privilegija dobijate mogućnost trajnog brisanja bitnih podataka.</p>
                <p>Molim Vas da pažljivo koristite ove privilegije!</p>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  );
};

export default SuperAdmin;
