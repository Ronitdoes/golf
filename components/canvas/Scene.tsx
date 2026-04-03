'use client';

import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import { GolfBall } from './GolfBall';

export default function Scene() {
  const [isMobile, setIsMobile] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (hasError) {
    return (
      <div className="fixed inset-0 bg-[#070707] flex items-center justify-center p-6 text-center z-[-1]">
        <div className="max-w-md space-y-4">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">3D Scene Unavailable</h3>
          <p className="text-neutral-400 text-sm leading-relaxed">Your device or browser might not support WebGL. You can still subscribe and manage your scores through the dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 w-full h-[100svh] z-0 pointer-events-none bg-[#070707]">
      <Canvas 
        shadows 
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true }}
        onCreated={({ gl }) => {
          if (!gl.getContext()) setHasError(true);
        }}
        onError={() => setHasError(true)}
      >
        <Suspense fallback={null}>
          <GolfBall isMobile={isMobile} />
          
          <Environment preset="city" />
          
          <ambientLight intensity={0.15} />
          <spotLight 
            position={[5, 5, 5]} 
            angle={0.15} 
            penumbra={1} 
            intensity={1.0} 
            castShadow 
          />

          <ContactShadows 
            position={[0, -2, 0]} 
            opacity={0.4} 
            scale={10} 
            blur={2.5} 
            far={4} 
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
