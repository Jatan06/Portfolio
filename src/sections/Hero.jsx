import { useState, useEffect } from "react";
import { ROLES, PARIKH_LANGS } from "../constants";
import CyclingText from "../components/CyclingText";
import SolarSystem3D from "../components/SolarSystem3D";
import RocketButton from "../components/RocketButton";
import { useWarp } from "../hooks/useWarp";
import { useGyroscope } from "../hooks/useGyroscope";
import { motion as Motion } from "framer-motion";

const FloatWrap = ({ children, customY, duration, delay, isMobile }) => {
  const floatingY = isMobile ? customY * 0.5 : customY;
  return (
    <Motion.div
      animate={{ y: [0, floatingY, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
      whileHover={{ y: -16, transition: { type: "spring", stiffness: 200, damping: 10 } }}
    >
      {children}
    </Motion.div>
  );
};

const FloatingParticles = () => {
  const [particles] = useState(() => 
    Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, 
      top: Math.random() * 100,  
      opacity: Math.random() * 0.1 + 0.05, 
      duration: Math.random() * 4 + 6, 
      delay: Math.random() * -10, 
      yOffset: -(Math.random() * 200 + 200) 
    }))
  );

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
      {particles.map(p => (
        <Motion.div
          key={p.id}
          style={{ position: 'absolute', left: `${p.left}%`, top: `${p.top}%`, width: '3px', height: '3px', borderRadius: '50%', backgroundColor: '#39ff14', opacity: p.opacity }}
          animate={{ y: [0, p.yOffset] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
};/**
 * Hero section — full-viewport landing area.
 * Contains: animated name, typewriter role text, CTA buttons, profile photo, and 3D Interactive Solar System.
 *
 * @prop {boolean} isMobile   - true when viewport < 768px
 * @prop {boolean} showVault  - true on first visit (used to delay scroll-down indicator)
 */
export default function Hero({ isMobile }) {
  const { triggerWarp } = useWarp();
  const [typed, setTyped] = useState("");
  const [roleIdx, setRoleIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  
  // Interactive 3D Solar System State
  const [hoveredProfile, setHoveredProfile] = useState(false);
  const { requestPermission, isPermissionGranted } = useGyroscope(isMobile);
  const [showGyroStatus, setShowGyroStatus] = useState(false);

  const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

  const handleGyroAuth = async () => {
    const granted = await requestPermission();
    if (granted) {
      setShowGyroStatus(true);
      setTimeout(() => setShowGyroStatus(false), 2000);
    }
  };

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
    if (el) {
      triggerWarp(() => {
        el.scrollIntoView({ behavior: "smooth" });
      });
    }
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
        position: "relative", zIndex: 2, overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes scanner-sweep {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes orbit-tag {
          0% { transform: rotate(0deg) translateX(160px) rotate(0deg) translate(-50%, -50%); }
          100% { transform: rotate(360deg) translateX(160px) rotate(-360deg) translate(-50%, -50%); }
        }
      `}</style>

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
      <div style={{ maxWidth: "860px", zIndex: 3, position: "relative" }}>
        <FloatingParticles />

        <FloatWrap customY={-8} duration={4} delay={0} isMobile={isMobile}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: isMobile ? "10px" : "11px", color: "#39ff14", letterSpacing: "0.25em", marginBottom: "20px", textTransform: "uppercase", animation: "fadeUp 0.5s ease both" }}>
            <span style={{ animation: "pulse-dot 1.2s infinite", display: "inline-block" }}>▶</span>&nbsp; Open to Opportunities
          </div>
        </FloatWrap>

        <FloatWrap customY={-12} duration={5} delay={0.3} isMobile={isMobile}>
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
        </FloatWrap>

        {/* Typewriter role */}
        <FloatWrap customY={-6} duration={3.5} delay={0.6} isMobile={isMobile}>
          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: isMobile ? "13px" : "clamp(13px, 1.6vw, 18px)",
            color: "#383838", marginBottom: "36px", minHeight: "28px",
            animation: "fadeUp 0.7s ease both 0.2s",
          }}>
            {typed}<span style={{ color: "#39ff14", animation: "pulse-dot 0.9s infinite", display: "inline-block" }}>_</span>
          </div>
        </FloatWrap>

        <FloatWrap customY={-9} duration={4.5} delay={0.2} isMobile={isMobile}>
          <p style={{
            fontSize: isMobile ? "14px" : "15px", color: "#4a4a4a", lineHeight: 1.85,
            maxWidth: isMobile ? "100%" : "460px", marginBottom: "36px",
            animation: "fadeUp 0.8s ease both 0.3s",
          }}>
            Computer Science Engineering student with strong skills in Java, Python, and full-stack web development. Experienced in building real-world applications using OOP, SQL, and Flask. Seeking internship opportunities to apply technical and problem-solving skills.
          </p>
        </FloatWrap>

        {/* CTA row */}
        <FloatWrap customY={-7} duration={4.2} delay={0.8} isMobile={isMobile}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", animation: "fadeUp 0.9s ease both 0.4s", alignItems: "flex-start" }}>
            <RocketButton onClick={() => scrollTo("Projects")} isMobile={isMobile}>
              View Projects
            </RocketButton>

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
        </FloatWrap>
      </div>

      {/* Right Column: Stacked Profile Photo and 3D Solar System */}
      <div style={{
        position: isMobile ? "relative" : "absolute",
        right: isMobile ? "auto" : "7%",
        // Safe bounding: Adjusted center calculation to 199px to account for the collapsed 3D deadspace
        top: isMobile ? "auto" : "max(140px, calc(50% - 199px))", 
        marginTop: isMobile ? "64px" : "0",
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: "8px", width: isMobile ? "100%" : "auto"
      }}>
        
        {/* Profile Photo */}
        <div 
          style={{ position: "relative", width: "130px", height: "130px", animation: "float 7s ease-in-out infinite", zIndex: 10 }}
        >
          {/* Base Rings */}
          <div style={{ position: "absolute", inset: "-10px", borderRadius: "50%", border: "1px dashed #39ff1444", animation: "spin-slow 10s linear infinite", animationPlayState: hoveredProfile ? "paused" : "running" }} />
          <div style={{ position: "absolute", inset: "-5px", borderRadius: "50%", border: "1px solid #39ff1430", boxShadow: "0 0 16px #39ff1422" }} />
          
          {/* Main Photo container */}
          <div 
            onMouseEnter={() => setHoveredProfile(true)}
            onMouseLeave={() => setHoveredProfile(false)}
            onClick={() => scrollTo("Home")}
            style={{
              width: "130px", height: "130px", borderRadius: "50%", overflow: "hidden", cursor: "pointer",
              border: hoveredProfile ? "2px solid #39ff14" : "2px solid #39ff1466",
              boxShadow: hoveredProfile ? "0 0 40px #39ff14, 0 0 80px #39ff14aa" : "none",
              background: "#0a0a0a", position: "relative", zIndex: 1,
              transition: "all 0.3s ease",
            }}
          >
            <img
              src="/profile.jpg"
              alt="Jatan Parikh"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "brightness(0.92) contrast(1.05)" }}
              onError={(e) => {
                e.target.style.display = "none";
                e.target.parentNode.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-size:40px;font-weight:800;color:#39ff14;letter-spacing:-0.04em;background:linear-gradient(135deg,#0a0a0a,#111)">JP</div>`;
              }}
            />
            {/* SCANNER */}
            {hoveredProfile && (
              <div style={{ position: "absolute", left: 0, right: 0, height: "1px", background: "#39ff1466", boxShadow: "0 0 4px #39ff14", animation: "scanner-sweep 1.2s linear infinite" }} />
            )}
          </div>
          
          <div style={{ position: "absolute", top: "-2px", left: "50%", transform: "translateX(-50%)", width: "5px", height: "5px", borderRadius: "50%", background: "#39ff14", boxShadow: "0 0 8px #39ff14" }} />
          <div style={{ position: "absolute", bottom: "-2px", left: "50%", transform: "translateX(-50%)", width: "4px", height: "4px", borderRadius: "50%", background: "#39ff1488" }} />

          {/* SATELLITE (ellipse path mapped by neutralizing scale) */}
          <div style={{ 
            position: "absolute", top: "50%", left: "50%", 
            width: "86px", height: "86px", 
            marginLeft: "-43px", marginTop: "-43px", 
            transform: "rotate(-20deg) scaleY(0.465)", // visually scales container to 40px height
            border: "1px dashed #39ff1433", borderRadius: "50%", pointerEvents: "none", zIndex: 5 
          }}>
            <div style={{ position: "absolute", inset: 0, animation: "orbit-satellite 4s linear infinite" }}>
               <div style={{ position: 'absolute', top: "-7px", left: "50%", marginLeft: "-7px", width: "14px", height: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {/* Cancel out the ellipse Y-squish so satellite looks normal */}
                  <div style={{ transform: "scaleY(2.15)", position: "relative" }}>
                    <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
                      <rect x="0" y="2" width="3" height="4" fill="#39ff1433" stroke="#39ff14" strokeWidth="0.5"/>
                      <rect x="4" y="1" width="6" height="6" fill="#050505" stroke="#39ff14" strokeWidth="1"/>
                      <rect x="11" y="2" width="3" height="4" fill="#39ff1433" stroke="#39ff14" strokeWidth="0.5"/>
                    </svg>
                    <div style={{ position: "absolute", top: "2px", left: "6px", width: "2px", height: "2px", background: "#39ff14", borderRadius: "50%", animation: "pulse-dot 2s infinite" }} />
                  </div>
               </div>
            </div>
          </div>

          {/* THREE FLOATING INFO TAGS */}
          {[
            { text: "B.Tech CSE", delay: "0s" },
            { text: "Full Stack", delay: "-4s" },
            { text: "Ahmedabad 🇮🇳", delay: "-8s" }
          ].map((tag, i) => (
            <div key={i} style={{
              position: "absolute", top: "50%", left: "50%",
              width: "0px", height: "0px",
              pointerEvents: "none", zIndex: 6
            }}>
              <div style={{
                position: "absolute", top: 0, left: 0,
                // Orbit perfectly cancels out parent rotation against counter rotation, maintaining fixed translation relative to center 
                animation: `orbit-tag 12s linear infinite ${tag.delay}`,
                pointerEvents: "auto"
              }}>
                <div style={{
                  fontFamily: "'Space Mono', monospace", fontSize: "9px", color: "#39ff14",
                  border: "1px solid #39ff1433", padding: "3px 8px", background: "rgba(5,5,5,0.8)",
                  borderRadius: "4px", whiteSpace: "nowrap", cursor: "default",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.parentElement.style.animationPlayState = "paused";
                  e.currentTarget.style.transform = "scale(1.1)";
                  e.currentTarget.style.borderColor = "#39ff14";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.parentElement.style.animationPlayState = "running";
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.borderColor = "#39ff1433";
                }}
                >
                  {tag.text}
                </div>
              </div>
            </div>
          ))}

        </div>

        {/* 3D Tilted Solar System Navigation */}
        <SolarSystem3D isMobile={isMobile} />

        {/* iOS Gyroscope Permission Toggle */}
        {isMobile && isIOS && (
          <div style={{ marginTop: "-20px", textAlign: "center", minHeight: "20px" }}>
            {!isPermissionGranted ? (
              <button 
                onClick={handleGyroAuth}
                style={{
                  background: "none", border: "none", color: "#39ff1444",
                  fontFamily: "'Space Mono', monospace", fontSize: "9px",
                  cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.1em"
                }}
              >
                Enable 3D Tilt 🌀
              </button>
            ) : (
              <Motion.span 
                initial={{ opacity: 1 }}
                animate={{ opacity: showGyroStatus ? 1 : 0 }}
                style={{
                  color: "#39ff1488", fontFamily: "'Space Mono', monospace", 
                  fontSize: "9px", textTransform: "uppercase"
                }}
              >
                Gyro Active ✓
              </Motion.span>
            )}
          </div>
        )}
      </div>

      {/* Scroll indicator */}
      <div style={{ position: "absolute", bottom: "36px", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", opacity: 0.3 }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "0.2em", color: "#555", textTransform: "uppercase" }}>Scroll</span>
        <div style={{ width: "1px", height: "36px", background: "linear-gradient(180deg,#39ff14,transparent)" }} />
      </div>
    </section>
  );
}
