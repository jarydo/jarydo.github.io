import { useState, useEffect } from "react";

/**
 * True on devices without a precise pointer, where double-click/hover are
 * unreliable. Resolved in an effect so the first paint matches on any device.
 */
export function useIsTouchDevice(): boolean {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  return isTouchDevice;
}
