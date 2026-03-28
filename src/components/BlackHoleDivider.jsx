import React, { useRef, useEffect } from 'react';

export default function BlackHoleDivider() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    let width = canvas.clientWidth;
    let height = canvas.clientHeight;
    const dpr = window.devicePixelRatio || 1;
    
    const setSize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };
    setSize();
    
    window.addEventListener('resize', setSize);
    
    // Accretion Disk particles
    const particles = [];
    for (let i = 0; i < 80; i++) {
      const r = 40 + Math.random() * 80; // distances 40 to 120
      let color = '#ef4444'; // Red outer
      if (r < 60) color = '#ffffff'; // White inner
      else if (r < 85) color = '#fbbf24'; // Gold mid
      
      particles.push({
        angle: Math.random() * Math.PI * 2,
        baseRadius: r,
        speed: (130 - r) * 0.0003 + 0.005,
        color,
        size: Math.random() * 2 + 1,
      });
    }
    
    // Lens stars
    const lensStars = [];
    for (let i = 0; i < 15; i++) {
        lensStars.push({
            baseX: Math.random() * width,
            baseY: Math.random() * height,
            speed: Math.random() * 0.4 + 0.1,
            size: Math.random() * 1.5 + 0.5
        });
    }

    let isSuction = false;
    let suctionStartTime = 0;
    
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        isSuction = true;
        suctionStartTime = performance.now();
      } else {
        isSuction = false;
      }
    }, { threshold: 0.1 });
    
    if (containerRef.current) observer.observe(containerRef.current);
    
    const render = (time) => {
      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;
      
      let suctionFactor = 0;
      if (isSuction && time - suctionStartTime < 1200) {
        const progress = (time - suctionStartTime) / 1200;
        suctionFactor = Math.sin(progress * Math.PI); // Smooth pulse 0 -> 1 -> 0
      }
      
      // 1. Draw gravitational lensing stars (background)
      lensStars.forEach(star => {
         star.baseX += star.speed;
         if (star.baseX > width + 50) star.baseX = -50;
         
         const dx = cx - star.baseX;
         const dy = cy - star.baseY;
         const dist = Math.sqrt(dx*dx + dy*dy);
         
         let drawX = star.baseX;
         let drawY = star.baseY;
         
         if (dist < 180 && dist > 40) {
           const bendPower = Math.pow((180 - dist) / 180, 2) * 40; 
           const angleToCenter = Math.atan2(dy, dx);
           drawX += Math.cos(angleToCenter) * bendPower;
           drawY += Math.sin(angleToCenter) * bendPower;
         }
         
         ctx.beginPath();
         ctx.fillStyle = '#ffffff';
         ctx.globalAlpha = 0.5;
         ctx.arc(drawX, drawY, star.size, 0, Math.PI * 2);
         ctx.fill();
         ctx.globalAlpha = 1;
      });
      
      // 2. Draw Nebula Purple Event Horizon Halo
      const gradient = ctx.createRadialGradient(cx, cy, 40, cx, cy, 90);
      gradient.addColorStop(0, 'rgba(107,33,168,0.8)');
      gradient.addColorStop(1, 'rgba(107,33,168,0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cx, cy, 90, 0, Math.PI * 2);
      ctx.fill();
      
      const computedParticles = particles.map(p => {
        let currentRadius = p.baseRadius;
        let currentSpeed = p.speed;
        
        if (suctionFactor > 0) {
           currentRadius = p.baseRadius - (p.baseRadius - 40) * suctionFactor * 0.6;
           currentSpeed = p.speed + suctionFactor * 0.1;
        }
        
        p.angle += currentSpeed;
        const px = Math.cos(p.angle) * currentRadius;
        const py = Math.sin(p.angle) * currentRadius;
        return { p, px, py };
      });
      
      // 3. Draw Back Half of Accretion Disk (Y < 0)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(1, 0.35);
      computedParticles.filter(cp => cp.py < 0).forEach(cp => {
        ctx.beginPath();
        ctx.fillStyle = cp.p.color;
        ctx.save();
        ctx.translate(cp.px, cp.py);
        ctx.scale(1, 1/0.35); // un-squash particles
        ctx.arc(0, 0, cp.p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      ctx.restore();
      
      // 4. Draw Black Hole Core
      ctx.beginPath();
      ctx.fillStyle = '#000000';
      ctx.arc(cx, cy, 40, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(107,33,168,0.4)';
      ctx.lineWidth = 1;
      ctx.arc(cx, cy, 40, 0, Math.PI * 2);
      ctx.stroke();
      
      // 5. Draw Front Half of Accretion Disk (Y >= 0)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(1, 0.35);
      computedParticles.filter(cp => cp.py >= 0).forEach(cp => {
        ctx.beginPath();
        ctx.fillStyle = cp.p.color;
        ctx.save();
        ctx.translate(cp.px, cp.py);
        ctx.scale(1, 1/0.35);
        ctx.arc(0, 0, cp.p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      ctx.restore();
      
      animationFrameId = requestAnimationFrame(render);
    };
    
    animationFrameId = requestAnimationFrame(render);
    
    return () => {
      window.removeEventListener('resize', setSize);
      cancelAnimationFrame(animationFrameId);
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '220px', position: 'relative', overflow: 'hidden', background: 'transparent' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
}
