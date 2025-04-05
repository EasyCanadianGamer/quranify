import GoogleAd from "./GoogleAd";

const Sidebar = () => {
  return (
    <>
      {/* Google Ads */}
      <div className="sticky top-4">
        <GoogleAd
          adClient="ca-pub-7291561218913011"
          adSlot="6199538265"
          style={{ display: "block", width: "100%" }}
        />
      </div>
      <div className="mt-4">
        <GoogleAd
          adClient="ca-pub-7291561218913011"
          adSlot="1234567890"
          style={{ display: "block", width: "100%" }}
        />
      </div>
    </>
  );
};

export default Sidebar;
