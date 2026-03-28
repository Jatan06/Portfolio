import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

/**
 * RocketButton component for call-to-action with launch animation.
 * 
 * @param {Function} onClick  - logic to trigger after launch
 * @param {string}   children - button text
 * @param {boolean}  isMobile - responsive flag
 */
const RocketButton = ({ onClick, children, isMobile }) => {
  const [hovered, setHovered] = useState(false);
  const [displayText, setDisplayText] = useState(children);
  const [isLaunching, setIsLaunching] = useState(false);
  const [rocketData, setRocketData] = useState(null);
  const buttonRef = useRef(null);

  // Countdown hover effect
  useEffect(() => {
    let t1, t2, t3;
    if (hovered && !isLaunching) {
      setDisplayText("3...");
      t1 = setTimeout(() => setDisplayText("2..."), 400);
      t2 = setTimeout(() => setDisplayText("1..."), 800);
    } else if (!isLaunching) {
      setDisplayText(children);
    }
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [hovered, children, isLaunching]);

  const handleLaunch = () => {
    if (isLaunching) return;
    setIsLaunching(true);
    setDisplayText("🚀 LAUNCH");

    const rect = buttonRef.current.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top;

    // Phase 1: Show Launch Text (200ms)
    setTimeout(() => {
      // Phase 2: Start Flight (600ms)
      setRocketData({ x: startX, y: startY });
      
      setTimeout(() => {
        onClick();
        setIsLaunching(false);
        setRocketData(null);
        setDisplayText(children);
      }, 600);
    }, 200);
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleLaunch}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: "#39ff14", color: "#000", border: "1px solid #39ff14",
          height: "48px", minWidth: isMobile ? "100%" : "160px", padding: "0 32px",
          fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "0.12em", fontWeight: 700,
          cursor: "pointer", textTransform: "uppercase",
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative",
          animation: hovered && !isLaunching ? "wiggle 0.3s infinite" : "glowPulse 2s infinite",
          transition: "all 0.2s",
          zIndex: 5
        }}
      >
        <span style={{ 
          transform: isLaunching ? "scale(1.2)" : "none", 
          transition: "transform 0.1s",
          opacity: isLaunching ? 1 : 0.9 
        }}>
          {displayText}
        </span>
        
        {!isLaunching && (
          <span style={{ marginLeft: "8px", fontSize: "14px", transition: "all 0.3s" }}>🚀</span>
        )}

        {/* Hover Thrust Particles (Flames) */}
        {hovered && !isLaunching && (
          <div style={{ position: "absolute", bottom: "-12px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "6px" }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 0, height: 0,
                borderLeft: "5px solid transparent", borderRight: "5px solid transparent", 
                borderTop: "12px solid #fbbf24",
                animation: `flame-flicker ${0.15 + i * 0.05}s infinite alternate`
              }} />
            ))}
          </div>
        )}
      </button>

      {/* ROCKET FLIGHT PORTAL */}
      {rocketData && createPortal(
        <div style={{
          position: "fixed", left: rocketData.x, top: rocketData.y,
          width: "40px", height: "60px", marginLeft: "-20px", marginTop: "-30px",
          zIndex: 10000, pointerEvents: "none",
          animation: "rocket-up 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards"
        }}>
          <RocketCanvas />
          
          {/* SMOKE TRAIL */}
          {[...Array(8)].map((_, i) => (
            <div key={i} style={{
              position: "absolute", bottom: `-${(i + 1) * 12}px`, left: "50%",
              width: "12px", height: "12px", background: "#333333", borderRadius: "50%",
              transform: "translateX(-50%)",
              animation: "smoke-fade 0.5s forwards",
              animationDelay: `${i * 0.04}s`
            }} />
          ))}
        </div>,
        document.body
      )}
    </>
  );
};

/**
 * Optimized canvas-based rocket rendering.
 */
const RocketCanvas = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    
    const draw = () => {
      ctx.clearRect(0, 0, 40, 60);
      
      // Fin shadows
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(5, 30, 30, 10);
      
      // Body
      ctx.fillStyle = "#39ff14";
      ctx.beginPath();
      ctx.moveTo(20, 0); 
      ctx.lineTo(35, 20);
      ctx.lineTo(35, 40);
      ctx.lineTo(5, 40);
      ctx.lineTo(5, 20);
      ctx.closePath();
      ctx.fill();

      // Window
      ctx.fillStyle = "#050505";
      ctx.beginPath();
      ctx.arc(20, 20, 5, 0, Math.PI * 2);
      ctx.fill();
      
      // Dynamic Engine Flame
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.moveTo(12, 40);
      ctx.lineTo(28, 40);
      ctx.lineTo(20, 50 + Math.random() * 10);
      ctx.fill();
      
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={canvasRef} width="40" height="60" style={{ display: "block" }} />;
};

export default RocketButton;
