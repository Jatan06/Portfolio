import { useState, useEffect } from 'react';

export default function useRocketCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100, angle: 0 });

  useEffect(() => {
    let lastX = 0;
    let lastY = 0;

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const dx = clientX - lastX;
      const dy = clientY - lastY;
      
      const angle = Math.atan2(dy, dx); 

      setPosition({
        x: clientX,
        y: clientY,
        angle
      });

      lastX = clientX;
      lastY = clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return position;
}
