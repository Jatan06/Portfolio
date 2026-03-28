import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Html, Line, Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { useWarp } from '../hooks/useWarp';
import { usePlanetSound } from '../hooks/usePlanetSound';
import { useGyroscope } from '../hooks/useGyroscope';
import useIsVisible from '../hooks/useIsVisible';

const planets = [
  { id: "About", label: "About", radius: 0.25, orbitRadius: 2.2, speed: 12, startAngle: Math.random() * Math.PI * 2 },
  { id: "Projects", label: "Projects", radius: 0.35, orbitRadius: 3.8, speed: 18, startAngle: Math.random() * Math.PI * 2 },
  { id: "Skills", label: "Skills", radius: 0.45, orbitRadius: 5.4, speed: 25, startAngle: Math.random() * Math.PI * 2, hasRing: true },
  { id: "Contact", label: "Contact", radius: 0.25, orbitRadius: 7.2, speed: 34, startAngle: Math.random() * Math.PI * 2 },
];

function Planet({ id, label, radius, orbitRadius, speed, startAngle, hasRing, isMobile }) {
  const { playPlanetTone, playClickSound } = usePlanetSound();
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  const currentOrbitRadius = isMobile ? orbitRadius * 0.7 : orbitRadius;
  const currentRadius = isMobile ? radius * 0.8 : radius;

  const cloudRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const angle = (t * (Math.PI * 2) / speed) + startAngle;
    if (meshRef.current) {
      meshRef.current.position.x = Math.cos(angle) * currentOrbitRadius;
      meshRef.current.position.z = Math.sin(angle) * currentOrbitRadius;
      meshRef.current.position.y = 0;
      meshRef.current.rotation.y += 0.01;
    }
    if (cloudRef.current) {
      cloudRef.current.rotation.y += 0.002; // Rotates 20% faster relative to the planet's rotation
    }
  });

  const { triggerWarp } = useWarp();
  const scrollTo = (sectionId) => {
    const el = document.getElementById(sectionId.toLowerCase());
    if (el) {
      triggerWarp(() => {
        el.scrollIntoView({ behavior: "smooth" });
      });
    }
  };

  const points = [];
  const segments = 64;
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(theta) * currentOrbitRadius, 0, Math.sin(theta) * currentOrbitRadius));
  }

  return (
    <group>
      <Line points={points} color="#39ff14" opacity={0.15} transparent lineWidth={1} dashed dashSize={0.2} gapSize={0.1} />

      <mesh
        ref={meshRef}
        onPointerOver={(e) => { 
          e.stopPropagation(); 
          setHovered(true); 
          document.body.style.cursor = 'pointer'; 
          playPlanetTone(id); 
        }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
        onClick={(e) => { 
          e.stopPropagation(); 
          playClickSound();
          scrollTo(id); 
        }}
        scale={hovered ? 1.3 : 1}
      >
        <sphereGeometry args={[currentRadius, 32, 32]} />
        <meshStandardMaterial 
          color="#39ff14" 
          emissive="#39ff14" 
          emissiveIntensity={hovered ? 0.8 : 0.4} 
        />
        
        {/* Atmosphere */}
        {(id === "Projects" || id === "Skills") && (
          <mesh>
            <sphereGeometry args={[currentRadius * 1.15, 32, 32]} />
            <meshStandardMaterial color={id === "Projects" ? "#00ddff" : "#fbbf24"} transparent opacity={id === "Projects" ? 0.08 : 0.06} depthWrite={false} />
          </mesh>
        )}

        {/* Clouds */}
        {id === "Projects" && (
          <mesh ref={cloudRef}>
            <sphereGeometry args={[currentRadius * 1.08, 32, 32]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.15} wireframe={false} depthWrite={false} />
          </mesh>
        )}
        
        {hasRing && (
          <mesh rotation={[Math.PI / 2 + (20 * Math.PI / 180), 0, 0]}>
            <torusGeometry args={[currentRadius * 1.6, 0.05, 32, 100]} />
            <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={0.5} />
          </mesh>
        )}

        {hovered && (
          <Html distanceFactor={15} center position={[0, currentRadius + 0.8, 0]}>
            <div style={{
              color: '#39ff14',
              fontFamily: "'Space Mono', monospace",
              fontSize: '14px',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              fontWeight: 'bold',
              background: 'rgba(5,5,5,0.85)',
              padding: '4px 8px',
              borderRadius: '4px',
              border: '1px solid #39ff1444',
              whiteSpace: 'nowrap',
              pointerEvents: 'none'
            }}>
              {label}
            </div>
          </Html>
        )}
      </mesh>
    </group>
  );
}

function Sun({ isMobile }) {
  const { triggerWarp } = useWarp();
  const { playClickSound } = usePlanetSound();
  const [hovered, setHovered] = useState(false);
  const sunRef = useRef();
  const flaresRef = useRef([]);

  useFrame(({ clock }) => {
    const scale = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.05;
    if (sunRef.current) {
      sunRef.current.scale.set(scale, scale, scale);
    }
    if (flaresRef.current.length > 0) {
      const flareScale = hovered ? Math.abs(Math.sin(clock.getElapsedTime() * Math.PI / 0.8)) : THREE.MathUtils.lerp(flaresRef.current[0].scale.y, 0, 0.1);
      flaresRef.current.forEach(f => {
        if (f) f.scale.set(1, flareScale, 1);
      });
    }
  });

  const scrollTo = () => {
    const el = document.getElementById("home");
    if (el) {
      triggerWarp(() => {
        el.scrollIntoView({ behavior: "smooth" });
      });
    }
  };

  const sunRadius = isMobile ? 0.7 : 0.9;

  return (
    <mesh
      ref={sunRef}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
      onClick={(e) => { 
        e.stopPropagation(); 
        playClickSound();
        scrollTo(); 
      }}
    >
      <sphereGeometry args={[sunRadius, 32, 32]} />
      <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={hovered ? 1.2 : 0.8} />
      <pointLight color="#39ff14" intensity={hovered ? 2 : 1} distance={30} decay={2} />

      {/* Solar Flares */}
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle, i) => (
        <group
          key={i}
          rotation={[0, 0, angle - Math.PI / 2]}
          position={[Math.cos(angle) * sunRadius, Math.sin(angle) * sunRadius, 0]}
        >
          <mesh ref={el => flaresRef.current[i] = el} position={[0, 0.75, 0]}>
            <coneGeometry args={[0.08, 1.5, 8]} />
            <meshStandardMaterial color="#39ff14" emissive="#fbbf24" emissiveIntensity={1.5} />
          </mesh>
        </group>
      ))}

      {/* Sun Corona */}
      <Billboard>
        <mesh position={[0, 0, -1]}>
          <planeGeometry args={[8, 8]} />
          <shaderMaterial
            transparent
            depthWrite={false}
            uniforms={{ color: { value: new THREE.Color("#39ff14") } }}
            vertexShader={`
              varying vec2 vUv;
              void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `}
            fragmentShader={`
              varying vec2 vUv;
              uniform vec3 color;
              void main() {
                float dist = distance(vUv, vec2(0.5));
                float alpha = smoothstep(0.5, 0.0, dist) * 0.13;
                gl_FragColor = vec4(color, alpha);
              }
            `}
          />
        </mesh>
      </Billboard>
    </mesh>
  );
}

function TextAsteroid({ data }) {
  const groupRef = useRef();
  const textRef = useRef();
  const [hovered, setHovered] = useState(false);
  const isTool = ["Git", "MySQL", "MongoDB"].includes(data.label);

  const angleRef = useRef(data.angle);

  useFrame((state) => {
    angleRef.current += data.orbitSpeed;
    if (groupRef.current) {
      groupRef.current.position.x = Math.cos(angleRef.current) * data.r;
      groupRef.current.position.z = Math.sin(angleRef.current) * data.r;
      groupRef.current.quaternion.copy(state.camera.quaternion);
    }
    
    if (textRef.current) {
      const targetZ = hovered ? 0.5 : 0;
      textRef.current.position.z += (targetZ - textRef.current.position.z) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <Text
        ref={textRef}
        fontSize={0.25}
        color={hovered ? '#ffffff' : (isTool ? "#fbbf24" : "#06b6d4")}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
      >
        {data.label}
      </Text>
    </group>
  );
}

function PlainAsteroid({ data }) {
  const meshRef = useRef();
  const angleRef = useRef(data.angle);

  useFrame(() => {
    angleRef.current += data.orbitSpeed;
    if (meshRef.current) {
      meshRef.current.position.x = Math.cos(angleRef.current) * data.r;
      meshRef.current.position.z = Math.sin(angleRef.current) * data.r;
      
      meshRef.current.rotation.x += data.rotSpeed.x;
      meshRef.current.rotation.y += data.rotSpeed.y;
      meshRef.current.rotation.z += data.rotSpeed.z;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[data.size, 0]} />
      <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={0.2} />
    </mesh>
  );
}

function AsteroidBelt() {
  const beltRef = useRef();
  
  const [asteroids] = useState(() => {
    const techSkills = ["Java", "Python", "C/C++", "Flask", "MySQL", "MongoDB", "Data Structures", "OOP", "React", "JavaScript", "Node.js", "Git"];
    const arr = [];
    for (let i = 0; i < 35; i++) {
      const isText = i < 12;
      const r = 12 + Math.random() * 5;
      const angle = Math.random() * Math.PI * 2;
      const orbitSpeed = (Math.random() - 0.5) * 0.005;
      
      if (isText) {
        arr.push({ id: i, isText, label: techSkills[i], r, angle, orbitSpeed });
      } else {
        arr.push({
          id: i, isText,
          size: Math.random() * 0.13 + 0.05,
          r, angle, orbitSpeed,
          rotSpeed: {
            x: (Math.random() - 0.5) * 0.05,
            y: (Math.random() - 0.5) * 0.05,
            z: (Math.random() - 0.5) * 0.05
          }
        });
      }
    }
    return arr;
  });

  useFrame(() => {
    if (beltRef.current) {
      beltRef.current.rotation.y += 0.0005; 
    }
  });

  return (
    <group ref={beltRef}>
      {asteroids.map((data) => 
        data.isText ? <TextAsteroid key={data.id} data={data} /> : <PlainAsteroid key={data.id} data={data} />
      )}
    </group>
  );
}

function GyroScene({ isMobile, children }) {
  const { beta, gamma, hasGyro } = useGyroscope(isMobile);
  const groupRef = useRef();

  useFrame(() => {
    if (isMobile && hasGyro && groupRef.current) {
      // Map range: -45deg to 45deg input → -0.8 to 0.8 radians output
      const targetX = Math.max(-0.8, Math.min(0.8, (beta / 45) * 0.8));
      const targetY = Math.max(-0.8, Math.min(0.8, (gamma / 45) * 0.8));
      
      groupRef.current.rotation.x = targetX;
      groupRef.current.rotation.y = targetY;
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

export default function SolarSystem3D({ isMobile }) {
  const containerRef = useRef();
  const isVisible = useIsVisible(containerRef, 0.05);
  const { hasGyro } = useGyroscope(isMobile);

  return (
    <div 
      ref={containerRef}
      style={{
        position: "relative",
        width: isMobile ? "350px" : "520px",
        height: isMobile ? "350px" : "520px",
        marginTop: isMobile ? "-80px" : "-130px",
        marginBottom: isMobile ? "-80px" : "-130px",
        animation: "fadeUp 1.2s ease both 0.3s"
      }}
    >
      {isVisible && (
        <Canvas camera={{ position: [0, 8, 22], fov: 45 }}>
          <ambientLight intensity={0.1} color="#ffffff" />
          <Stars count={5000} color="#39ff14" fade />

          <OrbitControls 
            enabled={!(isMobile && hasGyro)}
            enableZoom={false} 
            enablePan={false} 
            autoRotate={!(isMobile && hasGyro)} 
            autoRotateSpeed={0.4} 
          />

          <GyroScene isMobile={isMobile}>
            <Sun isMobile={isMobile} />

            {planets.map((p) => (
              <Planet key={p.id} {...p} isMobile={isMobile} />
            ))}

            <AsteroidBelt />
          </GyroScene>
        </Canvas>
      )}
    </div>
  );
}
