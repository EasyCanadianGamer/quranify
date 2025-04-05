import { useEffect } from "react";

const AdBanner728x90 = () => {
  useEffect(() => {
    if (window.googletag && window.googletag.cmd) {
      window.googletag.cmd.push(() => {
        window.googletag.display('div-gpt-ad-1743743310716-0');
      });
    }
  }, []);

  return (
    <div className="my-4">
      <div 
        id="div-gpt-ad-1743743310716-0" 
        style={{ minWidth: 728, minHeight: 90 }}
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

export default AdBanner728x90;