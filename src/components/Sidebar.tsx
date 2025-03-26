import React from "react";
import GoogleAd from "./GoogleAd";

const Sidebar = () => {
  return (
    <aside className="w-1/4 p-4 bg-gray-200">
      <h2 className="text-lg font-bold mb-4">Sponsored</h2>
      <GoogleAd
        adClient="ca-pub-7291561218913011"
        adSlot="6199538265"
        style={{ display: "block", width: "100%" }}
      />
    </aside>
  );
};

export default Sidebar;
