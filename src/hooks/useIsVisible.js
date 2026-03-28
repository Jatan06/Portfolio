import { useState, useEffect } from "react";

/**
 * Returns true if the given ref element is CURRENTLY in the viewport.
 * 
 * @param {React.RefObject} ref       - ref attached to the element to observe
 * @param {number}          threshold - fraction of element visible to trigger (0–1)
 */
export default function useIsVisible(ref, threshold = 0.01) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold }
    );

    const target = ref.current;
    if (target) observer.observe(target);
    
    return () => {
      if (target) observer.unobserve(target);
    };
  }, [ref, threshold]);

  return isVisible;
}
