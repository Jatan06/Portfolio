import React, { useRef, useState, useEffect } from 'react';
import useRocketCursor from '../hooks/useRocketCursor';

export default function RocketCursor() {
  const { x, y, angle } = useRocketCursor();
  const trailRef = useRef([]);
  const [drawnTrail, setDrawnTrail] = useState([]);
  const [bursts, setBursts] = useState([]);
  const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  // Update trail every mouse move (driven by useRocketCursor triggering re-render)
  useEffect(() => {
    if (isTouch || x === -100) return;
    
    trailRef.current = [...trailRef.current, { x, y, id: Date.now() + Math.random() }];
    if (trailRef.current.length > 10) {
      trailRef.current = trailRef.current.slice(trailRef.current.length - 10);
    }
    setDrawnTrail(trailRef.current);
  }, [x, y, isTouch]);

  // Handle click for starburst
  useEffect(() => {
    if (isTouch) return;

    const handleClick = (e) => {
      const newBurst = { x: e.clientX, y: e.clientY, id: Date.now() };
      setBursts((prev) => [...prev, newBurst]);

      setTimeout(() => {
        setBursts((prev) => prev.filter((b) => b.id !== newBurst.id));
      }, 400);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [isTouch]);

  if (isTouch) return null;

  // Raw angle points 0 radians to the right (X+).
  // The rocket emoji naturally points up-right -> ~ -45 degrees.
  // Add 45deg (PI / 4) offset to map angle=0 back to rocket pointing exactly right.
  const rotationDeg = (angle * 180) / Math.PI + 45;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 9998 }}>
      {/* Vfx Trail */}
      {drawnTrail.map((t, i) => {
        const opacity = (i / drawnTrail.length) * 0.6; // older dots have lower index thus lower opacity
        return (
          <div
            key={t.id}
            style={{
              position: 'fixed',
              left: t.x,
              top: t.y,
              width: '4px',
              height: '4px',
              backgroundColor: '#39ff14',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              opacity,
              pointerEvents: 'none'
            }}
          />
        );
      })}

      {/* Vfx Starbursts */}
      {bursts.map((b) => (
        <div key={b.id} style={{ position: 'fixed', left: b.x, top: b.y, pointerEvents: 'none' }}>
          {[...Array(6)].map((_, i) => {
            const burstAngle = (i * Math.PI * 2) / 6;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: '12px',
                  height: '2px',
                  backgroundColor: '#fbbf24', // Golden color
                  transformOrigin: '0 50%',
                  '--burst-angle': `${burstAngle}rad`,
                  animation: 'starburst-anim 400ms ease-out forwards'
                }}
              />
            );
          })}
        </div>
      ))}

      {/* Main Cursor Emoji */}
      <div
        style={{
          position: 'fixed',
          left: x,
          top: y,
          fontSize: '24px',
          transform: `translate(-50%, -50%) rotate(${rotationDeg}deg)`,
          pointerEvents: 'none',
          transition: 'transform 0.1s ease-out', // Smooth out rotation interpolation
          filter: 'drop-shadow(0 0 10px rgba(57, 255, 20, 0.5))'
        }}
      >
        🚀
      </div>

      <style>
        {`
          @keyframes starburst-anim {
            0% { transform: rotate(var(--burst-angle)) translateX(5px) scaleX(1); opacity: 1; }
            100% { transform: rotate(var(--burst-angle)) translateX(25px) scaleX(0); opacity: 0; }
          }
        `}
      </style>
    </div>
  );
}
