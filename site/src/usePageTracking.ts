import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    gtag: any;
  }
}

export default function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    window.gtag("event", "page_view", {
      page_location: location.pathname + location.search,
    });
  }, [location.pathname, location.search]);
}
