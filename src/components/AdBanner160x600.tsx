import { useEffect } from "react";

const AdBanner160x600 = () => {
  useEffect(() => {
    if (window.googletag && window.googletag.cmd) {
      window.googletag.cmd.push(() => {
        window.googletag.display('div-gpt-ad-1743742739389-0');
      });
    }
  }, []);

  return (
    <div className="my-4">
      <div 
        id="div-gpt-ad-1743742739389-0" 
        style={{ minWidth: 160, minHeight: 600 }}
      />
      <p className="text-xs mt-1 text-center">
        <a 
          href="https://www.muslimadnetwork.com/?pub=quranify" 
          title="Advertise and Market to Muslims" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          Ads by Muslim Ad Network
        </a>
      </p>
    </div>
  );
};

export default AdBanner160x600;