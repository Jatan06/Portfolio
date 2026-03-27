import { useRef, useState } from "react";
import useInView from "../hooks/useInView";

/**
 * Hover-interactive project card.
 * Fades in on scroll, highlights on hover, opens project link on click.
 *
 * @prop {{ title, desc, tags, year, link }} p - project data object
 * @prop {number} i - card index (used for stagger delay)
 */
export default function ProjectCard({ p, i }) {
  const ref = useRef(null);
  const inView = useInView(ref);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => window.open(p.link, "_blank")}
      style={{
        border: `1px solid ${hovered ? "#39ff14" : "#161616"}`,
        padding: "32px",
        position: "relative",
        cursor: "pointer",
        transition: "border-color 0.3s, transform 0.4s, box-shadow 0.3s, opacity 0.6s",
        transform: inView ? (hovered ? "translateY(-4px)" : "translateY(0)") : "translateY(28px)",
        opacity: inView ? 1 : 0,
        transitionDelay: `${i * 90}ms`,
        background: hovered ? "#0a0a0a" : "transparent",
        boxShadow: hovered ? "0 0 40px #39ff1410, inset 0 0 20px #39ff1406" : "none",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Year badge */}
      <div style={{ position: "absolute", top: "18px", right: "20px", fontFamily: "'Space Mono', monospace", fontSize: "10px", color: "#2a2a2a" }}>
        {p.year}
      </div>

      {/* Status dot */}
      <div style={{
        width: "7px", height: "7px", borderRadius: "50%",
        background: hovered ? "#39ff14" : "#222",
        boxShadow: hovered ? "0 0 14px #39ff14" : "none",
        marginBottom: "20px",
        transition: "background 0.3s, box-shadow 0.3s",
      }} />

      <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "10px", letterSpacing: "-0.02em" }}>
        {p.title}
      </h3>
      <p style={{ color: "#555", fontSize: "13.5px", lineHeight: 1.75, marginBottom: "22px" }}>
        {p.desc}
      </p>

      {/* Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "7px", marginTop: "auto" }}>
        {p.tags.map((t) => (
          <span key={t} style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "10px",
            color: hovered ? "#39ff14" : "#333",
            border: `1px solid ${hovered ? "#39ff1433" : "#1e1e1e"}`,
            padding: "3px 9px",
            transition: "color 0.3s, border-color 0.3s",
          }}>
            {t}
          </span>
        ))}
      </div>

      {/* Arrow */}
      <div style={{
        position: "absolute", bottom: "20px", right: "20px",
        color: hovered ? "#39ff14" : "#222",
        fontSize: "16px",
        transition: "color 0.3s, transform 0.3s",
        transform: hovered ? "translate(2px, -2px)" : "translate(0, 0)",
      }}>
        ↗
      </div>
    </div>
  );
}
