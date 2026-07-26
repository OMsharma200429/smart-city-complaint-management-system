import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false);

  React.useEffect(() => {
    // ✅ SSR Safety check
    if (typeof window === "undefined") return;

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    const onChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    // ✅ Initial value
    setIsMobile(mql.matches);

    // ✅ Listener
    if (mql.addEventListener) {
      mql.addEventListener("change", onChange);
    } else {
      // 🔙 fallback (older browsers)
      mql.addListener(onChange);
    }

    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", onChange);
      } else {
        mql.removeListener(onChange);
      }
    };
  }, []);

  return isMobile;
}