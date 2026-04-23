'use client';

// Dynamic 3D golf ball component that reacts to scroll progress
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture, MeshDistortMaterial, Float } from '@react-three/drei';
import { useScroll } from 'framer-motion';
import { interpolateBall } from '@/lib/ballKeyframes';
import * as THREE from 'three';

export function GolfBall({ isMobile }: { isMobile: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const entranceX = useRef(-5); // Start off-screen left
  const texture = useTexture('/icon.webp');
  
  // Track global scroll progress (0 to 1)
  const { scrollYProgress } = useScroll();

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Smooth entrance from left on mount (independent of scroll)
    entranceX.current = THREE.MathUtils.lerp(entranceX.current, 0, delta * 2.5);

    // Fetch interpolated state based on current scroll
    const ballState = interpolateBall(scrollYProgress.get());

    // Apply transforms (combining scroll state + entrance offset)
    meshRef.current.position.x = (ballState.x + entranceX.current) * (isMobile ? 0.5 : 1);
    meshRef.current.position.y = ballState.y;
    const s = ballState.scale * (isMobile ? 0.7 : 1);
    meshRef.current.scale.set(s, s, s);
    
    // Incremental rotation based on keyframes
    meshRef.current.rotation.y = ballState.ry;
    meshRef.current.rotation.x = ballState.rx;
  });

  return (
    <Float 
      speed={1.5} 
      rotationIntensity={0.5} 
      floatIntensity={0.3}
    >
      <mesh ref={meshRef} castShadow receiveShadow>
        {/* Higher segments on desktop for maximum visual fidelity */}
        <sphereGeometry args={[1, isMobile ? 32 : 64, isMobile ? 32 : 64]} />
        <MeshDistortMaterial 
          map={texture}
          bumpMap={texture}
          bumpScale={0.05}
          color="#f2f2f2" 
          envMapIntensity={0.85}
          clearcoat={0.2}
          clearcoatRoughness={0.2}
          roughness={0.4}
          metalness={0.05}
          distort={0.12} 
          speed={2} 
        />
      </mesh>
    </Float>
  );
}
