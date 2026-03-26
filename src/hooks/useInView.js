import { useState, useEffect } from "react";

/**
 * Returns true once the given ref element enters the viewport.
 * Once visible, it stays true (one-shot trigger for entrance animations).
 *
 * @param {React.RefObject} ref       - ref attached to the element to observe
 * @param {number}          threshold - fraction of element visible to trigger (0–1)
 */
export default function useInView(ref, threshold = 0.15) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return inView;
}
