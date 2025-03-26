// import React, { useEffect } from "react";

// interface GoogleAdProps {
//   adSlot: string;
//   className?: string;
//   style?: React.CSSProperties;
// }

// const GoogleAd: React.FC<GoogleAdProps> = ({ adSlot, className, style }) => {
//   useEffect(() => {
//     // Initialize adsbygoogle
//     if ((window as any).adsbygoogle) {
//       (window as any).adsbygoogle.push({});
//     }
//   }, []);

//   return (
//     <ins
//       className={`adsbygoogle ${className || ""}`}
//       style={{
//         display: "block",
//         ...style,
//       }}
//       data-ad-client="ca-pub-7291561218913011"
//       data-ad-slot={adSlot}
//       data-ad-format="auto"
//     ></ins>
    
//   );
// };

// export default GoogleAd;

import React, { useEffect } from "react";

interface GoogleAdProps {
  adClient: string;
  adSlot: string;
  style?: React.CSSProperties;
  format?: string;
  responsive?: boolean;
}

const GoogleAd: React.FC<GoogleAdProps> = ({
  adClient,
  adSlot,
  style = { display: "block" },
  format = "auto",
  responsive = true,
}) => {
  useEffect(() => {
    if (window) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense error:", e);
      }
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={style}
      data-ad-client={adClient}
      data-ad-slot={adSlot}
      data-ad-format={format}
      data-full-width-responsive={responsive ? "true" : "false"}
    ></ins>
  );
};

export default GoogleAd;

