import { useState, useEffect } from "react";

const INIT_TEXT = "INITIALIZING SYSTEM...";

/**
 * Full-screen HUD boot sequence shown on first visit (session-based).
 * Two panels slide open vertically after the typing animation completes.
 *
 * @prop {() => void} onComplete - called when the animation fully finishes
 * @prop {boolean}    isMobile   - adjusts font/element sizes for mobile
 */
export default function VaultIntro({ onComplete, isMobile }) {
  const [phase, setPhase] = useState("typing"); // typing | opening | flash | done
  const [typedText, setTypedText] = useState("");
  const [showGranted, setShowGranted] = useState(false);

  useEffect(() => {
    let i = 0;
    const typeInterval = setInterval(() => {
      if (i < INIT_TEXT.length) {
        i++;
        setTypedText(INIT_TEXT.slice(0, i));
      } else {
        clearInterval(typeInterval);
        setShowGranted(true);
        setTimeout(() => {
          setPhase("opening");
          setTimeout(() => {
            setPhase("flash");
            setTimeout(() => {
              setPhase("done");
              onComplete();
            }, 700);
          }, 1000);
        }, 480);
      }
    }, 52);
    return () => clearInterval(typeInterval);
  // onComplete is intentionally excluded — this effect runs once on mount only
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (phase === "done") return null;

  const isOpening = phase === "opening" || phase === "flash";
  const progress = (typedText.length / INIT_TEXT.length) * 100;

  const panelBase = {
    position: "absolute", left: 0, right: 0,
    background: "#050505",
    transition: "transform 1.15s cubic-bezier(0.76, 0, 0.24, 1)",
    zIndex: 2, overflow: "hidden",
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999 }}>
      {/* Green flash overlay */}
      {phase === "flash" && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 5,
          background: "radial-gradient(ellipse at center, #39ff1420, transparent 70%)",
          animation: "vaultFlash 0.7s ease-out forwards",
          pointerEvents: "none",
        }} />
      )}

      {/* TOP PANEL */}
      <div style={{
        ...panelBase, top: 0, height: "50%", 
        transform: isOpening ? "translateY(-100%)" : "translateY(0)",
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(#39ff14 1px, transparent 1px), linear-gradient(90deg, #39ff14 1px, transparent 1px)", backgroundSize: "64px 64px", opacity: 0.03 }} />
        <div style={{ position: "absolute", left: 0, right: 0, height: "60px", background: "linear-gradient(180deg,transparent,#39ff140a,transparent)", animation: "hud-scan 2s linear infinite", top: 0 }} />
        <div style={{ position: "absolute", top: 20, left: 20, width: 22, height: 22, borderTop: "2px solid #39ff1466", borderLeft: "2px solid #39ff1466", animation: "corner-pulse 2s ease-in-out infinite" }} />
        <div style={{ position: "absolute", top: 20, right: 20, width: 22, height: 22, borderTop: "2px solid #39ff1466", borderRight: "2px solid #39ff1466", animation: "corner-pulse 2s ease-in-out infinite 0.5s" }} />
        <div style={{ position: "absolute", bottom: "75px", left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, #39ff14, transparent)", boxShadow: "0 0 12px #39ff14" }} />
        {/* Status dots */}
        <div style={{ position: "absolute", top: 24, right: 60, display: "flex", gap: "8px", alignItems: "center" }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: i === 0 ? "#39ff14" : "#1a1a1a", boxShadow: i === 0 ? "0 0 8px #39ff14" : "none", animation: i === 0 ? "pulse-dot 1s infinite" : "none" }} />
          ))}
        </div>
      </div>

      {/* BOTTOM PANEL */}
      <div style={{
        ...panelBase, bottom: 0, height: "50%", 
        transform: isOpening ? "translateY(100%)" : "translateY(0)",
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(#39ff14 1px, transparent 1px), linear-gradient(90deg, #39ff14 1px, transparent 1px)", backgroundSize: "64px 64px", opacity: 0.03 }} />
        <div style={{ position: "absolute", left: 0, right: 0, height: "60px", background: "linear-gradient(180deg,transparent,#39ff140a,transparent)", animation: "hud-scan 2.4s linear infinite reverse", bottom: 0 }} />
        <div style={{ position: "absolute", bottom: 20, left: 20, width: 22, height: 22, borderBottom: "2px solid #39ff1466", borderLeft: "2px solid #39ff1466", animation: "corner-pulse 2s ease-in-out infinite 0.25s" }} />
        <div style={{ position: "absolute", bottom: 20, right: 20, width: 22, height: 22, borderBottom: "2px solid #39ff1466", borderRight: "2px solid #39ff1466", animation: "corner-pulse 2s ease-in-out infinite 0.75s" }} />
        <div style={{ position: "absolute", top: "75px", left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, #39ff14, transparent)", boxShadow: "0 0 12px #39ff14" }} />
        <div style={{ position: "absolute", bottom: 22, left: 56, fontFamily: "'Space Mono',monospace", fontSize: "9px", color: "#39ff1444", letterSpacing: "0.2em" }}>SEC::LAYER_01</div>
      </div>

      {/* CENTER HUD */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 4,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: "18px", pointerEvents: "none",
        opacity: isOpening ? 0 : 1,
        transition: "opacity 0.25s ease",
      }}>
        {/* Logo */}
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: isMobile ? "22px" : "28px", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: "4px" }}>
          <span style={{ color: "#39ff14" }}>{"<"}</span>JP<span style={{ color: "#39ff14" }}>{"/>"}</span>
        </div>

        {/* Typing line */}
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: isMobile ? "11px" : "13px", color: "#39ff14", letterSpacing: "0.2em", textAlign: "center", padding: "0 20px" }}>
          {typedText}<span style={{ animation: "pulse-dot 0.7s infinite", display: "inline-block" }}>_</span>
        </div>

        {/* Loading bar */}
        <div style={{ width: isMobile ? "160px" : "220px", height: "1px", background: "#111", position: "relative" }}>
          <div style={{
            height: "100%",
            background: "linear-gradient(90deg, #39ff14, #00cc44)",
            boxShadow: "0 0 10px #39ff14",
            width: `${progress}%`,
            transition: "width 0.05s linear",
          }} />
          <div style={{ position: "absolute", right: 0, top: "-16px", fontFamily: "'Space Mono',monospace", fontSize: "9px", color: "#39ff1466", letterSpacing: "0.1em" }}>
            {Math.round(progress)}%
          </div>
        </div>

        {/* Access granted */}
        <div style={{
          fontFamily: "'Space Mono',monospace", fontSize: "10px",
          color: showGranted ? "#39ff14" : "transparent",
          letterSpacing: "0.35em", textTransform: "uppercase",
          textShadow: showGranted ? "0 0 20px #39ff14" : "none",
          transition: "color 0.4s ease, text-shadow 0.4s ease",
          marginTop: "4px",
        }}>
          ▶ ACCESS GRANTED
        </div>

        {/* Side accent lines (desktop only) */}
        {!isMobile && (
          <>
            <div style={{ position: "absolute", left: "48px", top: "50%", transform: "translateY(-50%)", width: "1px", height: "100px", background: "linear-gradient(180deg,transparent,#39ff1433,transparent)" }} />
            <div style={{ position: "absolute", right: "48px", top: "50%", transform: "translateY(-50%)", width: "1px", height: "100px", background: "linear-gradient(180deg,transparent,#39ff1433,transparent)" }} />
          </>
        )}
      </div>
    </div>
  );
}
