import { useState, useEffect } from "react";
import { NAV_LINKS } from "./constants";
import VaultIntro from "./components/VaultIntro";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Projects from "./sections/Projects";
import Skills from "./sections/Skills";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";

/**
 * Root portfolio component.
 * Owns global state: vault intro, active nav section, scroll position, window width.
 * Renders the global styles, background, scanline, navigation, and all sections.
 */
export default function Portfolio() {
  // ── Vault intro (shown once per session or forcefully on Ctrl+Shift+R) ──────
  const [showVault] = useState(() => {
    const forceRender = sessionStorage.getItem("jp_force_vault") === "true";
    if (forceRender) {
       sessionStorage.removeItem("jp_force_vault");
       return true;
    }
    return !sessionStorage.getItem("jp_vault_seen");
  });
  const handleVaultComplete = () => sessionStorage.setItem("jp_vault_seen", "1");

  // ── Browser Refresh Key Interception ─────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Detect Ctrl+Shift+R, Cmd+Shift+R, or Ctrl+F5 (Hard Reloads)
      const isHardReload = ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'r') || (e.ctrlKey && e.key === 'F5');
      if (isHardReload) {
        sessionStorage.setItem("jp_force_vault", "true");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // ── Responsive + scroll state ────────────────────────────────────────────────
  const [scrollY,       setScrollY]       = useState(0);
  const [windowWidth,   setWindowWidth]   = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  const [activeSection, setActiveSection] = useState("Home");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const isMobile = windowWidth < 768;

  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight active nav link based on scroll position
  useEffect(() => {
    const sections = NAV_LINKS.map((n) => document.getElementById(n.toLowerCase()));
    const handler = () => {
      const y = window.scrollY + 200;
      sections.forEach((s, i) => {
        if (s && y >= s.offsetTop) setActiveSection(NAV_LINKS[i]);
      });
    };
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id.toLowerCase());
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ background: "#050505", minHeight: "100vh", color: "#fff", fontFamily: "'Inter', sans-serif", overflowX: "hidden" }}>

      {/* ── Vault intro overlay ─────────────────────────────────────────────── */}
      {showVault && <VaultIntro onComplete={handleVaultComplete} isMobile={isMobile} />}

      {/* ── Global styles & keyframes ───────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        ::selection { background: #39ff1430; color: #39ff14; }
        html { scroll-behavior: smooth; }
        body { background: #050505; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #050505; }
        ::-webkit-scrollbar-thumb { background: #39ff14; }
        @keyframes pulse-dot    { 0%,100% { opacity:1; } 50% { opacity:0; } }
        @keyframes float        { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-16px); } }
        @keyframes scan         { from { transform: translateY(-100%); } to { transform: translateY(100vh); } }
        @keyframes fadeUp       { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin-slow    { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spin-slow-rev{ from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        @keyframes glowPulse    { 0%,100% { box-shadow: 0 0 0px #39ff1400; } 50% { box-shadow: 0 0 32px #39ff1444; } }
        @keyframes photo-glow   { 0%,100% { box-shadow: 0 0 18px #39ff1433, 0 0 0px #39ff1400, inset 0 0 12px #39ff1411; } 50% { box-shadow: 0 0 36px #39ff1466, 0 0 60px #39ff1422, inset 0 0 20px #39ff1422; } }
        @keyframes vaultFlash   { 0% { opacity:1; } 100% { opacity:0; } }
        @keyframes hud-scan     { from { transform: translateY(-100%); } to { transform: translateY(200%); } }
        @keyframes corner-pulse { 0%,100% { opacity:0.4; } 50% { opacity:1; } }
      `}</style>

      {/* ── Global background grid ──────────────────────────────────────────── */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: "linear-gradient(#39ff14 1px, transparent 1px), linear-gradient(90deg, #39ff14 1px, transparent 1px)",
        backgroundSize: "64px 64px", opacity: 0.03,
      }} />

      {/* ── Scanline ────────────────────────────────────────────────────────── */}
      <div style={{
        position: "fixed", left: 0, right: 0, height: "1px",
        background: "linear-gradient(90deg, transparent, #39ff1430, transparent)",
        animation: "scan 10s linear infinite", pointerEvents: "none", zIndex: 1,
      }} />

      {/* ── Navigation ──────────────────────────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: isMobile ? "18px 24px" : "18px 48px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: scrollY > 30 || (isMobile && isMobileNavOpen) ? "rgba(5,5,5,0.94)" : "transparent",
        backdropFilter: scrollY > 30 || (isMobile && isMobileNavOpen) ? "blur(16px)" : "none",
        borderBottom: scrollY > 30 ? "1px solid #0f0f0f" : "none",
        transition: "all 0.4s ease",
      }}>
        {/* Logo */}
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "17px", fontWeight: 800, letterSpacing: "-0.02em" }}>
          <span style={{ color: "#39ff14" }}>{"<"}</span>JP<span style={{ color: "#39ff14" }}>{"/>"}</span>
        </div>

        {isMobile ? (
          /* Hamburger toggle */
          <button
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "8px" }}
          >
            <div style={{ width: "22px", height: "1px", background: "#39ff14", marginBottom: "6px", transition: "all 0.3s", transform: isMobileNavOpen ? "rotate(45deg) translateY(5px)" : "none" }} />
            <div style={{ width: "22px", height: "1px", background: "#39ff14", marginBottom: "6px", opacity: isMobileNavOpen ? 0 : 1 }} />
            <div style={{ width: "22px", height: "1px", background: "#39ff14", transition: "all 0.3s", transform: isMobileNavOpen ? "rotate(-45deg) translateY(-5px)" : "none" }} />
          </button>
        ) : (
          /* Desktop nav links */
          <div style={{ display: "flex", gap: "40px" }}>
            {NAV_LINKS.map((n) => (
              <button key={n} onClick={() => scrollTo(n)} style={{
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "'Space Mono', monospace", fontSize: "11px",
                color: activeSection === n ? "#39ff14" : "#444",
                letterSpacing: "0.1em", textTransform: "uppercase",
                transition: "color 0.2s", position: "relative", padding: "4px 0",
              }}>
                {n}
                {activeSection === n && (
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "1px", background: "#39ff14", boxShadow: "0 0 8px #39ff14" }} />
                )}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* ── Mobile full-screen nav overlay ──────────────────────────────────── */}
      {isMobile && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(5,5,5,0.98)", zIndex: 99,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: "32px", transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          transform: isMobileNavOpen ? "translateX(0)" : "translateX(100%)",
          opacity: isMobileNavOpen ? 1 : 0,
        }}>
          {NAV_LINKS.map((n, i) => (
            <button key={n} onClick={() => { scrollTo(n); setIsMobileNavOpen(false); }} style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "'Syne', sans-serif", fontSize: "32px", fontWeight: 800,
              color: activeSection === n ? "#39ff14" : "#222",
              letterSpacing: "-0.03em", textTransform: "uppercase",
              transition: "all 0.3s",
              transform: isMobileNavOpen ? "translateY(0)" : "translateY(20px)",
              opacity: isMobileNavOpen ? 1 : 0,
              transitionDelay: `${i * 0.1}s`,
            }}>
              {n}
            </button>
          ))}
        </div>
      )}

      {/* ── Page sections ───────────────────────────────────────────────────── */}
      <Hero     isMobile={isMobile} />
      <About    isMobile={isMobile} />
      <Projects isMobile={isMobile} />
      <Skills   isMobile={isMobile} />
      <Contact  isMobile={isMobile} />
      <Footer   isMobile={isMobile} />
    </div>
  );
}