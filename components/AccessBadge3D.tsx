'use client';
import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, RoundedBox, Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

function Card() {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHover] = useState(false);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    
    // Mouvement idle
    groupRef.current.rotation.z = Math.sin(t / 4) * 0.02;
    
    if (hovered) {
       const x = (state.pointer.x * Math.PI) / 10;
       const y = (state.pointer.y * Math.PI) / 10;
       groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, x, 0.1);
       groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -y, 0.1);
    } else {
       groupRef.current.rotation.y = Math.sin(t / 2) * 0.05;
       groupRef.current.rotation.x = Math.cos(t / 2) * 0.05;
    }
  });

  // --- CONFIGURATION DES POLICES ---
  // Assurez-vous d'avoir mis le fichier dans /public/fonts/
  const titleFont = "/fonts/Anton-Regular.ttf"; 

  return (
    <group 
      ref={groupRef} 
      onPointerOver={() => setHover(true)} 
      onPointerOut={() => setHover(false)}
    >
      {/* CORPS DE LA CARTE (Noir Mat) */}
      <RoundedBox args={[2.6, 4.2, 0.1]} radius={0.15} smoothness={4}>
        <meshStandardMaterial color="#111111" roughness={0.8} metalness={0.1} />
      </RoundedBox>

      {/* BANDE DÉCO */}
      <mesh position={[0, 0, 0.051]}>
         <planeGeometry args={[2.4, 4]} />
         <meshStandardMaterial color="#1a1a1a" roughness={1} opacity={0.5} transparent />
      </mesh>

      {/* LED ROUGE */}
      <group position={[1, 1.8, 0.06]}>
        <mesh>
          <circleGeometry args={[0.08, 32]} />
          <meshBasicMaterial color="#FF0000" toneMapped={false} />
        </mesh>
        <pointLight color="#FF0000" intensity={3} distance={1} decay={2} />
      </group>

      {/* TEXTES */}
      <group position={[0, 0, 0.07]}>
        
        {/* "MEMBRE" */}
        <Text 
          position={[-1.0, 0.5, 0]} 
          fontSize={0.12} 
          color="#666" 
          anchorX="left"
          font={titleFont} // Utilise Anton local
          letterSpacing={0.1}
        >
          MEMBRE
        </Text>

        {/* "FREE" */}
        <Text
          position={[-1.05, -0.1, 0]}
          fontSize={0.55}
          color="#ffffff"
          anchorX="left"
          font={titleFont}
        >
          FREE
        </Text>

        {/* "ACCESS" */}
        <Text
          position={[-1.0, -0.7, 0]}
          fontSize={0.35}
          color="#FF3300"
          anchorX="left"
          font={titleFont}
        >
          ACCESS
        </Text>

        {/* LIGNE */}
        <mesh position={[0, -1.2, 0]}>
           <planeGeometry args={[2.2, 0.01]} />
           <meshBasicMaterial color="#333" />
        </mesh>

        {/* INFO BAS (Police par défaut = Plus stable) */}
        <group position={[0, -1.6, 0]}>
          <Text position={[-1.0, 0.2, 0]} fontSize={0.09} color="#555" anchorX="left">ID: 8842-192</Text>
          <Text position={[1.0, 0.2, 0]} fontSize={0.09} color="#fff" anchorX="right">ILLIMITÉ</Text>
          
          <Text position={[-1.0, -0.05, 0]} fontSize={0.09} color="#555" anchorX="left">VALID: 2025</Text>
          <Text position={[1.0, -0.05, 0]} fontSize={0.09} color="#FF3300" anchorX="right">06:00 - 22:00</Text>
        </group>

      </group>

      {/* LOGO SANS CONTACT */}
      <group position={[0.9, -0.8, 0.06]}>
         <mesh rotation={[0,0, -Math.PI/4]}>
            <ringGeometry args={[0.2, 0.23, 32, 1, Math.PI/2, Math.PI]} />
            <meshBasicMaterial color="#222" />
         </mesh>
         <mesh rotation={[0,0, -Math.PI/4]}>
            <ringGeometry args={[0.35, 0.38, 32, 1, Math.PI/2, Math.PI]} />
            <meshBasicMaterial color="#222" />
         </mesh>
      </group>

    </group>
  );
}

export default function AccessBadge3D() {
  return (
    <div className="w-full h-[500px] md:h-[600px] relative z-10 flex items-center justify-center">
      <Canvas 
        camera={{ position: [0, 0, 6.5], fov: 45 }} 
        gl={{ alpha: true, antialias: true }}
      >
        <Environment preset="city" />
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
        <pointLight position={[-10, -10, 5]} intensity={0.5} color="#FF3300" />
        
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5} floatingRange={[-0.1, 0.1]}>
          <Card />
        </Float>
      </Canvas>
    </div>
  );
}