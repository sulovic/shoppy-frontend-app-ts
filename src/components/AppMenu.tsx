import React from "react";

const AppMenu: React.FC<{ AppName?: string; Links?: any[] }> = ({ AppName = "App", Links = [] }) => {
  return (
    <div className="flex items-center">
      <img src="/logo192.png" className="mr-2 h-8 w-8" alt={AppName} />
      <span className="font-bold">{AppName}</span>
    </div>
  );
};

export default AppMenu;
