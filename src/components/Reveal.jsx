import { useRef } from "react";
import useInView from "../hooks/useInView";

/**
 * Wraps children in a div that fades + slides in when scrolled into view.
 *
 * @prop {React.ReactNode} children   - content to animate
 * @prop {number}          delay      - transition delay in milliseconds
 * @prop {"up"|"down"|"left"|"right"|"scale"} direction - enter direction
 * @prop {object}          style      - additional wrapper styles
 */
export default function Reveal({ children, delay = 0, direction = "up", style = {} }) {
  const ref = useRef(null);
  const inView = useInView(ref, 0.12);

  const transforms = {
    up:    inView ? "translateY(0)"  : "translateY(40px)",
    down:  inView ? "translateY(0)"  : "translateY(-40px)",
    left:  inView ? "translateX(0)"  : "translateX(-40px)",
    right: inView ? "translateX(0)"  : "translateX(40px)",
    scale: inView ? "scale(1)"       : "scale(0.92)",
  };

  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: transforms[direction],
        transition: `opacity 0.85s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.85s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
