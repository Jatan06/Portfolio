import { PROJECTS } from "../constants";
import Reveal from "../components/Reveal";
import ProjectCard from "../components/ProjectCard";

/**
 * Projects section — grid of hover-interactive project cards.
 *
 * @prop {boolean} isMobile - true when viewport < 768px
 */
export default function Projects({ isMobile }) {
  return (
    <section
      id="projects"
      style={{ padding: isMobile ? "80px 24px" : "100px 80px", position: "relative", zIndex: 2 }}
    >
      {/* Section header */}
      <div style={{ marginBottom: "56px" }}>
        <Reveal delay={0}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: "#39ff14", letterSpacing: "0.25em", marginBottom: "14px", textTransform: "uppercase" }}>
            02 / Projects
          </div>
        </Reveal>
        <Reveal delay={100}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: isMobile ? "32px" : "clamp(34px, 4vw, 52px)", fontWeight: 800, letterSpacing: "-0.03em" }}>
            What I've <span style={{ color: "#39ff14" }}>Built</span>
          </h2>
        </Reveal>
      </div>

      {/* Cards grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
        gap: "1px", background: "#0f0f0f",
      }}>
        {PROJECTS.map((p, i) => (
          <div key={i} style={{ background: "#050505" }}>
            <ProjectCard p={p} i={i} />
          </div>
        ))}
      </div>

      {/* GitHub link */}
      <div style={{ marginTop: "32px", textAlign: "center" }}>
        <a
          href="https://github.com/Jatan06"
          target="_blank"
          rel="noreferrer"
          style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", color: "#333", textDecoration: "none", letterSpacing: "0.1em", textTransform: "uppercase", transition: "color 0.2s" }}
          onMouseEnter={(e) => (e.target.style.color = "#39ff14")}
          onMouseLeave={(e) => (e.target.style.color = "#333")}
        >
          View all repos on GitHub ↗
        </a>
      </div>
    </section>
  );
}
