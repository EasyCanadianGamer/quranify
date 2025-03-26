import React, { useEffect } from "react";

interface GoogleAdProps {
  adSlot: string;
  className?: string;
  style?: React.CSSProperties;
}

const GoogleAd: React.FC<GoogleAdProps> = ({ adSlot, className, style }) => {
  useEffect(() => {
    // Initialize adsbygoogle
    if ((window as any).adsbygoogle) {
      (window as any).adsbygoogle.push({});
    }
  }, []);

  return (
    <ins
      className={`adsbygoogle ${className || ""}`}
      style={{
        display: "block",
        ...style,
      }}
      data-ad-client="ca-pub-7291561218913011"
      data-ad-slot={adSlot}
      data-ad-format="auto"
    ></ins>
  );
};

export default GoogleAd;
