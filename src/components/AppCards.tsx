import React from "react";

const AppCards: React.FC<any> = ({ Links = [] }) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {Links.map((l: any, idx: number) => (
        <div key={idx} className="rounded-md border bg-white p-4 shadow-sm">{l?.title || l?.name || `Link ${idx}`}</div>
      ))}
    </div>
  );
};

export default AppCards;
