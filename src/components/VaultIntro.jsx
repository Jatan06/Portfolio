import { useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";

const INIT_TEXT = "INITIALIZING SYSTEM...";
const GLYPHS = "█▓░▒";

/**
 * 3D visual for the cental HUD background.
 */
function StartupScene() {
  const planetRef = useRef();
  const moonRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (planetRef.current) planetRef.current.rotation.y += 0.005;
    if (moonRef.current) {
        const orbitAngle = t * (Math.PI * 2 / 3); // 3s period
        moonRef.current.position.x = Math.cos(orbitAngle) * 1.8;
        moonRef.current.position.z = Math.sin(orbitAngle) * 1.8;
    }
  });

  return (
    <>
      <Stars count={200} factor={2} radius={50} speed={1} />
      <mesh ref={planetRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#39ff14" wireframe transparent opacity={0.25} />
      </mesh>
      <mesh ref={moonRef} position={[1.8, 0, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#39ff14" />
    </>
  );
}

/**
 * Synthesizes a low-frequency boot tone using Web Audio API.
 */
function playStartupSound() {
  try {
    const soundPref = localStorage.getItem("jp_sound");
    if (soundPref === "off") return;

    const Context = window.AudioContext || window.webkitAudioContext;
    const ctx = new Context();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(60, ctx.currentTime);

    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.5);
    gain.gain.setValueAtTime(0.08, now + 1.0);
    gain.gain.linearRampToValueAtTime(0, now + 2.0);

    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 2.1);
  } catch (e) {
    console.warn("Audio Context blocked or failed:", e);
  }
}

/**
 * Full-screen HUD boot sequence shown on first visit (session-based).
 * Enhanced with 3D wireframe visuals, audio synthesis, and matrix scramble typing.
 *
 * @prop {() => void} onComplete - called when the animation fully finishes
 * @prop {boolean}    isMobile   - adjusts font/element sizes for mobile
 */
export default function VaultIntro({ onComplete, isMobile }) {
  const [phase, setPhase] = useState("typing"); // typing | opening | flash | done
  const [typedIndex, setTypedIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [showGranted, setShowGranted] = useState(false);

  // Initial sound trigger
  useEffect(() => {
    playStartupSound();
  }, []);

  // Scramble effect and typing progression
  useEffect(() => {
    let scrambleInterval;
    
    // Scramble logic for non-typed characters
    if (phase === "typing" && typedIndex <= INIT_TEXT.length) {
      scrambleInterval = setInterval(() => {
        let result = "";
        for (let i = 0; i < INIT_TEXT.length; i++) {
          if (i < typedIndex) {
            result += INIT_TEXT[i];
          } else {
            // Randomly choose between a glyph and the target char for flicker
            result += Math.random() > 0.3 ? GLYPHS[Math.floor(Math.random() * GLYPHS.length)] : INIT_TEXT[i];
          }
        }
        setDisplayText(result);
      }, 80);
    }

    // Typing progression logic
    const progressionTimeout = setTimeout(() => {
      if (typedIndex < INIT_TEXT.length) {
        setTypedIndex(prev => prev + 1);
      } else {
        // Typing finished
        clearInterval(scrambleInterval);
        setDisplayText(INIT_TEXT);
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

    return () => {
      clearInterval(scrambleInterval);
      clearTimeout(progressionTimeout);
    };
  }, [typedIndex, phase, onComplete]);

  if (phase === "done") return null;

  const isOpening = phase === "opening" || phase === "flash";
  const progress = (typedIndex / INIT_TEXT.length) * 100;

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

        {/* 3D Scene Background (Behind HUD Text) */}
        {!isOpening && (
          <div style={{ position: "absolute", zIndex: 3, width: "200px", height: "200px" }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
              <StartupScene />
            </Canvas>
          </div>
        )}

        {/* HUD Text Content (Z-INDEX 5 to stay in front of 3D Canvas) */}
        <div style={{ position: "relative", zIndex: 5, display: "flex", flexDirection: "column", alignItems: "center", gap: "18px" }}>
          {/* Scrambled Typing line */}
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: isMobile ? "11px" : "13px", color: "#39ff14", letterSpacing: "0.2em", textAlign: "center", padding: "0 20px" }}>
            {displayText}<span style={{ animation: "pulse-dot 0.7s infinite", display: "inline-block" }}>_</span>
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
