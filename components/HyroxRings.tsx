'use client';
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function Ring({ radius, color, speed, rotX, rotY }: { radius: number, color: string, speed: number, rotX: number, rotY: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime();
      ref.current.rotation.x = rotX + Math.sin(t * speed) * 0.2;
      ref.current.rotation.y = rotY + t * speed * 0.5;
    }
  });

  return (
    <mesh ref={ref}>
      {/* On utilise un Tube (Torus) assez fin */}
      <torusGeometry args={[radius, 0.04, 16, 100]} />
      {/* MeshBasicMaterial est TOUJOURS visible, même sans lumière */}
      <meshBasicMaterial color={color} wireframe={true} transparent opacity={0.5} />
    </mesh>
  );
}

export default function HyroxRings() {
  return (
    // MODIFICATION ICI : On enlève '-z-10' et on met 'z-0'
    <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 45 }} 
        gl={{ alpha: true, antialias: true }}
      >
        <group rotation={[0, 0, Math.PI / 6]}>
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            {/* Anneaux Rouge Vif */}
            <Ring radius={3.5} speed={0.4} rotX={1} rotY={0} color="#FF3300" />
            <Ring radius={2.5} speed={0.6} rotX={0} rotY={1} color="#FF3300" />
            <Ring radius={4.5} speed={0.2} rotX={0.5} rotY={0.5} color="#CC0000" />
          </Float>
        </group>
        
        {/* Poussière d'étoiles */}
        <Sparkles count={100} scale={10} size={4} speed={0.4} opacity={0.5} color="#FF3300" />
      </Canvas>
    </div>
  );
}