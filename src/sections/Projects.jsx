import { useState, useEffect, useRef } from "react";
import { PROJECTS } from "../constants";
import Reveal from "../components/Reveal";
import ProjectCard from "../components/ProjectCard";

/**
 * Projects section — interactive animated carousel replicating itsvg.in logic.
 * Active item is centered at scale(1), adjacent items peek at scale(0.85).
 * Supports Trackpad swipe, Touch drag, and Keyboard arrows natively.
 *
 * @prop {boolean} isMobile - true when viewport < 768px
 */
export default function Projects({ isMobile }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(400);

  // References for tracking swipe / trackpad movement
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const wheelTimeout = useRef(null);

  useEffect(() => {
    const handleResize = () => setCardWidth(isMobile ? window.innerWidth * 0.85 : 400);
    handleResize(); // Initial set
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

  const scroll = (direction) => {
    if (direction === "left") {
      setCurrentIndex((prev) => (prev > 0 ? prev - 1 : PROJECTS.length - 1));
    } else {
      setCurrentIndex((prev) => (prev < PROJECTS.length - 1 ? prev + 1 : 0));
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevents the window from scrolling natively if you press arrows
      if (e.key === "ArrowLeft") {
        scroll("left");
      } else if (e.key === "ArrowRight") {
        scroll("right");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Touch handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;
    if (touchStartX.current - touchEndX.current > 50) {
      scroll("right"); // Swiped left (next)
    } else if (touchEndX.current - touchStartX.current > 50) {
      scroll("left"); // Swiped right (prev)
    }
  };

  // Trackpad / Mouse wheel handler
  const handleWheel = (e) => {
    // Only react to horizontal scrolling and enforcing a cooldown so it doesn't spin wildly
    if (wheelTimeout.current) return;
    if (Math.abs(e.deltaX) > 40) {
      if (e.deltaX > 0) scroll("right");
      else scroll("left");
      
      wheelTimeout.current = setTimeout(() => {
        wheelTimeout.current = null;
      }, 500); // 500ms cooldown per swipe
    }
  };

  return (
    <section
      id="projects"
      style={{ padding: isMobile ? "80px 0" : "100px 0", position: "relative", zIndex: 2, overflowX: "hidden" }}
    >
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

      {/* Animated Scale Slider */}
      <Reveal delay={300}>
        <div 
          style={{ 
            position: "relative", display: "flex", justifyContent: "center", alignItems: "center", width: "100%", padding: "20px 0",
            touchAction: "pan-y" // Enables horizontal swiping without triggering the browser's back/forward gesture natively
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onWheel={handleWheel}
        >
          
          {/* Invisible dummy element to maintain container height perfectly relative to exactly the TALLEST card */}
          <div style={{ display: "grid", width: `${cardWidth}px`, visibility: "hidden", pointerEvents: "none" }}>
            {PROJECTS.map((p, i) => (
              <div key={i} style={{ gridArea: "1/1" }}>
                <ProjectCard p={p} i={0} />
              </div>
            ))}
          </div>

          {/* Render all cards with dynamic offset transforms */}
          {PROJECTS.map((p, index) => {
            // Calculate distance from center
            const offset = index - currentIndex;

            // Optional wrap-around visual logic could go here, but strict offset keeps it simple
            const gap = isMobile ? 16 : 40;
            const xPos = offset * (cardWidth + gap);
            
            // Animation scaling & opacity logic
            const scale = index === currentIndex ? 1 : 0.85;
            const opacity = Math.abs(offset) > 1 ? 0 : (index === currentIndex ? 1 : 0.4);
            const zIndex = 10 - Math.abs(offset);

            return (
              <div
                key={index}
                style={{
                  position: "absolute",
                  width: `${cardWidth}px`,
                  transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                  transform: `translateX(${xPos}px) scale(${scale})`,
                  opacity: opacity,
                  zIndex: zIndex,
                  pointerEvents: index === currentIndex ? "auto" : "none",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <ProjectCard p={p} i={index} />
              </div>
            );
          })}
        </div>
      </Reveal>

      {/* Footer Details */}
      <div style={{ marginTop: "40px", textAlign: "center" }}>
        <Reveal delay={400}>
          <a
            href="https://github.com/Jatan06"
            target="_blank"
            rel="noreferrer"
            style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", color: "#888", textDecoration: "none", letterSpacing: "0.1em", textTransform: "uppercase", transition: "color 0.2s" }}
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
