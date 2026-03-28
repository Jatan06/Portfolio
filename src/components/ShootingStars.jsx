import React, { useRef, useEffect } from 'react';

export default function ShootingStars() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let timeoutId;
    let stars = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const createStar = () => {
      const isMobile = window.innerWidth < 768;
      
      let startX, startY;
      if (Math.random() > 0.5) {
        // Start from top edge
        startX = Math.random() * window.innerWidth;
        startY = 0;
      } else {
        // Start from left edge (mostly top half to avoid immediate exit)
        startX = 0;
        startY = Math.random() * window.innerHeight * 0.5;
      }

      // Angle: 30 to 60 degrees (PI/6 to PI/3)
      const minAngle = Math.PI / 6;
      const maxAngle = Math.PI / 3;
      const angle = Math.random() * (maxAngle - minAngle) + minAngle;

      // Duration: 800 - 1400ms
      const duration = Math.random() * 600 + 800; 
      
      // Length: 80 - 180px
      const length = Math.random() * 100 + 80;

      // 1 in 5 chance of a golden star
      const isGolden = Math.random() < 0.2;
      const thickness = isGolden ? 2 : 1;
      
      stars.push({
        startX, 
        startY, 
        angle, 
        duration, 
        length,
        startTime: performance.now(),
        isGolden, 
        thickness
      });

      // Schedule next star
      const nextInterval = isMobile 
        ? Math.random() * 3000 + 5000   // 5000-8000ms on mobile
        : Math.random() * 2000 + 2000;  // 2000-4000ms on desktop
        
      timeoutId = setTimeout(createStar, nextInterval);
    };

    const render = (time) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const screenDiag = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2);
      
      stars = stars.filter(star => {
        const elapsed = time - star.startTime;
        const progress = elapsed / star.duration;
        
        // Remove if it clearly left the screen
        if (progress > 1.2) return false; 
        
        const distance = progress * screenDiag; 
        
        const currentX = star.startX + Math.cos(star.angle) * distance;
        const currentY = star.startY + Math.sin(star.angle) * distance;
        
        const tailX = currentX - Math.cos(star.angle) * star.length;
        const tailY = currentY - Math.sin(star.angle) * star.length;
        
        const gradient = ctx.createLinearGradient(tailX, tailY, currentX, currentY);
        
        if (star.isGolden) {
          gradient.addColorStop(0, 'rgba(251, 191, 36, 0)');     // transparent tail
          gradient.addColorStop(0.8, 'rgba(251, 191, 36, 0.8)'); // golden body
          gradient.addColorStop(1, '#fff');                       // white head
        } else {
          gradient.addColorStop(0, 'rgba(57, 255, 20, 0)');      // transparent tail
          gradient.addColorStop(0.8, 'rgba(57, 255, 20, 0.8)');  // neon green body
          gradient.addColorStop(1, '#fff');                      // white head
        }
        
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(currentX, currentY);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = star.thickness;
        ctx.lineCap = 'round';
        ctx.stroke();

        return true;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    // Initialize first timeout and start render loop
    const firstInterval = window.innerWidth < 768 
      ? Math.random() * 3000 + 5000 
      : Math.random() * 2000 + 2000;
      
    timeoutId = setTimeout(createStar, firstInterval);
    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
      }}
    />
  );
}
