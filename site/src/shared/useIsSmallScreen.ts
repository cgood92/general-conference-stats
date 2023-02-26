import { useProvider } from "@adobe/react-spectrum";
import { useEffect, useState } from "react";

export default function useIsSmallScreen() {
  const provider = useProvider();
  const [isSmall, setIsSmall] = useState(
    () => window.innerWidth <= provider.breakpoints.S!
  );

  useEffect(() => {
    function updateDimensions() {
      setIsSmall(window.innerWidth <= provider.breakpoints.S!);
    }

    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, [provider.breakpoints.S]);

  return isSmall;
}
