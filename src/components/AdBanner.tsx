import { useEffect } from "react";

const AdBanner = () => {
  useEffect(() => {
    if (window.googletag && window.googletag.cmd) {
      window.googletag.cmd.push(() => {
        window.googletag.display('div-gpt-ad-1743742432299-0');
      });
    }
  }, []);

  return (
    <div>
      <div 
        id="div-gpt-ad-1743742432299-0" 
        style={{ minWidth: 300, minHeight: 250 }}
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

export default AdBanner;