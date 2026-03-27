import { useRef } from "react";
import { PROJECTS } from "../constants";
import Reveal from "../components/Reveal";
import ProjectCard from "../components/ProjectCard";

/**
 * Projects section — horizontal carousel of hover-interactive project cards.
 *
 * @prop {boolean} isMobile - true when viewport < 768px
 */
export default function Projects({ isMobile }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = window.innerWidth * (isMobile ? 0.85 : 0.45);
      scrollRef.current.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section
      id="projects"
      style={{ padding: isMobile ? "80px 0" : "100px 0", position: "relative", zIndex: 2 }}
    >
      <style>
        {`
          .projects-carousel::-webkit-scrollbar {
            display: none;
          }
          .projects-carousel {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
        `}
      </style>

      {/* Section header */}
      <div style={{ marginBottom: "40px", padding: isMobile ? "0 24px" : "0 80px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <Reveal delay={0}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", color: "#39ff14", letterSpacing: "0.25em", marginBottom: "14px", textTransform: "uppercase" }}>
              02 / Projects
            </div>
          </Reveal>
          <Reveal delay={100}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: isMobile ? "32px" : "clamp(34px, 4vw, 52px)", fontWeight: 800, letterSpacing: "-0.03em", margin: 0 }}>
              What I've <span style={{ color: "#39ff14" }}>Built</span>
            </h2>
          </Reveal>
        </div>

        {/* Navigation Buttons */}
        <Reveal delay={200}>
          <div style={{ display: "flex", gap: "12px", paddingBottom: "8px" }}>
            <button
              onClick={() => scroll("left")}
              style={{
                background: "transparent",
                border: "1px solid #161616",
                color: "#fff",
                width: isMobile ? "40px" : "48px",
                height: isMobile ? "40px" : "48px",
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                transition: "border-color 0.3s, color 0.3s, box-shadow 0.3s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#39ff14"; e.currentTarget.style.color = "#39ff14"; e.currentTarget.style.boxShadow = "0 0 15px #39ff1415"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#161616"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.boxShadow = "none"; }}
            >
              ←
            </button>
            <button
              onClick={() => scroll("right")}
              style={{
                background: "transparent",
                border: "1px solid #161616",
                color: "#fff",
                width: isMobile ? "40px" : "48px",
                height: isMobile ? "40px" : "48px",
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                transition: "border-color 0.3s, color 0.3s, box-shadow 0.3s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#39ff14"; e.currentTarget.style.color = "#39ff14"; e.currentTarget.style.boxShadow = "0 0 15px #39ff1415"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#161616"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.boxShadow = "none"; }}
            >
              →
            </button>
          </div>
        </Reveal>
      </div>

      {/* Cards Carousel */}
      <Reveal delay={300}>
        <div 
          ref={scrollRef}
          className="projects-carousel"
          style={{
            display: "flex",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            scrollBehavior: "smooth",
            gap: "24px",
            padding: isMobile ? "0 24px" : "0 80px",
            paddingBottom: "24px",
          }}
        >
          {PROJECTS.map((p, i) => (
            <div 
              key={i} 
              style={{ 
                scrollSnapAlign: isMobile ? "center" : "start",
                flexShrink: 0,
                width: isMobile ? "85vw" : "40vw",
                background: "#050505",
                display: "flex",
                borderRadius: "4px",
              }}
            >
              <div style={{ width: "100%" }}>
                <ProjectCard p={p} i={i} />
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* GitHub link */}
      <div style={{ marginTop: "32px", textAlign: "center" }}>
        <Reveal delay={400}>
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
        </Reveal>
      </div>
    </section>
  );
}
