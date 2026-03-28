import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { SKILLS } from '../constants';
import useIsVisible from '../hooks/useIsVisible';

const techTags = ["Java", "Python", "C/C++", "Flask", "MySQL", "MongoDB", "Data Structures", "OOP"];

function getColor(text) {
  const t = text.toLowerCase();
  if (t.includes('java ') || t.includes('python') || t.includes('c/') || t === 'java' || t === 'python' || t === 'c/c++') return '#39ff14'; // Languages (Neon Green)
  if (t.includes('html') || t.includes('css') || t.includes('react') || t.includes('javascript') || t === 'react') return '#06b6d4'; // Web (Teal)
  if (t.includes('node') || t.includes('flask') || t.includes('express')) return '#a855f7'; // Backend (Purple)
  if (t.includes('mysql') || t.includes('mongodb') || t.includes('sqlite') || t.includes('postgre')) return '#fbbf24'; // Data (Gold)
  if (t.includes('git')) return '#ef4444'; // Tools (Red)
  return '#39ff14'; // Fallback
}

function Word({ item, position }) {
  const [hovered, setHovered] = useState(false);
  const textGroupRef = useRef();

  useFrame((state) => {
    if (textGroupRef.current) {
      textGroupRef.current.quaternion.copy(state.camera.quaternion);
      const targetScale = hovered ? 1.5 : 1;
      textGroupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15);
    }
  });

  return (
    <group position={position}>
      <group ref={textGroupRef}>
        <Text
          fontSize={0.25}
          color={getColor(item.text)}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
        >
          {item.text}
        </Text>
        
        {hovered && item.type === 'skill' && (
          <Text position={[0, -0.35, 0]} fontSize={0.14} color="#ffffff" opacity={0.8} transparent>
            {item.level}%
          </Text>
        )}
      </group>
    </group>
  );
}

function Cloud({ isMobile }) {
  const groupRef = useRef();

  // Combine arrays and map into sphere positions
  const itemsWithPos = useMemo(() => {
    const combined = [
      ...SKILLS.map(s => ({ text: s.name, type: "skill", level: s.level })),
      ...techTags.map(tag => ({ text: tag, type: "tag" }))
    ];

    const N = combined.length;
    const radius = isMobile ? 2.5 : 3.8; 

    return combined.map((item, i) => {
      const phi = Math.acos(-1 + (2 * i) / N);
      const theta = Math.sqrt(N * Math.PI) * phi;
      return {
        ...item,
        position: [
          radius * Math.cos(theta) * Math.sin(phi),
          radius * Math.sin(theta) * Math.sin(phi),
          radius * Math.cos(phi)
        ]
      };
    });
  }, [isMobile]);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Breathing effect: oscillate scale between 0.96 and 1.04 using a 3s period
      const s = 1 + 0.04 * Math.sin(clock.getElapsedTime() * ((Math.PI * 2) / 3));
      groupRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group ref={groupRef}>
      {itemsWithPos.map((item, i) => (
        <Word key={i} item={item} position={item.position} />
      ))}
    </group>
  );
}

export default function SkillSphere({ isMobile }) {
  const containerRef = useRef();
  const isVisible = useIsVisible(containerRef, 0.05);

  return (
    <div 
      ref={containerRef}
      style={{
        width: isMobile ? "300px" : "500px",
        height: isMobile ? "300px" : "500px",
        margin: "0 auto",
        position: "relative",
        animation: "fadeUp 1s ease both"
      }}
    >
      {isVisible && (
        <Canvas camera={{ position: [0, 0, 7], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            autoRotate={true}
            autoRotateSpeed={1.2}
          />
          <Cloud isMobile={isMobile} />
        </Canvas>
      )}
    </div>
  );
}
