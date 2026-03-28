import React, { useEffect, useRef, useState } from 'react';

/**
 * WarpOverlay Component
 * Renders a full-screen canvas "Hyperspace Jump" effect.
 * Triggered by the 'warp-start' CustomEvent.
 */
const WarpOverlay = () => {
    const canvasRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(() => {
        const handleWarp = (e) => {
            const { callback } = e.detail;
            
            // 1. Initial State: Fade in
            setIsVisible(true);
            
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            
            const w = canvas.width = window.innerWidth;
            const h = canvas.height = window.innerHeight;
            const cx = w / 2;
            const cy = h / 2;
            
            // 200 radiating star vectors
            const stars = Array.from({ length: 200 }).map(() => ({
                angle: Math.random() * Math.PI * 2,
                dist: Math.random() * 40,
                speedMultiplier: Math.random() * 0.5 + 0.5
            }));

            const startTime = performance.now();
            let raf;
            
            const animate = (now) => {
                const elapsed = now - startTime;
                
                ctx.clearRect(0, 0, w, h);
                
                // Jump acceleration (0ms to 350ms)
                const warpProgress = Math.min(1, elapsed / 350);
                const stretchLength = Math.pow(warpProgress, 3) * Math.max(w, h);
                
                // Flash white at 80% progress
                const baseColor = warpProgress > 0.85 ? "#ffffff" : "#39ff14";
                
                ctx.lineWidth = 1.5;
                ctx.strokeStyle = baseColor;
                
                stars.forEach(s => {
                    const sx = cx + Math.cos(s.angle) * s.dist;
                    const sy = cy + Math.sin(s.angle) * s.dist;
                    
                    // Lines radiate outwards and grow longer
                    const ex = sx + Math.cos(s.angle) * (stretchLength * s.speedMultiplier);
                    const ey = sy + Math.sin(s.angle) * (stretchLength * s.speedMultiplier);
                    
                    ctx.beginPath();
                    ctx.moveTo(sx, sy);
                    ctx.lineTo(ex, ey);
                    ctx.stroke();
                });

                if (elapsed < 500) {
                    raf = requestAnimationFrame(animate);
                }
            };
            
            raf = requestAnimationFrame(animate);

            // 2. Schedule Fade Out (starts at 350ms)
            const fadeOutTimer = setTimeout(() => {
                setIsVisible(false);
            }, 350);

            // 3. Complete (callback after 500ms)
            const completeTimer = setTimeout(() => {
                if (callback) callback();
            }, 500);

            return () => {
                cancelAnimationFrame(raf);
                clearTimeout(fadeOutTimer);
                clearTimeout(completeTimer);
            };
        };

        window.addEventListener('warp-start', handleWarp);
        return () => window.removeEventListener('warp-start', handleWarp);
    }, []);

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9990,
            pointerEvents: 'none',
            opacity: isVisible ? 1 : 0,
            visibility: isVisible ? 'visible' : 'hidden',
            transition: `opacity ${isVisible ? '0.05s' : '0.15s'} linear`,
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
        </div>
    );
};

export default WarpOverlay;
