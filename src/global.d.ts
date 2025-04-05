interface Window {
  dataLayer: any[];
  gtag: (...args: any[]) => void;
  googletag: {
    cmd: any[];
    pubads: () => any;
    defineSlot: (adUnitPath: string, size: [number, number], divId: string) => any;
    enableServices: () => void;
    display: (divId: string) => void;
  };
}