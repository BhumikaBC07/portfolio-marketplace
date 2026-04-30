'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';

function FloatingPlane({ position, rotation, scale }: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
}) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.x += 0.001;
    mesh.current.rotation.y += 0.002;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh ref={mesh} position={position} rotation={rotation} scale={scale}>
        <planeGeometry args={[1.2, 1.6, 1, 1]} />
        <meshStandardMaterial
          color="#e6ddd0"
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
    </Float>
  );
}

function FloatingBox({ position, rotation, scale }: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
}) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    mesh.current.rotation.y += 0.005;
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.6}>
      <mesh ref={mesh} position={position} rotation={rotation} scale={scale}>
        <boxGeometry args={[1, 1.4, 0.05]} />
        <meshStandardMaterial
          color="#d8d0c4"
          transparent
          opacity={0.5}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
    </Float>
  );
}

function FloatingRing({ position, scale }: {
  position: [number, number, number];
  scale: number;
}) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.x = state.clock.elapsedTime * 0.2;
    mesh.current.rotation.z = state.clock.elapsedTime * 0.15;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={mesh} position={position} scale={scale}>
        <torusGeometry args={[0.6, 0.04, 16, 64]} />
        <meshStandardMaterial
          color="#c8bcac"
          transparent
          opacity={0.4}
          roughness={0.5}
        />
      </mesh>
    </Float>
  );
}

function Scene() {
  const shapes = useMemo(() => [
    { type: 'plane', position: [-3.5, 1.2, -2] as [number, number, number], rotation: [0.2, 0.4, 0.1] as [number, number, number], scale: 1.2 },
    { type: 'box', position: [3.2, -0.5, -3] as [number, number, number], rotation: [0.1, -0.3, 0.2] as [number, number, number], scale: 1 },
    { type: 'plane', position: [2.8, 1.8, -1.5] as [number, number, number], rotation: [-0.1, 0.2, -0.15] as [number, number, number], scale: 0.8 },
    { type: 'ring', position: [-2.5, -1, -2.5] as [number, number, number], rotation: [0, 0, 0] as [number, number, number], scale: 1.5 },
    { type: 'box', position: [-4, -1.5, -4] as [number, number, number], rotation: [0.3, 0.1, -0.2] as [number, number, number], scale: 0.9 },
    { type: 'plane', position: [4.5, 0.5, -3.5] as [number, number, number], rotation: [0.4, -0.2, 0.3] as [number, number, number], scale: 1.1 },
    { type: 'ring', position: [1, -2, -1] as [number, number, number], rotation: [0, 0, 0] as [number, number, number], scale: 0.8 },
    { type: 'box', position: [-1.5, 2.5, -3] as [number, number, number], rotation: [-0.2, 0.5, 0.1] as [number, number, number], scale: 0.7 },
  ], []);

  return (
    <>
      <ambientLight intensity={0.8} color="#f9f5ef" />
      <directionalLight position={[5, 5, 5]} intensity={0.6} color="#f0ebe0" />
      <directionalLight position={[-5, -3, -5]} intensity={0.3} color="#d8d0c4" />
      {shapes.map((shape, i) => {
        if (shape.type === 'plane') {
          return <FloatingPlane key={i} position={shape.position} rotation={shape.rotation} scale={shape.scale} />;
        } else if (shape.type === 'box') {
          return <FloatingBox key={i} position={shape.position} rotation={shape.rotation} scale={shape.scale} />;
        } else {
          return <FloatingRing key={i} position={shape.position} scale={shape.scale} />;
        }
      })}
    </>
  );
}

export default function Hero3D() {
  return (
    <div className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
