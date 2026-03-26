import { useRef } from "react";
import useInView from "../hooks/useInView";

/**
 * Animated horizontal progress bar for a single skill.
 * Fills from 0 → level% when scrolled into view.
 *
 * @prop {string} name  - skill label
 * @prop {number} level - proficiency percentage (0–100)
 * @prop {number} delay - animation delay in milliseconds
 */
export default function SkillBar({ name, level, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref);

  return (
    <div ref={ref} style={{ marginBottom: "20px" }}>
      {/* Label row */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "12px", color: "#a0a0a0", letterSpacing: "0.04em" }}>
          {name}
        </span>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", color: "#39ff14" }}>
          {level}%
        </span>
      </div>

      {/* Bar track */}
      <div style={{ background: "#111", height: "2px", borderRadius: "2px", overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            background: "linear-gradient(90deg, #39ff14, #00cc44)",
            borderRadius: "2px",
            width: inView ? `${level}%` : "0%",
            transition: `width 1.3s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
            boxShadow: "0 0 8px #39ff14aa",
          }}
        />
      </div>
    </div>
  );
}
