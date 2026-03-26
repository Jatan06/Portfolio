import { useState, useEffect } from "react";
import { ROLES, PARIKH_LANGS } from "../constants";
import CyclingText from "../components/CyclingText";

/**
 * Hero section — full-viewport landing area.
 * Contains: animated name, typewriter role text, CTA buttons, profile photo, orbital graphic.
 *
 * @prop {boolean} isMobile   - true when viewport < 768px
 * @prop {boolean} showVault  - true on first visit (used to delay scroll-down indicator)
 */
export default function Hero({ isMobile }) {
  const [typed, setTyped] = useState("");
  const [roleIdx, setRoleIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  // ── Typewriter effect ────────────────────────────────────────────────────────
  useEffect(() => {
    const current = ROLES[roleIdx];
    const speed = deleting ? 35 : 65;
    const timeout = setTimeout(() => {
      if (!deleting && charIdx < current.length) {
        setTyped(current.slice(0, charIdx + 1));
        setCharIdx((c) => c + 1);
      } else if (!deleting && charIdx === current.length) {
        setTimeout(() => setDeleting(true), 1400);
      } else if (deleting && charIdx > 0) {
        setTyped(current.slice(0, charIdx - 1));
        setCharIdx((c) => c - 1);
      } else {
        setDeleting(false);
        setRoleIdx((r) => (r + 1) % ROLES.length);
      }
    }, speed);
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, roleIdx]);

  const scrollTo = (id) => {
    const el = document.getElementById(id.toLowerCase());
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      style={{
        minHeight: "100vh", display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: isMobile ? "flex-start" : "center",
        justifyContent: isMobile ? "center" : "flex-start",
        padding: isMobile ? "120px 24px" : "0 80px",
        position: "relative", zIndex: 2,
      }}
    >
      {/* Corner accents (desktop only) */}
      {!isMobile && (
        <>
          <div style={{ position: "absolute", top: "90px", left: "48px", width: "18px", height: "18px", borderTop: "1px solid #39ff1444", borderLeft: "1px solid #39ff1444" }} />
          <div style={{ position: "absolute", top: "90px", right: "48px", width: "18px", height: "18px", borderTop: "1px solid #39ff1444", borderRight: "1px solid #39ff1444" }} />
          <div style={{ position: "absolute", bottom: "48px", left: "48px", width: "18px", height: "18px", borderBottom: "1px solid #39ff1444", borderLeft: "1px solid #39ff1444" }} />
          <div style={{ position: "absolute", bottom: "48px", right: "48px", width: "18px", height: "18px", borderBottom: "1px solid #39ff1444", borderRight: "1px solid #39ff1444" }} />
        </>
      )}

      {/* Left: text content */}
      <div style={{ maxWidth: "860px", zIndex: 3 }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: isMobile ? "10px" : "11px", color: "#39ff14", letterSpacing: "0.25em", marginBottom: "20px", textTransform: "uppercase", animation: "fadeUp 0.5s ease both" }}>
          <span style={{ animation: "pulse-dot 1.2s infinite", display: "inline-block" }}>▶</span>&nbsp; Open to Opportunities
        </div>

        <h1 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: isMobile ? "clamp(48px, 12vw, 68px)" : "clamp(54px, 8.5vw, 104px)",
          fontWeight: 800, lineHeight: 0.95,
          letterSpacing: "-0.04em", marginBottom: "16px",
          animation: "fadeUp 0.6s ease both 0.1s",
        }}>
          Jatan<br />
          <CyclingText words={PARIKH_LANGS} style={{ color: "#39ff14", textShadow: "0 0 50px #39ff1455" }} />
        </h1>

        {/* Typewriter role */}
        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: isMobile ? "13px" : "clamp(13px, 1.6vw, 18px)",
          color: "#383838", marginBottom: "36px", minHeight: "28px",
          animation: "fadeUp 0.7s ease both 0.2s",
        }}>
          {typed}<span style={{ color: "#39ff14", animation: "pulse-dot 0.9s infinite", display: "inline-block" }}>_</span>
        </div>

        <p style={{
          fontSize: isMobile ? "14px" : "15px", color: "#4a4a4a", lineHeight: 1.85,
          maxWidth: isMobile ? "100%" : "460px", marginBottom: "36px",
          animation: "fadeUp 0.8s ease both 0.3s",
        }}>
          Computer Science Engineering student with strong skills in Java, Python, and full-stack web development. Experienced in building real-world applications using OOP, SQL, and Flask. Seeking internship opportunities to apply technical and problem-solving skills.
        </p>

        {/* CTA row */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", animation: "fadeUp 0.9s ease both 0.4s", alignItems: "flex-start" }}>
          <button
            onClick={() => scrollTo("Projects")}
            style={{
              background: "#39ff14", color: "#000", border: "1px solid #39ff14",
              height: "48px", minWidth: isMobile ? "100%" : "160px", padding: "0 32px",
              fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.12em", fontWeight: 700,
              cursor: "pointer", textTransform: "uppercase",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "box-shadow 0.25s, transform 0.25s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 28px #39ff1477"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            View Projects
          </button>

          <a href="https://linkedin.com/in/jatanparikh" target="_blank" rel="noreferrer" style={{ textDecoration: "none", height: "48px", width: isMobile ? "100%" : "auto" }}>
            <button
              style={{
                background: "transparent", color: "#fff", border: "1px solid #1e1e1e",
                height: "100%", minWidth: isMobile ? "100%" : "160px", padding: "0 32px",
                fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.12em",
                cursor: "pointer", textTransform: "uppercase",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "border-color 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#39ff14"; e.currentTarget.style.color = "#39ff14"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1e1e1e"; e.currentTarget.style.color = "#fff"; }}
            >
              LinkedIn ↗
            </button>
          </a>
        </div>
      </div>

      {/* Right: profile photo + orbital graphic */}
      <div style={{
        position: isMobile ? "relative" : "absolute",
        right: isMobile ? "auto" : "7%",
        top: isMobile ? "auto" : "50%",
        transform: isMobile ? "translateY(0)" : "translateY(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: "28px",
        marginTop: isMobile ? "64px" : "0",
        pointerEvents: "none",
        width: isMobile ? "100%" : "auto",
      }}>
        {/* Profile Photo */}
        <div style={{ position: "relative", width: "130px", height: "130px", animation: "float 7s ease-in-out infinite" }}>
          <div style={{ position: "absolute", inset: "-10px", borderRadius: "50%", border: "1px dashed #39ff1444", animation: "spin-slow 10s linear infinite" }} />
          <div style={{ position: "absolute", inset: "-5px", borderRadius: "50%", border: "1px solid #39ff1430", boxShadow: "0 0 16px #39ff1422" }} />
          <div style={{
            width: "130px", height: "130px", borderRadius: "50%", overflow: "hidden",
            border: "2px solid #39ff1466",
            animation: "photo-glow 3.5s ease-in-out infinite",
            background: "#0a0a0a", position: "relative", zIndex: 1,
          }}>
            <img
              src="/profile.jpg"
              alt="Jatan Parikh"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "brightness(0.92) contrast(1.05)" }}
              onError={(e) => {
                e.target.style.display = "none";
                e.target.parentNode.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-size:40px;font-weight:800;color:#39ff14;letter-spacing:-0.04em;background:linear-gradient(135deg,#0a0a0a,#111)">JP</div>`;
              }}
            />
          </div>
          <div style={{ position: "absolute", top: "-2px", left: "50%", transform: "translateX(-50%)", width: "5px", height: "5px", borderRadius: "50%", background: "#39ff14", boxShadow: "0 0 8px #39ff14" }} />
          <div style={{ position: "absolute", bottom: "-2px", left: "50%", transform: "translateX(-50%)", width: "4px", height: "4px", borderRadius: "50%", background: "#39ff1488" }} />
        </div>

        {/* Orbital graphic */}
        <div style={{ width: isMobile ? "200px" : "260px", height: isMobile ? "200px" : "260px", animation: "float 7s ease-in-out infinite", animationDelay: "0.5s", position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, border: "1px solid #39ff1418", borderRadius: "50%", animation: "spin-slow 18s linear infinite" }}>
            <div style={{ position: "absolute", top: "-4px", left: "50%", transform: "translateX(-50%)", width: "7px", height: "7px", borderRadius: "50%", background: "#39ff14", boxShadow: "0 0 10px #39ff14" }} />
          </div>
          <div style={{ position: "absolute", inset: "38px", border: "1px solid #39ff1428", borderRadius: "50%", animation: "spin-slow-rev 12s linear infinite" }}>
            <div style={{ position: "absolute", bottom: "-4px", left: "50%", transform: "translateX(-50%)", width: "5px", height: "5px", borderRadius: "50%", background: "#39ff1488" }} />
          </div>
          <div style={{ position: "absolute", inset: "76px", border: "1px solid #39ff1415", borderRadius: "50%", animation: "spin-slow 8s linear infinite" }} />
          <div style={{ position: "absolute", inset: "50%", transform: "translate(-50%,-50%)", width: "12px", height: "12px", borderRadius: "50%", background: "#39ff14", boxShadow: "0 0 24px #39ff14, 0 0 48px #39ff1866" }} />
          <div style={{ position: "absolute", inset: "-20px", background: "radial-gradient(circle, #39ff140d 0%, transparent 70%)", borderRadius: "50%" }} />
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ position: "absolute", bottom: "36px", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", opacity: 0.3 }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "0.2em", color: "#555", textTransform: "uppercase" }}>Scroll</span>
        <div style={{ width: "1px", height: "36px", background: "linear-gradient(180deg,#39ff14,transparent)" }} />
      </div>
    </section>
  );
}
