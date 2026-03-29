import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type { PlayerState } from "./backend.d";
import { useActor } from "./hooks/useActor";

// ── Types ──────────────────────────────────────────────────────────────────
interface CarState {
  x: number;
  z: number;
  angle: number;
  speed: number;
  wheelRot: number;
}

interface Controls {
  gas: boolean;
  brake: boolean;
  left: boolean;
  right: boolean;
}

type CarBrand = "BMW" | "Audi" | "Lamborghini" | "Bugatti";
type CameraMode = "follow" | "front" | "left" | "right" | "top";

// ── Seeded RNG ─────────────────────────────────────────────────────────────
function makeRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ── BMW Car ────────────────────────────────────────────────────────────────
function BMWCar({
  carRef,
  position,
  rotation,
}: {
  carRef?: React.MutableRefObject<CarState>;
  position?: [number, number, number];
  rotation?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const wheelRefs = useRef<THREE.Mesh[]>([]);
  const setWheelRef = (i: number) => (el: THREE.Mesh | null) => {
    if (el) wheelRefs.current[i] = el;
  };

  useFrame(() => {
    if (!groupRef.current) return;
    if (carRef) {
      const state = carRef.current;
      groupRef.current.position.set(state.x, 0, state.z);
      groupRef.current.rotation.y = state.angle + Math.PI / 2;
      for (const w of wheelRefs.current)
        if (w) w.rotation.x -= state.speed * 0.05;
    }
  });

  return (
    <group
      ref={groupRef}
      position={carRef ? undefined : position}
      rotation={carRef ? undefined : [0, rotation ?? 0, 0]}
    >
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[4.5, 0.6, 2.0]} />
        <meshStandardMaterial color="#d0d8e8" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.1, 0.98, 0]} castShadow>
        <boxGeometry args={[2.4, 0.65, 1.72]} />
        <meshStandardMaterial
          color="#b8c2d4"
          metalness={0.7}
          roughness={0.25}
        />
      </mesh>
      <mesh position={[1.6, 0.55, 0]} castShadow>
        <boxGeometry args={[1.4, 0.12, 1.9]} />
        <meshStandardMaterial color="#c8d2e4" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[2.32, 0.28, 0]} castShadow>
        <boxGeometry args={[0.18, 0.28, 2.1]} />
        <meshStandardMaterial color="#5a6070" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[-2.32, 0.28, 0]} castShadow>
        <boxGeometry args={[0.18, 0.28, 2.1]} />
        <meshStandardMaterial color="#5a6070" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[2.31, 0.44, 0.32]}>
        <boxGeometry args={[0.06, 0.2, 0.28]} />
        <meshStandardMaterial
          color="#111418"
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>
      <mesh position={[2.31, 0.44, -0.32]}>
        <boxGeometry args={[0.06, 0.2, 0.28]} />
        <meshStandardMaterial
          color="#111418"
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>
      <mesh position={[1.18, 0.96, 0]} rotation={[0, 0, -0.42]}>
        <boxGeometry args={[0.06, 0.68, 1.62]} />
        <meshStandardMaterial
          color="#88aacc"
          transparent
          opacity={0.45}
          metalness={0.1}
          roughness={0.05}
        />
      </mesh>
      <mesh position={[-1.08, 0.96, 0]} rotation={[0, 0, 0.42]}>
        <boxGeometry args={[0.06, 0.62, 1.58]} />
        <meshStandardMaterial
          color="#88aacc"
          transparent
          opacity={0.4}
          metalness={0.1}
          roughness={0.05}
        />
      </mesh>
      <mesh position={[2.24, 0.52, 0.72]}>
        <boxGeometry args={[0.12, 0.15, 0.32]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffcc"
          emissiveIntensity={3}
        />
      </mesh>
      <mesh position={[2.24, 0.52, -0.72]}>
        <boxGeometry args={[0.12, 0.15, 0.32]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffcc"
          emissiveIntensity={3}
        />
      </mesh>
      <mesh position={[-2.24, 0.52, 0.72]}>
        <boxGeometry args={[0.12, 0.14, 0.44]} />
        <meshStandardMaterial
          color="#ff2222"
          emissive="#ff0000"
          emissiveIntensity={2}
        />
      </mesh>
      <mesh position={[-2.24, 0.52, -0.72]}>
        <boxGeometry args={[0.12, 0.14, 0.44]} />
        <meshStandardMaterial
          color="#ff2222"
          emissive="#ff0000"
          emissiveIntensity={2}
        />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[4.2, 0.1, 1.8]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>
      {(
        [
          [1.55, 1.05],
          [1.55, -1.05],
          [-1.55, 1.05],
          [-1.55, -1.05],
        ] as [number, number][]
      ).map(([wx, wz], i) => (
        <group key={`${wx}-${wz}`} position={[wx, 0.38, wz]}>
          <mesh ref={setWheelRef(i)} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.38, 0.38, 0.25, 16]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.24, 0.24, 0.26, 8]} />
            <meshStandardMaterial
              color="#888888"
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ── Audi Car ───────────────────────────────────────────────────────────────
function AudiCar({
  carRef,
  position,
  rotation,
}: {
  carRef?: React.MutableRefObject<CarState>;
  position?: [number, number, number];
  rotation?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const wheelRefs = useRef<THREE.Mesh[]>([]);
  const setWheelRef = (i: number) => (el: THREE.Mesh | null) => {
    if (el) wheelRefs.current[i] = el;
  };

  useFrame(() => {
    if (!groupRef.current) return;
    if (carRef) {
      const state = carRef.current;
      groupRef.current.position.set(state.x, 0, state.z);
      groupRef.current.rotation.y = state.angle + Math.PI / 2;
      for (const w of wheelRefs.current)
        if (w) w.rotation.x -= state.speed * 0.05;
    }
  });

  return (
    <group
      ref={groupRef}
      position={carRef ? undefined : position}
      rotation={carRef ? undefined : [0, rotation ?? 0, 0]}
    >
      {/* Sleek silver body */}
      <mesh position={[0, 0.42, 0]} castShadow>
        <boxGeometry args={[4.6, 0.55, 1.95]} />
        <meshStandardMaterial
          color="#c8c8c8"
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>
      {/* Fastback cabin */}
      <mesh position={[0.2, 0.94, 0]} castShadow>
        <boxGeometry args={[2.5, 0.6, 1.7]} />
        <meshStandardMaterial
          color="#aaaaaa"
          metalness={0.85}
          roughness={0.18}
        />
      </mesh>
      {/* Single-frame wide grille */}
      <mesh position={[2.3, 0.38, 0]}>
        <boxGeometry args={[0.08, 0.3, 1.8]} />
        <meshStandardMaterial
          color="#111111"
          metalness={0.95}
          roughness={0.1}
        />
      </mesh>
      {/* LED strip headlights */}
      <mesh position={[2.28, 0.55, 0.65]}>
        <boxGeometry args={[0.1, 0.06, 0.5]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ddeeff"
          emissiveIntensity={4}
        />
      </mesh>
      <mesh position={[2.28, 0.55, -0.65]}>
        <boxGeometry args={[0.1, 0.06, 0.5]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ddeeff"
          emissiveIntensity={4}
        />
      </mesh>
      {/* Audi rings badge */}
      <mesh position={[2.32, 0.44, 0]}>
        <boxGeometry args={[0.04, 0.12, 0.6]} />
        <meshStandardMaterial color="#cccccc" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Taillights */}
      <mesh position={[-2.28, 0.5, 0.7]}>
        <boxGeometry args={[0.1, 0.1, 0.55]} />
        <meshStandardMaterial
          color="#ff3333"
          emissive="#ff0000"
          emissiveIntensity={2}
        />
      </mesh>
      <mesh position={[-2.28, 0.5, -0.7]}>
        <boxGeometry args={[0.1, 0.1, 0.55]} />
        <meshStandardMaterial
          color="#ff3333"
          emissive="#ff0000"
          emissiveIntensity={2}
        />
      </mesh>
      {/* Windshield */}
      <mesh position={[1.2, 0.95, 0]} rotation={[0, 0, -0.38]}>
        <boxGeometry args={[0.06, 0.65, 1.6]} />
        <meshStandardMaterial color="#99bbdd" transparent opacity={0.4} />
      </mesh>
      {/* Bumpers */}
      <mesh position={[2.35, 0.25, 0]}>
        <boxGeometry args={[0.15, 0.22, 2.0]} />
        <meshStandardMaterial color="#666666" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[-2.35, 0.25, 0]}>
        <boxGeometry args={[0.15, 0.22, 2.0]} />
        <meshStandardMaterial color="#666666" metalness={0.6} roughness={0.3} />
      </mesh>
      {(
        [
          [1.6, 1.0],
          [1.6, -1.0],
          [-1.6, 1.0],
          [-1.6, -1.0],
        ] as [number, number][]
      ).map(([wx, wz], i) => (
        <group key={`${wx}-${wz}`} position={[wx, 0.36, wz]}>
          <mesh ref={setWheelRef(i)} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.36, 0.36, 0.26, 16]} />
            <meshStandardMaterial color="#111111" roughness={0.9} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.22, 0.22, 0.27, 10]} />
            <meshStandardMaterial
              color="#999999"
              metalness={0.85}
              roughness={0.2}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ── Lamborghini Car ────────────────────────────────────────────────────────
function LamborghiniCar({
  carRef,
  position,
  rotation,
}: {
  carRef?: React.MutableRefObject<CarState>;
  position?: [number, number, number];
  rotation?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const wheelRefs = useRef<THREE.Mesh[]>([]);
  const setWheelRef = (i: number) => (el: THREE.Mesh | null) => {
    if (el) wheelRefs.current[i] = el;
  };

  useFrame(() => {
    if (!groupRef.current) return;
    if (carRef) {
      const state = carRef.current;
      groupRef.current.position.set(state.x, 0, state.z);
      groupRef.current.rotation.y = state.angle + Math.PI / 2;
      for (const w of wheelRefs.current)
        if (w) w.rotation.x -= state.speed * 0.05;
    }
  });

  return (
    <group
      ref={groupRef}
      position={carRef ? undefined : position}
      rotation={carRef ? undefined : [0, rotation ?? 0, 0]}
    >
      {/* Ultra-low flat body */}
      <mesh position={[0, 0.28, 0]} castShadow>
        <boxGeometry args={[4.8, 0.38, 2.1]} />
        <meshStandardMaterial color="#ff8800" metalness={0.7} roughness={0.2} />
      </mesh>
      {/* Wedge front hood angled */}
      <mesh position={[1.8, 0.38, 0]} rotation={[0, 0, 0.25]} castShadow>
        <boxGeometry args={[1.5, 0.12, 2.0]} />
        <meshStandardMaterial color="#ff7700" metalness={0.7} roughness={0.2} />
      </mesh>
      {/* Low angular cabin */}
      <mesh position={[0, 0.64, 0]} castShadow>
        <boxGeometry args={[2.0, 0.45, 1.8]} />
        <meshStandardMaterial
          color="#cc6600"
          metalness={0.6}
          roughness={0.25}
        />
      </mesh>
      {/* Wide rear diffuser */}
      <mesh position={[-2.2, 0.2, 0]}>
        <boxGeometry args={[0.5, 0.18, 2.4]} />
        <meshStandardMaterial color="#222222" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Sharp headlights */}
      <mesh position={[2.42, 0.36, 0.8]}>
        <boxGeometry args={[0.1, 0.08, 0.3]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffff88"
          emissiveIntensity={5}
        />
      </mesh>
      <mesh position={[2.42, 0.36, -0.8]}>
        <boxGeometry args={[0.1, 0.08, 0.3]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffff88"
          emissiveIntensity={5}
        />
      </mesh>
      {/* Angular taillights */}
      <mesh position={[-2.42, 0.34, 0.8]}>
        <boxGeometry args={[0.1, 0.1, 0.45]} />
        <meshStandardMaterial
          color="#ff2222"
          emissive="#ff0000"
          emissiveIntensity={3}
        />
      </mesh>
      <mesh position={[-2.42, 0.34, -0.8]}>
        <boxGeometry args={[0.1, 0.1, 0.45]} />
        <meshStandardMaterial
          color="#ff2222"
          emissive="#ff0000"
          emissiveIntensity={3}
        />
      </mesh>
      {/* Side air intakes */}
      <mesh position={[0.5, 0.38, 1.06]}>
        <boxGeometry args={[0.8, 0.18, 0.06]} />
        <meshStandardMaterial color="#111111" metalness={0.9} />
      </mesh>
      <mesh position={[0.5, 0.38, -1.06]}>
        <boxGeometry args={[0.8, 0.18, 0.06]} />
        <meshStandardMaterial color="#111111" metalness={0.9} />
      </mesh>
      {/* Windshield very angled */}
      <mesh position={[1.0, 0.72, 0]} rotation={[0, 0, -0.6]}>
        <boxGeometry args={[0.06, 0.5, 1.7]} />
        <meshStandardMaterial color="#88aacc" transparent opacity={0.38} />
      </mesh>
      {(
        [
          [1.7, 1.08],
          [1.7, -1.08],
          [-1.7, 1.08],
          [-1.7, -1.08],
        ] as [number, number][]
      ).map(([wx, wz], i) => (
        <group key={`${wx}-${wz}`} position={[wx, 0.32, wz]}>
          <mesh ref={setWheelRef(i)} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.32, 0.32, 0.3, 16]} />
            <meshStandardMaterial color="#111111" roughness={0.9} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.2, 0.2, 0.31, 10]} />
            <meshStandardMaterial
              color="#777777"
              metalness={0.9}
              roughness={0.15}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ── Bugatti Car ────────────────────────────────────────────────────────────
function BugattiCar({
  carRef,
  position,
  rotation,
}: {
  carRef?: React.MutableRefObject<CarState>;
  position?: [number, number, number];
  rotation?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const wheelRefs = useRef<THREE.Mesh[]>([]);
  const setWheelRef = (i: number) => (el: THREE.Mesh | null) => {
    if (el) wheelRefs.current[i] = el;
  };

  useFrame(() => {
    if (!groupRef.current) return;
    if (carRef) {
      const state = carRef.current;
      groupRef.current.position.set(state.x, 0, state.z);
      groupRef.current.rotation.y = state.angle + Math.PI / 2;
      for (const w of wheelRefs.current)
        if (w) w.rotation.x -= state.speed * 0.05;
    }
  });

  return (
    <group
      ref={groupRef}
      position={carRef ? undefined : position}
      rotation={carRef ? undefined : [0, rotation ?? 0, 0]}
    >
      {/* Dark navy hypercar body */}
      <mesh position={[0, 0.38, 0]} castShadow>
        <boxGeometry args={[4.7, 0.5, 2.0]} />
        <meshStandardMaterial
          color="#0a0e2e"
          metalness={0.95}
          roughness={0.1}
        />
      </mesh>
      {/* Fastback cabin */}
      <mesh position={[0.1, 0.88, 0]} castShadow>
        <boxGeometry args={[2.3, 0.6, 1.75]} />
        <meshStandardMaterial
          color="#080c22"
          metalness={0.9}
          roughness={0.12}
        />
      </mesh>
      {/* Horseshoe grille (torus-like with multiple boxes) */}
      <mesh position={[2.34, 0.45, 0]}>
        <torusGeometry args={[0.28, 0.06, 8, 16, Math.PI]} />
        <meshStandardMaterial
          color="#aaaaaa"
          metalness={0.95}
          roughness={0.1}
        />
      </mesh>
      {/* Grille mesh dark center */}
      <mesh position={[2.32, 0.42, 0]}>
        <boxGeometry args={[0.06, 0.28, 0.48]} />
        <meshStandardMaterial color="#050812" metalness={0.9} />
      </mesh>
      {/* Massive side air intakes */}
      <mesh position={[0.4, 0.44, 1.05]}>
        <boxGeometry args={[1.2, 0.25, 0.07]} />
        <meshStandardMaterial color="#050812" metalness={0.9} />
      </mesh>
      <mesh position={[0.4, 0.44, -1.05]}>
        <boxGeometry args={[1.2, 0.25, 0.07]} />
        <meshStandardMaterial color="#050812" metalness={0.9} />
      </mesh>
      {/* Quad oval taillights */}
      <mesh position={[-2.35, 0.5, 0.6]}>
        <boxGeometry args={[0.08, 0.12, 0.22]} />
        <meshStandardMaterial
          color="#ff2200"
          emissive="#ff1100"
          emissiveIntensity={3}
        />
      </mesh>
      <mesh position={[-2.35, 0.5, 0.85]}>
        <boxGeometry args={[0.08, 0.12, 0.22]} />
        <meshStandardMaterial
          color="#ff2200"
          emissive="#ff1100"
          emissiveIntensity={3}
        />
      </mesh>
      <mesh position={[-2.35, 0.5, -0.6]}>
        <boxGeometry args={[0.08, 0.12, 0.22]} />
        <meshStandardMaterial
          color="#ff2200"
          emissive="#ff1100"
          emissiveIntensity={3}
        />
      </mesh>
      <mesh position={[-2.35, 0.5, -0.85]}>
        <boxGeometry args={[0.08, 0.12, 0.22]} />
        <meshStandardMaterial
          color="#ff2200"
          emissive="#ff1100"
          emissiveIntensity={3}
        />
      </mesh>
      {/* Headlights */}
      <mesh position={[2.3, 0.55, 0.7]}>
        <boxGeometry args={[0.1, 0.08, 0.35]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ccddff"
          emissiveIntensity={4}
        />
      </mesh>
      <mesh position={[2.3, 0.55, -0.7]}>
        <boxGeometry args={[0.1, 0.08, 0.35]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ccddff"
          emissiveIntensity={4}
        />
      </mesh>
      {/* Windshield */}
      <mesh position={[1.1, 0.9, 0]} rotation={[0, 0, -0.4]}>
        <boxGeometry args={[0.06, 0.62, 1.65]} />
        <meshStandardMaterial color="#7799cc" transparent opacity={0.42} />
      </mesh>
      {/* Blue accent stripe */}
      <mesh position={[0, 0.64, 0]}>
        <boxGeometry args={[4.6, 0.04, 0.08]} />
        <meshStandardMaterial
          color="#4466ff"
          emissive="#2244ff"
          emissiveIntensity={1}
        />
      </mesh>
      {(
        [
          [1.65, 1.05],
          [1.65, -1.05],
          [-1.65, 1.05],
          [-1.65, -1.05],
        ] as [number, number][]
      ).map(([wx, wz], i) => (
        <group key={`${wx}-${wz}`} position={[wx, 0.35, wz]}>
          <mesh ref={setWheelRef(i)} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.35, 0.35, 0.28, 16]} />
            <meshStandardMaterial color="#111111" roughness={0.9} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.21, 0.21, 0.29, 12]} />
            <meshStandardMaterial
              color="#888888"
              metalness={0.95}
              roughness={0.1}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ── Random 3D Shape Cars (parked decoration) ───────────────────────────────
function RandomShapeCar({
  position,
  rotation,
  colorSeed,
}: {
  position: [number, number, number];
  rotation: number;
  colorSeed: number;
}) {
  const rng = makeRng(colorSeed * 1234);
  const hue = Math.floor(rng() * 360);
  const color = `hsl(${hue}, 70%, 50%)`;
  const shapeType = Math.floor(rng() * 4);

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {shapeType === 0 && (
        <>
          <mesh position={[0, 0.5, 0]} castShadow>
            <boxGeometry args={[3.5, 0.7, 1.8]} />
            <meshStandardMaterial
              color={color}
              metalness={0.6}
              roughness={0.3}
            />
          </mesh>
          <mesh position={[0.2, 1.1, 0]} castShadow>
            <sphereGeometry args={[0.6, 8, 6]} />
            <meshStandardMaterial
              color={color}
              metalness={0.5}
              roughness={0.35}
            />
          </mesh>
        </>
      )}
      {shapeType === 1 && (
        <>
          <mesh position={[0, 0.45, 0]} castShadow>
            <boxGeometry args={[4.0, 0.5, 1.9]} />
            <meshStandardMaterial
              color={color}
              metalness={0.7}
              roughness={0.2}
            />
          </mesh>
          <mesh position={[0, 0.9, 0]} castShadow>
            <cylinderGeometry args={[0.7, 0.9, 0.55, 8]} />
            <meshStandardMaterial
              color={color}
              metalness={0.6}
              roughness={0.25}
            />
          </mesh>
        </>
      )}
      {shapeType === 2 && (
        <>
          <mesh position={[0, 0.42, 0]} castShadow>
            <boxGeometry args={[3.8, 0.45, 2.0]} />
            <meshStandardMaterial
              color={color}
              metalness={0.8}
              roughness={0.15}
            />
          </mesh>
          <mesh position={[0.1, 0.85, 0]} castShadow>
            <boxGeometry args={[1.8, 0.5, 1.75]} />
            <meshStandardMaterial
              color={color}
              metalness={0.75}
              roughness={0.18}
            />
          </mesh>
        </>
      )}
      {shapeType === 3 && (
        <>
          <mesh position={[0, 0.55, 0]} castShadow>
            <cylinderGeometry args={[0.9, 1.1, 0.8, 8]} />
            <meshStandardMaterial
              color={color}
              metalness={0.6}
              roughness={0.3}
            />
          </mesh>
          <mesh position={[0, 1.1, 0]} castShadow>
            <coneGeometry args={[0.7, 0.8, 6]} />
            <meshStandardMaterial
              color={color}
              metalness={0.5}
              roughness={0.35}
            />
          </mesh>
        </>
      )}
      {/* Wheels for all shapes */}
      {(
        [
          [1.2, 0.9],
          [1.2, -0.9],
          [-1.2, 0.9],
          [-1.2, -0.9],
        ] as [number, number][]
      ).map(([wx, wz]) => (
        <mesh
          key={`w${wx}-${wz}`}
          position={[wx, 0.32, wz]}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        >
          <cylinderGeometry args={[0.32, 0.32, 0.24, 10]} />
          <meshStandardMaterial color="#111111" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

// ── Car renderer helper ────────────────────────────────────────────────────
function CarMesh({
  brand,
  carRef,
  position,
  rotation,
}: {
  brand: CarBrand;
  carRef?: React.MutableRefObject<CarState>;
  position?: [number, number, number];
  rotation?: number;
}) {
  if (brand === "BMW")
    return <BMWCar carRef={carRef} position={position} rotation={rotation} />;
  if (brand === "Audi")
    return <AudiCar carRef={carRef} position={position} rotation={rotation} />;
  if (brand === "Lamborghini")
    return (
      <LamborghiniCar carRef={carRef} position={position} rotation={rotation} />
    );
  return <BugattiCar carRef={carRef} position={position} rotation={rotation} />;
}

// ── Parked cars data ───────────────────────────────────────────────────────
const BRANDS: CarBrand[] = ["BMW", "Audi", "Lamborghini", "Bugatti"];
const PARKED_CARS = (() => {
  const rng = makeRng(77);
  const cars: Array<{
    x: number;
    z: number;
    rotation: number;
    brand: CarBrand;
    shapeVariant: boolean;
  }> = [];
  for (let i = 0; i < 20; i++) {
    let x = 0;
    let z = 0;
    do {
      x = (rng() - 0.5) * 180;
      z = (rng() - 0.5) * 180;
    } while (Math.abs(x) < 25 && Math.abs(z) < 25);
    const brand = BRANDS[Math.floor(rng() * 4)];
    const shapeVariant = rng() > 0.65;
    cars.push({ x, z, rotation: rng() * Math.PI * 2, brand, shapeVariant });
  }
  return cars;
})();

function ParkedCars() {
  return (
    <>
      {PARKED_CARS.map((c, i) =>
        c.shapeVariant ? (
          <RandomShapeCar
            key={`s-${c.x.toFixed(1)}-${c.z.toFixed(1)}`}
            position={[c.x, 0, c.z]}
            rotation={c.rotation}
            colorSeed={i + 100}
          />
        ) : (
          <CarMesh
            key={`c-${c.x.toFixed(1)}-${c.z.toFixed(1)}`}
            brand={c.brand}
            position={[c.x, 0, c.z]}
            rotation={c.rotation}
          />
        ),
      )}
    </>
  );
}

// ── Near-car highlight indicator ───────────────────────────────────────────
function NearCarIndicator({
  carX,
  carZ,
  active,
}: { carX: number; carZ: number; active: boolean }) {
  if (!active) return null;
  return (
    <mesh position={[carX, 2.5, carZ]}>
      <sphereGeometry args={[0.3, 8, 8]} />
      <meshStandardMaterial
        color="#00ff88"
        emissive="#00ff44"
        emissiveIntensity={3}
      />
    </mesh>
  );
}

// ── Buildings with windows ─────────────────────────────────────────────────
const BUILDING_DATA = (() => {
  const buildings: Array<{
    x: number;
    z: number;
    w: number;
    d: number;
    h: number;
    color: string;
  }> = [];
  const colors = ["#9a9888", "#d4c8b0", "#3a3a3a", "#c8b898", "#8a6858"];
  const rng = makeRng(42);
  for (let i = 0; i < 40; i++) {
    let x = 0;
    let z = 0;
    do {
      x = (rng() - 0.5) * 180;
      z = (rng() - 0.5) * 180;
    } while (Math.abs(x) < 22 && Math.abs(z) < 22);
    const w = 5 + rng() * 10;
    const d = 5 + rng() * 10;
    const h = 4 + rng() * 26;
    buildings.push({
      x,
      z,
      w,
      d,
      h,
      color: colors[Math.floor(rng() * colors.length)],
    });
  }
  return buildings;
})();

function BuildingWithWindows({
  x,
  z,
  w,
  d,
  h,
  color,
}: { x: number; z: number; w: number; d: number; h: number; color: string }) {
  // Generate window grid for front and side faces
  const windowsX: React.ReactElement[] = [];
  const colsX = Math.max(1, Math.floor(w / 2.5));
  const rows = Math.max(1, Math.floor(h / 3));
  for (let c = 0; c < colsX; c++) {
    for (let r = 0; r < rows; r++) {
      const wx = -w / 2 + (c + 0.5) * (w / colsX);
      const wy = 1.5 + r * (h / rows);
      if (wy > h - 0.5) continue;
      windowsX.push(
        <mesh key={`f${c}-${r}`} position={[wx, wy, d / 2 + 0.05]}>
          <boxGeometry args={[0.7, 0.9, 0.05]} />
          <meshStandardMaterial
            color="#fffaa0"
            emissive="#ffee55"
            emissiveIntensity={1.2}
          />
        </mesh>,
      );
      windowsX.push(
        <mesh key={`b${c}-${r}`} position={[wx, wy, -d / 2 - 0.05]}>
          <boxGeometry args={[0.7, 0.9, 0.05]} />
          <meshStandardMaterial
            color="#fffaa0"
            emissive="#ffee55"
            emissiveIntensity={1.2}
          />
        </mesh>,
      );
    }
  }
  const colsZ = Math.max(1, Math.floor(d / 2.5));
  for (let c = 0; c < colsZ; c++) {
    for (let r = 0; r < rows; r++) {
      const wz = -d / 2 + (c + 0.5) * (d / colsZ);
      const wy = 1.5 + r * (h / rows);
      if (wy > h - 0.5) continue;
      windowsX.push(
        <mesh key={`l${c}-${r}`} position={[w / 2 + 0.05, wy, wz]}>
          <boxGeometry args={[0.05, 0.9, 0.7]} />
          <meshStandardMaterial
            color="#fffaa0"
            emissive="#ffee55"
            emissiveIntensity={1.2}
          />
        </mesh>,
      );
      windowsX.push(
        <mesh key={`r${c}-${r}`} position={[-w / 2 - 0.05, wy, wz]}>
          <boxGeometry args={[0.05, 0.9, 0.7]} />
          <meshStandardMaterial
            color="#fffaa0"
            emissive="#ffee55"
            emissiveIntensity={1.2}
          />
        </mesh>,
      );
    }
  }

  return (
    <group position={[x, h / 2, z]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={color} roughness={0.85} metalness={0.1} />
      </mesh>
      {windowsX}
      {/* Rooftop detail */}
      <mesh position={[0, h / 2 + 0.5, 0]}>
        <boxGeometry args={[w * 0.4, 1.0, d * 0.4]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      <mesh position={[w * 0.2, h / 2 + 0.4, d * 0.2]}>
        <boxGeometry args={[0.6, 0.8, 0.6]} />
        <meshStandardMaterial color="#555" roughness={0.8} />
      </mesh>
    </group>
  );
}

function Buildings() {
  return (
    <>
      {BUILDING_DATA.map((b) => (
        <BuildingWithWindows key={`${b.x}-${b.z}`} {...b} />
      ))}
    </>
  );
}

// ── Pedestrian NPC ─────────────────────────────────────────────────────────
const NPC_COLORS = [
  "#e74c3c",
  "#3498db",
  "#2ecc71",
  "#f39c12",
  "#9b59b6",
  "#1abc9c",
  "#e67e22",
  "#00cec9",
];
const NPC_DATA = (() => {
  const rng = makeRng(99);
  return Array.from({ length: 12 }, (_, i) => ({
    startX: (rng() - 0.5) * 120,
    startZ: (rng() - 0.5) * 120,
    color: NPC_COLORS[i % NPC_COLORS.length],
    speed: 1.2 + rng() * 0.6,
    wanderSeed: Math.floor(rng() * 9999),
  }));
})();

function Pedestrian({
  startX,
  startZ,
  color,
  speed,
  wanderSeed,
}: {
  startX: number;
  startZ: number;
  color: string;
  speed: number;
  wanderSeed: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const pos = useRef(new THREE.Vector3(startX, 0, startZ));
  const target = useRef(new THREE.Vector3(startX + 10, 0, startZ + 10));
  const nextWander = useRef(0);
  const rng = useRef(makeRng(wanderSeed));
  const facingAngle = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const now = performance.now() / 1000;
    if (now > nextWander.current) {
      const r = rng.current;
      target.current.set(
        pos.current.x + (r() - 0.5) * 30,
        0,
        pos.current.z + (r() - 0.5) * 30,
      );
      target.current.x = Math.max(-95, Math.min(95, target.current.x));
      target.current.z = Math.max(-95, Math.min(95, target.current.z));
      nextWander.current = now + 3 + r() * 2;
    }
    const dir = new THREE.Vector3().subVectors(target.current, pos.current);
    const dist = dir.length();
    if (dist > 0.5) {
      dir.normalize();
      pos.current.addScaledVector(dir, speed * delta);
      facingAngle.current = Math.atan2(dir.x, dir.z);
    }
    groupRef.current.position.copy(pos.current);
    groupRef.current.rotation.y = facingAngle.current;
  });

  return (
    <group ref={groupRef}>
      {/* Head */}
      <mesh position={[0, 1.85, 0]} castShadow>
        <sphereGeometry args={[0.22, 8, 8]} />
        <meshStandardMaterial color="#f4c07a" roughness={0.8} />
      </mesh>
      {/* Body */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[0.4, 0.8, 0.25]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* Left arm */}
      <mesh position={[0.3, 1.1, 0]} castShadow>
        <boxGeometry args={[0.15, 0.7, 0.15]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* Right arm */}
      <mesh position={[-0.3, 1.1, 0]} castShadow>
        <boxGeometry args={[0.15, 0.7, 0.15]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* Left leg */}
      <mesh position={[0.12, 0.4, 0]} castShadow>
        <boxGeometry args={[0.18, 0.75, 0.2]} />
        <meshStandardMaterial color="#2c3e50" roughness={0.9} />
      </mesh>
      {/* Right leg */}
      <mesh position={[-0.12, 0.4, 0]} castShadow>
        <boxGeometry args={[0.18, 0.75, 0.2]} />
        <meshStandardMaterial color="#2c3e50" roughness={0.9} />
      </mesh>
    </group>
  );
}

function NPCs() {
  return (
    <>
      {NPC_DATA.map((npc) => (
        <Pedestrian
          key={`npc-${npc.startX.toFixed(1)}-${npc.startZ.toFixed(1)}`}
          {...npc}
        />
      ))}
    </>
  );
}

// ── Real Online Players (from backend) ────────────────────────────────────
const PLAYER_COLORS = ["#00aaff", "#ff44aa", "#44ffaa", "#ffaa00", "#aa44ff"];

function RealOnlinePlayerMesh({
  player,
  index,
}: { player: PlayerState; index: number }) {
  const color = PLAYER_COLORS[index % PLAYER_COLORS.length];
  return (
    <group
      position={[player.x, player.y, player.z]}
      rotation={[0, player.rotation, 0]}
    >
      {/* Head */}
      <mesh position={[0, 1.85, 0]} castShadow>
        <sphereGeometry args={[0.24, 8, 8]} />
        <meshStandardMaterial color="#f4c07a" roughness={0.8} />
      </mesh>
      {/* Torso - blue hoodie (different from local player's red) */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[0.42, 0.8, 0.26]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* Arms */}
      <mesh position={[0.32, 1.1, 0]} castShadow>
        <boxGeometry args={[0.15, 0.7, 0.15]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      <mesh position={[-0.32, 1.1, 0]} castShadow>
        <boxGeometry args={[0.15, 0.7, 0.15]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* Legs */}
      <mesh position={[0.12, 0.4, 0]} castShadow>
        <boxGeometry args={[0.18, 0.75, 0.2]} />
        <meshStandardMaterial color="#222244" roughness={0.9} />
      </mesh>
      <mesh position={[-0.12, 0.4, 0]} castShadow>
        <boxGeometry args={[0.18, 0.75, 0.2]} />
        <meshStandardMaterial color="#222244" roughness={0.9} />
      </mesh>
      {/* Name tag glow */}
      <mesh position={[0, 2.4, 0]}>
        <boxGeometry args={[1.0, 0.3, 0.05]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2}
          transparent
          opacity={0.85}
        />
      </mesh>
      <pointLight
        position={[0, 2.5, 0]}
        color={color}
        intensity={2}
        distance={6}
      />
    </group>
  );
}

function RealOnlinePlayers({ players }: { players: PlayerState[] }) {
  return (
    <>
      {players.map((p, i) => (
        <RealOnlinePlayerMesh key={p.id} player={p} index={i} />
      ))}
    </>
  );
}

// ── Player character (on foot) ─────────────────────────────────────────────
function PlayerCharacter({
  playerPosRef,
  controlsRef,
}: {
  playerPosRef: React.MutableRefObject<{ x: number; z: number; angle: number }>;
  controlsRef: React.MutableRefObject<Controls>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const walkTimeRef = useRef(0);
  const speedRef = useRef(0);

  // Limb refs
  const leftUpperLegRef = useRef<THREE.Group>(null);
  const rightUpperLegRef = useRef<THREE.Group>(null);
  const leftUpperArmRef = useRef<THREE.Group>(null);
  const rightUpperArmRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Position / facing
    groupRef.current.position.set(
      playerPosRef.current.x,
      0,
      playerPosRef.current.z,
    );
    groupRef.current.rotation.y = playerPosRef.current.angle;

    // Determine movement speed from controls
    const ctrl = controlsRef.current;
    const moving = ctrl.gas || ctrl.brake || ctrl.left || ctrl.right;
    const targetSpeed = moving ? (ctrl.gas || ctrl.brake ? 3.5 : 1.5) : 0;
    speedRef.current +=
      (targetSpeed - speedRef.current) * Math.min(delta * 8, 1);
    const spd = speedRef.current;

    // Walk cycle
    if (spd > 0.1) walkTimeRef.current += delta * spd * 3.5;

    const amp = spd > 2.5 ? 0.55 : spd > 0.1 ? 0.35 : 0;
    const swing = Math.sin(walkTimeRef.current) * amp;

    // Directional lean
    const leanTarget = ctrl.gas ? -0.08 : ctrl.brake ? 0.06 : 0;
    groupRef.current.rotation.x +=
      (leanTarget - groupRef.current.rotation.x) * Math.min(delta * 6, 1);

    // Animate legs
    if (leftUpperLegRef.current) leftUpperLegRef.current.rotation.x = swing;
    if (rightUpperLegRef.current) rightUpperLegRef.current.rotation.x = -swing;
    // Arms counter-phase
    if (leftUpperArmRef.current)
      leftUpperArmRef.current.rotation.x = -swing * 0.7;
    if (rightUpperArmRef.current)
      rightUpperArmRef.current.rotation.x = swing * 0.7;
  });

  return (
    <group ref={groupRef}>
      {/* === HEAD === */}
      <mesh position={[0, 2.05, 0]} castShadow>
        <sphereGeometry args={[0.28, 10, 10]} />
        <meshStandardMaterial color="#f4c07a" roughness={0.75} />
      </mesh>
      {/* Hair */}
      <mesh position={[0, 2.3, -0.02]}>
        <boxGeometry args={[0.52, 0.14, 0.5]} />
        <meshStandardMaterial color="#3d1a00" roughness={0.9} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 1.77, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.1, 0.16, 8]} />
        <meshStandardMaterial color="#f4c07a" roughness={0.75} />
      </mesh>

      {/* === TORSO === */}
      <mesh position={[0, 1.28, 0]} castShadow>
        <boxGeometry args={[0.52, 0.72, 0.3]} />
        <meshStandardMaterial color="#e74c3c" roughness={0.7} />
      </mesh>
      {/* Belt */}
      <mesh position={[0, 0.91, 0]}>
        <boxGeometry args={[0.54, 0.07, 0.32]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
      </mesh>

      {/* === LEFT ARM === */}
      {/* Pivot at shoulder */}
      <group ref={leftUpperArmRef} position={[0.34, 1.58, 0]}>
        {/* Upper arm */}
        <mesh position={[0, -0.19, 0]} castShadow>
          <boxGeometry args={[0.16, 0.38, 0.16]} />
          <meshStandardMaterial color="#e74c3c" roughness={0.7} />
        </mesh>
        {/* Lower arm */}
        <mesh position={[0, -0.52, 0]} castShadow>
          <boxGeometry args={[0.14, 0.34, 0.14]} />
          <meshStandardMaterial color="#f4c07a" roughness={0.75} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.72, 0]} castShadow>
          <sphereGeometry args={[0.08, 6, 6]} />
          <meshStandardMaterial color="#f4c07a" roughness={0.75} />
        </mesh>
      </group>

      {/* === RIGHT ARM === */}
      <group ref={rightUpperArmRef} position={[-0.34, 1.58, 0]}>
        <mesh position={[0, -0.19, 0]} castShadow>
          <boxGeometry args={[0.16, 0.38, 0.16]} />
          <meshStandardMaterial color="#e74c3c" roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.52, 0]} castShadow>
          <boxGeometry args={[0.14, 0.34, 0.14]} />
          <meshStandardMaterial color="#f4c07a" roughness={0.75} />
        </mesh>
        <mesh position={[0, -0.72, 0]} castShadow>
          <sphereGeometry args={[0.08, 6, 6]} />
          <meshStandardMaterial color="#f4c07a" roughness={0.75} />
        </mesh>
      </group>

      {/* === LEFT LEG === pivot at hip */}
      <group ref={leftUpperLegRef} position={[0.14, 0.87, 0]}>
        {/* Upper leg */}
        <mesh position={[0, -0.22, 0]} castShadow>
          <boxGeometry args={[0.2, 0.44, 0.22]} />
          <meshStandardMaterial color="#1a3a6a" roughness={0.85} />
        </mesh>
        {/* Shin */}
        <mesh position={[0, -0.58, 0]} castShadow>
          <boxGeometry args={[0.17, 0.38, 0.2]} />
          <meshStandardMaterial color="#1a3a6a" roughness={0.85} />
        </mesh>
        {/* Shoe */}
        <mesh position={[0, -0.82, 0.04]} castShadow>
          <boxGeometry args={[0.2, 0.1, 0.3]} />
          <meshStandardMaterial color="#111111" roughness={0.9} />
        </mesh>
      </group>

      {/* === RIGHT LEG === */}
      <group ref={rightUpperLegRef} position={[-0.14, 0.87, 0]}>
        <mesh position={[0, -0.22, 0]} castShadow>
          <boxGeometry args={[0.2, 0.44, 0.22]} />
          <meshStandardMaterial color="#1a3a6a" roughness={0.85} />
        </mesh>
        <mesh position={[0, -0.58, 0]} castShadow>
          <boxGeometry args={[0.17, 0.38, 0.2]} />
          <meshStandardMaterial color="#1a3a6a" roughness={0.85} />
        </mesh>
        <mesh position={[0, -0.82, 0.04]} castShadow>
          <boxGeometry args={[0.2, 0.1, 0.3]} />
          <meshStandardMaterial color="#111111" roughness={0.9} />
        </mesh>
      </group>

      {/* Green arrow indicator above head */}
      <mesh position={[0, 2.75, 0]}>
        <coneGeometry args={[0.2, 0.5, 6]} />
        <meshStandardMaterial
          color="#00ff88"
          emissive="#00ff44"
          emissiveIntensity={2}
        />
      </mesh>
    </group>
  );
}

// ── Camera Controller ──────────────────────────────────────────────────────
function CameraController({
  carRef,
  playerPosRef,
  inCar,
  cameraMode,
}: {
  carRef: React.MutableRefObject<CarState>;
  playerPosRef: React.MutableRefObject<{ x: number; z: number; angle: number }>;
  inCar: boolean;
  cameraMode: CameraMode;
}) {
  const { camera } = useThree();
  const camPos = useRef(new THREE.Vector3(0, 5, -10));

  useFrame(() => {
    const px = inCar ? carRef.current.x : playerPosRef.current.x;
    const pz = inCar ? carRef.current.z : playerPosRef.current.z;
    const angle = inCar ? carRef.current.angle : playerPosRef.current.angle;

    let targetPos: THREE.Vector3;
    if (cameraMode === "follow") {
      const ox = -Math.sin(angle) * 10;
      const oz = -Math.cos(angle) * 10;
      targetPos = new THREE.Vector3(px + ox, 5, pz + oz);
    } else if (cameraMode === "front") {
      const ox = Math.sin(angle) * 10;
      const oz = Math.cos(angle) * 10;
      targetPos = new THREE.Vector3(px + ox, 4, pz + oz);
    } else if (cameraMode === "left") {
      const ox = -Math.cos(angle) * 10;
      const oz = Math.sin(angle) * 10;
      targetPos = new THREE.Vector3(px + ox, 5, pz + oz);
    } else if (cameraMode === "right") {
      const ox = Math.cos(angle) * 10;
      const oz = -Math.sin(angle) * 10;
      targetPos = new THREE.Vector3(px + ox, 5, pz + oz);
    } else {
      // top
      targetPos = new THREE.Vector3(px, 22, pz);
    }

    camPos.current.lerp(targetPos, 0.08);
    camera.position.copy(camPos.current);
    camera.lookAt(px, 1, pz);
  });

  return null;
}

// ── Physics Controller ─────────────────────────────────────────────────────
function PhysicsController({
  carRef,
  controlsRef,
  inCar,
  playerPosRef,
}: {
  carRef: React.MutableRefObject<CarState>;
  controlsRef: React.MutableRefObject<Controls>;
  inCar: boolean;
  playerPosRef: React.MutableRefObject<{ x: number; z: number; angle: number }>;
}) {
  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const ctrl = controlsRef.current;

    if (inCar) {
      const state = carRef.current;
      if (ctrl.gas) state.speed = Math.min(state.speed + 8 * dt, 20);
      else if (ctrl.brake) {
        if (state.speed > 0) state.speed = Math.max(0, state.speed - 12 * dt);
        else state.speed = Math.max(state.speed - 5 * dt, -8);
      } else {
        state.speed *= 0.97;
        if (Math.abs(state.speed) < 0.05) state.speed = 0;
      }
      if (Math.abs(state.speed) > 0.5) {
        const dir = state.speed > 0 ? 1 : -1;
        if (ctrl.left) state.angle += 1.8 * dt * dir;
        if (ctrl.right) state.angle -= 1.8 * dt * dir;
      }
      state.x += Math.sin(state.angle) * state.speed * dt;
      state.z += Math.cos(state.angle) * state.speed * dt;
      state.x = Math.max(-98, Math.min(98, state.x));
      state.z = Math.max(-98, Math.min(98, state.z));
      state.wheelRot += state.speed * dt;
    } else {
      // On-foot movement
      const walkSpeed = 5;
      const player = playerPosRef.current;
      const moving = ctrl.gas || ctrl.brake || ctrl.left || ctrl.right;
      if (moving) {
        let dx = 0;
        let dz = 0;
        if (ctrl.gas) {
          dx += Math.sin(player.angle);
          dz += Math.cos(player.angle);
        }
        if (ctrl.brake) {
          dx -= Math.sin(player.angle);
          dz -= Math.cos(player.angle);
        }
        if (ctrl.left) player.angle += 2 * dt;
        if (ctrl.right) player.angle -= 2 * dt;
        const len = Math.sqrt(dx * dx + dz * dz);
        if (len > 0) {
          player.x += (dx / len) * walkSpeed * dt;
          player.z += (dz / len) * walkSpeed * dt;
        }
        player.x = Math.max(-98, Math.min(98, player.x));
        player.z = Math.max(-98, Math.min(98, player.z));
      }
    }
  });

  return null;
}

// ── Ground ─────────────────────────────────────────────────────────────────
function Ground() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 200, 40, 40]} />
        <meshStandardMaterial color="#4a4a3a" roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[200, 200, 20, 20]} />
        <meshStandardMaterial
          color="#5a6a40"
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
}

// ── Sun ────────────────────────────────────────────────────────────────────
function Sun() {
  return (
    <mesh position={[60, 18, 50]}>
      <sphereGeometry args={[4, 16, 16]} />
      <meshBasicMaterial color="#fff5aa" />
      <pointLight color="#ffee88" intensity={30} distance={300} />
    </mesh>
  );
}

// ── Scene ──────────────────────────────────────────────────────────────────
function Scene({
  carRef,
  controlsRef,
  inCar,
  cameraMode,
  playerPosRef,
  selectedBrand,
  nearestParkedIdx,
  onlinePlayers,
}: {
  carRef: React.MutableRefObject<CarState>;
  controlsRef: React.MutableRefObject<Controls>;
  inCar: boolean;
  cameraMode: CameraMode;
  playerPosRef: React.MutableRefObject<{ x: number; z: number; angle: number }>;
  selectedBrand: CarBrand;
  nearestParkedIdx: number | null;
  onlinePlayers: PlayerState[];
}) {
  const { scene } = useThree();
  useEffect(() => {
    scene.background = new THREE.Color("#f9c97a");
    scene.fog = new THREE.FogExp2("#f9e0a0", 0.007);
  }, [scene]);

  return (
    <>
      <ambientLight intensity={0.8} color="#ffe4b0" />
      <directionalLight
        position={[60, 12, 40]}
        intensity={2.5}
        color="#ffcc55"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={200}
        shadow-camera-left={-80}
        shadow-camera-right={80}
        shadow-camera-top={80}
        shadow-camera-bottom={-80}
      />
      <directionalLight
        position={[-40, 20, -30]}
        intensity={0.35}
        color="#aaddff"
      />
      <Sun />
      <Ground />
      <Buildings />
      <ParkedCars />
      <NPCs />
      <RealOnlinePlayers players={onlinePlayers} />
      {inCar ? (
        <CarMesh brand={selectedBrand} carRef={carRef} />
      ) : (
        <PlayerCharacter
          playerPosRef={playerPosRef}
          controlsRef={controlsRef}
        />
      )}
      {/* Near car indicator */}
      {nearestParkedIdx !== null && (
        <NearCarIndicator
          carX={PARKED_CARS[nearestParkedIdx].x}
          carZ={PARKED_CARS[nearestParkedIdx].z}
          active={true}
        />
      )}
      <CameraController
        carRef={carRef}
        playerPosRef={playerPosRef}
        inCar={inCar}
        cameraMode={cameraMode}
      />
      <PhysicsController
        carRef={carRef}
        controlsRef={controlsRef}
        inCar={inCar}
        playerPosRef={playerPosRef}
      />
    </>
  );
}

// ── HUD Speed / Gear ───────────────────────────────────────────────────────
function SpeedHUD({
  carRef,
  inCar,
}: { carRef: React.MutableRefObject<CarState>; inCar: boolean }) {
  const [displaySpeed, setDisplaySpeed] = useState(0);
  const [gear, setGear] = useState("N");

  useEffect(() => {
    let raf: number;
    const update = () => {
      const spd = inCar ? carRef.current.speed : 0;
      const kmh = Math.round(Math.abs(spd) * 18);
      setDisplaySpeed(kmh);
      if (spd < -0.5) setGear("R");
      else if (Math.abs(spd) < 0.5) setGear("N");
      else if (kmh < 30) setGear("1");
      else if (kmh < 60) setGear("2");
      else if (kmh < 100) setGear("3");
      else if (kmh < 150) setGear("4");
      else setGear("5");
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [carRef, inCar]);

  return (
    <div
      style={{
        position: "absolute",
        top: 16,
        left: 16,
        background: "rgba(0,0,0,0.6)",
        border: "1px solid rgba(100,180,255,0.3)",
        borderRadius: 10,
        padding: "10px 18px",
        color: "#fff",
        fontFamily: "monospace",
        backdropFilter: "blur(4px)",
        userSelect: "none",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          fontSize: 10,
          color: "#88aacc",
          letterSpacing: 2,
          marginBottom: 2,
        }}
      >
        SPEED
      </div>
      <div
        style={{
          fontSize: 36,
          fontWeight: 700,
          lineHeight: 1,
          color: "#e8f4ff",
        }}
      >
        {displaySpeed}
        <span style={{ fontSize: 11, color: "#88aacc", marginLeft: 4 }}>
          km/h
        </span>
      </div>
      <div style={{ marginTop: 4, display: "flex", gap: 6 }}>
        <span style={{ fontSize: 10, color: "#88aacc" }}>GEAR</span>
        <span
          style={{
            fontSize: 16,
            fontWeight: 700,
            color:
              gear === "R" ? "#ff5555" : gear === "N" ? "#ffaa44" : "#44ff88",
          }}
        >
          {gear}
        </span>
      </div>
    </div>
  );
}

// ── Styles helper ──────────────────────────────────────────────────────────
const btnBase: React.CSSProperties = {
  background: "rgba(0,0,0,0.6)",
  border: "2px solid rgba(100,180,255,0.4)",
  borderRadius: 12,
  color: "#fff",
  fontWeight: 700,
  fontSize: 12,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  gap: 2,
  userSelect: "none",
  touchAction: "none",
  cursor: "pointer",
  backdropFilter: "blur(6px)",
  WebkitUserSelect: "none",
};

// ── Touch Controls ─────────────────────────────────────────────────────────
function TouchControls({
  controlsRef,
}: { controlsRef: React.MutableRefObject<Controls> }) {
  const prevent = (e: React.PointerEvent) => e.preventDefault();
  return (
    <>
      <div
        style={{
          position: "absolute",
          bottom: 130,
          left: 20,
          display: "flex",
          gap: 10,
        }}
      >
        <div
          data-ocid="game.left.button"
          style={{ ...btnBase, width: 66, height: 66, borderColor: "#4488cc" }}
          onPointerDown={(e) => {
            prevent(e);
            controlsRef.current.left = true;
          }}
          onPointerUp={() => {
            controlsRef.current.left = false;
          }}
          onPointerLeave={() => {
            controlsRef.current.left = false;
          }}
        >
          <span style={{ fontSize: 26 }}>◀</span>
          <span>LEFT</span>
        </div>
        <div
          data-ocid="game.right.button"
          style={{ ...btnBase, width: 66, height: 66, borderColor: "#4488cc" }}
          onPointerDown={(e) => {
            prevent(e);
            controlsRef.current.right = true;
          }}
          onPointerUp={() => {
            controlsRef.current.right = false;
          }}
          onPointerLeave={() => {
            controlsRef.current.right = false;
          }}
        >
          <span style={{ fontSize: 26 }}>▶</span>
          <span>RIGHT</span>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 120,
          right: 20,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <div
          data-ocid="game.brake.button"
          style={{ ...btnBase, width: 76, height: 58, borderColor: "#cc3333" }}
          onPointerDown={(e) => {
            prevent(e);
            controlsRef.current.brake = true;
          }}
          onPointerUp={() => {
            controlsRef.current.brake = false;
          }}
          onPointerLeave={() => {
            controlsRef.current.brake = false;
          }}
        >
          <span style={{ fontSize: 20 }}>⬇</span>
          <span>BRAKE</span>
        </div>
        <div
          data-ocid="game.gas.button"
          style={{ ...btnBase, width: 84, height: 76, borderColor: "#33cc66" }}
          onPointerDown={(e) => {
            prevent(e);
            controlsRef.current.gas = true;
          }}
          onPointerUp={() => {
            controlsRef.current.gas = false;
          }}
          onPointerLeave={() => {
            controlsRef.current.gas = false;
          }}
        >
          <span style={{ fontSize: 28 }}>⬆</span>
          <span>GAS</span>
        </div>
      </div>
    </>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────
export default function App() {
  const carRef = useRef<CarState>({
    x: 0,
    z: 0,
    angle: 0,
    speed: 0,
    wheelRot: 0,
  });
  const controlsRef = useRef<Controls>({
    gas: false,
    brake: false,
    left: false,
    right: false,
  });
  const playerPosRef = useRef({ x: 5, z: 5, angle: 0 });

  const [inCar, setInCar] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<CarBrand>("BMW");
  const [cameraMode, setCameraMode] = useState<CameraMode>("follow");
  const [nearestParkedIdx, setNearestParkedIdx] = useState<number | null>(null);
  const [canEnterCar, setCanEnterCar] = useState(false);

  // ── Multiplayer state ────────────────────────────────────────────────────
  const { actor: _rawActor } = useActor();
  const actor = _rawActor as import("./backend.d").backendInterface | null;
  const [lobbyVisible, setLobbyVisible] = useState(true);
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [myPlayerId, setMyPlayerId] = useState<string | null>(null);
  const [onlinePlayers, setOnlinePlayers] = useState<PlayerState[]>([]);
  const [lobbyLoading, setLobbyLoading] = useState(false);
  const [lobbyError, setLobbyError] = useState<string | null>(null);
  const [joinCodeInput, setJoinCodeInput] = useState("");
  const [lobbyTab, setLobbyTab] = useState<"create" | "join">("create");
  const [createdCode, setCreatedCode] = useState<string | null>(null);

  // Find nearest parked car from player position
  const findNearestCar = useCallback(() => {
    const px = playerPosRef.current.x;
    const pz = playerPosRef.current.z;
    let bestDist = 9999;
    let bestIdx: number | null = null;
    PARKED_CARS.forEach((c, i) => {
      const dist = Math.sqrt((c.x - px) ** 2 + (c.z - pz) ** 2);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
      }
    });
    if (bestDist < 7 && bestIdx !== null) {
      setNearestParkedIdx(bestIdx);
      setCanEnterCar(true);
    } else {
      setNearestParkedIdx(null);
      setCanEnterCar(false);
    }
  }, []);

  // Poll nearest car while on foot
  useEffect(() => {
    if (inCar) return;
    const interval = setInterval(findNearestCar, 300);
    return () => clearInterval(interval);
  }, [inCar, findNearestCar]);

  const enterCar = useCallback(() => {
    if (!canEnterCar || nearestParkedIdx === null) return;
    const c = PARKED_CARS[nearestParkedIdx];
    carRef.current.x = c.x;
    carRef.current.z = c.z;
    carRef.current.angle = c.rotation - Math.PI / 2;
    carRef.current.speed = 0;
    setInCar(true);
  }, [canEnterCar, nearestParkedIdx]);

  const exitCar = useCallback(() => {
    playerPosRef.current.x = carRef.current.x + 2.5;
    playerPosRef.current.z = carRef.current.z + 2.5;
    playerPosRef.current.angle = carRef.current.angle;
    carRef.current.speed = 0;
    setInCar(false);
  }, []);

  // Keyboard controls
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (e.key === "w" || e.key === "W" || e.key === "ArrowUp")
        controlsRef.current.gas = true;
      if (e.key === "s" || e.key === "S" || e.key === "ArrowDown")
        controlsRef.current.brake = true;
      if (e.key === "a" || e.key === "A" || e.key === "ArrowLeft")
        controlsRef.current.left = true;
      if (e.key === "d" || e.key === "D" || e.key === "ArrowRight")
        controlsRef.current.right = true;
      if (e.key === "e" || e.key === "E") {
        if (inCar) exitCar();
        else if (canEnterCar) enterCar();
      }
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)
      )
        e.preventDefault();
    };
    const onUp = (e: KeyboardEvent) => {
      if (e.key === "w" || e.key === "W" || e.key === "ArrowUp")
        controlsRef.current.gas = false;
      if (e.key === "s" || e.key === "S" || e.key === "ArrowDown")
        controlsRef.current.brake = false;
      if (e.key === "a" || e.key === "A" || e.key === "ArrowLeft")
        controlsRef.current.left = false;
      if (e.key === "d" || e.key === "D" || e.key === "ArrowRight")
        controlsRef.current.right = false;
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, [inCar, canEnterCar, enterCar, exitCar]);

  // ── Multiplayer lobby handlers ───────────────────────────────────────────
  const handleCreateRoom = useCallback(async () => {
    if (!actor || !playerName.trim()) return;
    setLobbyLoading(true);
    setLobbyError(null);
    try {
      const code = await actor.createRoom(playerName.trim());
      setCreatedCode(code);
      setRoomCode(code);
      const me = await actor.getMyPlayer();
      if (me && me.__kind__ === "Some") setMyPlayerId(me.value.id);
    } catch (_e) {
      setLobbyError("Failed to create room. Try again.");
    } finally {
      setLobbyLoading(false);
    }
  }, [actor, playerName]);

  const handleJoinRoom = useCallback(async () => {
    if (!actor || !playerName.trim() || !joinCodeInput.trim()) return;
    setLobbyLoading(true);
    setLobbyError(null);
    try {
      const ok = await actor.joinRoom(
        joinCodeInput.trim().toUpperCase(),
        playerName.trim(),
      );
      if (!ok) {
        setLobbyError("Room not found. Check the code.");
        return;
      }
      setRoomCode(joinCodeInput.trim().toUpperCase());
      const me = await actor.getMyPlayer();
      if (me && me.__kind__ === "Some") setMyPlayerId(me.value.id);
    } catch (_e) {
      setLobbyError("Failed to join room. Try again.");
    } finally {
      setLobbyLoading(false);
    }
  }, [actor, playerName, joinCodeInput]);

  const handleEnterGame = useCallback(() => {
    if (!roomCode) return;
    setLobbyVisible(false);
  }, [roomCode]);

  // Poll players in room every 1000ms while in-game
  useEffect(() => {
    if (lobbyVisible || !roomCode || !actor) return;
    const poll = async () => {
      try {
        const players = await actor.getPlayersInRoom(roomCode);
        setOnlinePlayers(players.filter((p) => p.id !== myPlayerId));
      } catch {
        /* ignore */
      }
    };
    poll();
    const id = setInterval(poll, 1000);
    return () => clearInterval(id);
  }, [lobbyVisible, roomCode, actor, myPlayerId]);

  // Sync local player position every 800ms while in-game
  useEffect(() => {
    if (lobbyVisible || !roomCode || !actor) return;
    const sync = async () => {
      try {
        const px = inCar ? carRef.current.x : playerPosRef.current.x;
        const pz = inCar ? carRef.current.z : playerPosRef.current.z;
        const rot = inCar ? carRef.current.angle : playerPosRef.current.angle;
        await actor.updatePosition(px, 0, pz, rot);
      } catch {
        /* ignore */
      }
    };
    const id = setInterval(sync, 800);
    return () => {
      clearInterval(id);
      if (actor && roomCode) actor.leaveRoom().catch(() => {});
    };
  }, [lobbyVisible, roomCode, actor, inCar]);

  const BRAND_COLORS: Record<CarBrand, string> = {
    BMW: "#4488cc",
    Audi: "#aaaaaa",
    Lamborghini: "#ff8800",
    Bugatti: "#4444cc",
  };

  const CAM_BUTTONS: { mode: CameraMode; icon: string; label: string }[] = [
    { mode: "follow", icon: "🔄", label: "Follow" },
    { mode: "front", icon: "👁️", label: "Front" },
    { mode: "left", icon: "◀", label: "Left" },
    { mode: "right", icon: "▶", label: "Right" },
    { mode: "top", icon: "⬆", label: "Top" },
  ];

  return (
    <div
      style={{
        width: "100dvw",
        height: "100dvh",
        overflow: "hidden",
        position: "relative",
        background: "#f9c97a",
        touchAction: "none",
      }}
    >
      {/* Multiplayer Lobby Overlay */}
      {lobbyVisible && (
        <div
          data-ocid="lobby.modal"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 100,
            background:
              "linear-gradient(180deg, #0a0a0f 0%, #14141e 60%, #0a0a0f 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "monospace",
            color: "#fff",
            padding: 24,
          }}
        >
          {/* Title */}
          <div
            style={{
              marginBottom: 8,
              fontSize: 11,
              color: "#ff4444",
              letterSpacing: 6,
              textTransform: "uppercase",
            }}
          >
            Rockstar Games Presents
          </div>
          <div
            style={{
              fontSize: 48,
              fontWeight: 900,
              letterSpacing: 4,
              color: "#ffcc00",
              textShadow: "0 0 40px #ff880088",
              marginBottom: 4,
            }}
          >
            URBAN CHAOS
          </div>
          <div
            style={{
              fontSize: 13,
              color: "#88aacc",
              marginBottom: 32,
              letterSpacing: 2,
            }}
          >
            ONLINE MULTIPLAYER
          </div>

          {/* Card */}
          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12,
              padding: 28,
              width: "100%",
              maxWidth: 380,
            }}
          >
            {/* Player name */}
            <div style={{ marginBottom: 20 }}>
              <label
                htmlFor="lobby-player-name"
                style={{
                  fontSize: 11,
                  color: "#88aacc",
                  letterSpacing: 2,
                  display: "block",
                  marginBottom: 6,
                }}
              >
                PLAYER NAME
              </label>
              <input
                id="lobby-player-name"
                data-ocid="lobby.input"
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name..."
                maxLength={20}
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,200,0,0.4)",
                  borderRadius: 6,
                  padding: "10px 14px",
                  color: "#fff",
                  fontFamily: "monospace",
                  fontSize: 15,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Tab selector */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              <button
                type="button"
                data-ocid="lobby.create.tab"
                onClick={() => setLobbyTab("create")}
                style={{
                  flex: 1,
                  padding: "8px 0",
                  background:
                    lobbyTab === "create"
                      ? "rgba(255,200,0,0.2)"
                      : "transparent",
                  border: `1px solid ${lobbyTab === "create" ? "#ffcc00" : "rgba(255,255,255,0.15)"}`,
                  borderRadius: 6,
                  color: lobbyTab === "create" ? "#ffcc00" : "#888",
                  fontFamily: "monospace",
                  fontSize: 12,
                  letterSpacing: 1,
                  cursor: "pointer",
                }}
              >
                CREATE ROOM
              </button>
              <button
                type="button"
                data-ocid="lobby.join.tab"
                onClick={() => setLobbyTab("join")}
                style={{
                  flex: 1,
                  padding: "8px 0",
                  background:
                    lobbyTab === "join" ? "rgba(0,200,255,0.2)" : "transparent",
                  border: `1px solid ${lobbyTab === "join" ? "#00ccff" : "rgba(255,255,255,0.15)"}`,
                  borderRadius: 6,
                  color: lobbyTab === "join" ? "#00ccff" : "#888",
                  fontFamily: "monospace",
                  fontSize: 12,
                  letterSpacing: 1,
                  cursor: "pointer",
                }}
              >
                JOIN ROOM
              </button>
            </div>

            {lobbyTab === "create" ? (
              <div>
                {createdCode ? (
                  <div style={{ textAlign: "center", marginBottom: 16 }}>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#88aacc",
                        marginBottom: 6,
                        letterSpacing: 2,
                      }}
                    >
                      ROOM CODE — SHARE WITH FRIENDS
                    </div>
                    <div
                      style={{
                        fontSize: 32,
                        fontWeight: 900,
                        color: "#ffcc00",
                        letterSpacing: 8,
                        textShadow: "0 0 20px #ffcc0066",
                      }}
                    >
                      {createdCode}
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    data-ocid="lobby.create.primary_button"
                    onClick={handleCreateRoom}
                    disabled={!playerName.trim() || lobbyLoading}
                    style={{
                      width: "100%",
                      padding: "12px 0",
                      background: playerName.trim()
                        ? "rgba(255,200,0,0.25)"
                        : "rgba(255,255,255,0.04)",
                      border: `1px solid ${playerName.trim() ? "#ffcc00" : "rgba(255,255,255,0.1)"}`,
                      borderRadius: 8,
                      color: playerName.trim() ? "#ffcc00" : "#444",
                      fontFamily: "monospace",
                      fontSize: 14,
                      letterSpacing: 2,
                      cursor: playerName.trim() ? "pointer" : "not-allowed",
                      marginBottom: 12,
                    }}
                  >
                    {lobbyLoading ? "CREATING..." : "CREATE ROOM"}
                  </button>
                )}
              </div>
            ) : (
              <div style={{ marginBottom: 12 }}>
                <input
                  data-ocid="lobby.join.input"
                  type="text"
                  value={joinCodeInput}
                  onChange={(e) =>
                    setJoinCodeInput(e.target.value.toUpperCase())
                  }
                  placeholder="ROOM CODE"
                  maxLength={8}
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(0,200,255,0.4)",
                    borderRadius: 6,
                    padding: "10px 14px",
                    color: "#00ccff",
                    fontFamily: "monospace",
                    fontSize: 18,
                    letterSpacing: 6,
                    outline: "none",
                    boxSizing: "border-box",
                    marginBottom: 10,
                    textAlign: "center",
                  }}
                />
                <button
                  type="button"
                  data-ocid="lobby.join.primary_button"
                  onClick={handleJoinRoom}
                  disabled={
                    !playerName.trim() || !joinCodeInput.trim() || lobbyLoading
                  }
                  style={{
                    width: "100%",
                    padding: "12px 0",
                    background:
                      playerName.trim() && joinCodeInput.trim()
                        ? "rgba(0,200,255,0.2)"
                        : "rgba(255,255,255,0.04)",
                    border: `1px solid ${playerName.trim() && joinCodeInput.trim() ? "#00ccff" : "rgba(255,255,255,0.1)"}`,
                    borderRadius: 8,
                    color:
                      playerName.trim() && joinCodeInput.trim()
                        ? "#00ccff"
                        : "#444",
                    fontFamily: "monospace",
                    fontSize: 14,
                    letterSpacing: 2,
                    cursor:
                      playerName.trim() && joinCodeInput.trim()
                        ? "pointer"
                        : "not-allowed",
                  }}
                >
                  {lobbyLoading ? "JOINING..." : "JOIN ROOM"}
                </button>
              </div>
            )}

            {lobbyError && (
              <div
                data-ocid="lobby.error_state"
                style={{
                  color: "#ff4444",
                  fontSize: 12,
                  textAlign: "center",
                  marginTop: 8,
                }}
              >
                {lobbyError}
              </div>
            )}

            {roomCode && (
              <button
                type="button"
                data-ocid="lobby.enter.primary_button"
                onClick={handleEnterGame}
                style={{
                  width: "100%",
                  marginTop: 16,
                  padding: "14px 0",
                  background: "rgba(0,255,136,0.2)",
                  border: "1px solid #00ff88",
                  borderRadius: 8,
                  color: "#00ff88",
                  fontFamily: "monospace",
                  fontSize: 16,
                  letterSpacing: 3,
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                ▶ ENTER GAME
              </button>
            )}
          </div>

          <div style={{ marginTop: 24, fontSize: 10, color: "#333" }}>
            © {new Date().getFullYear()} Built with ❤️ using{" "}
            <a
              href="https://caffeine.ai"
              style={{ color: "#444" }}
              target="_blank"
              rel="noreferrer"
            >
              caffeine.ai
            </a>
          </div>
        </div>
      )}

      <Canvas
        shadows
        camera={{ fov: 60, near: 0.1, far: 300, position: [0, 5, -10] }}
        style={{ width: "100%", height: "100%" }}
      >
        <Scene
          carRef={carRef}
          controlsRef={controlsRef}
          inCar={inCar}
          cameraMode={cameraMode}
          playerPosRef={playerPosRef}
          selectedBrand={selectedBrand}
          nearestParkedIdx={nearestParkedIdx}
          onlinePlayers={onlinePlayers}
        />
      </Canvas>

      {/* Speed HUD top-left */}
      <SpeedHUD carRef={carRef} inCar={inCar} />

      {/* Online players panel top-right */}
      <div
        data-ocid="game.online.panel"
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          background: "rgba(0,0,0,0.75)",
          border: "1px solid rgba(0,255,136,0.3)",
          borderRadius: 10,
          padding: "10px 14px",
          color: "#fff",
          fontFamily: "monospace",
          backdropFilter: "blur(6px)",
          userSelect: "none",
          pointerEvents: "none",
          minWidth: 170,
        }}
      >
        <div
          style={{
            fontSize: 10,
            color: "#00ff88",
            letterSpacing: 2,
            marginBottom: 4,
          }}
        >
          🟢 ONLINE ROOM
        </div>
        {roomCode && (
          <div
            style={{
              fontSize: 13,
              color: "#ffcc00",
              fontWeight: "bold",
              marginBottom: 6,
              letterSpacing: 2,
            }}
          >
            {roomCode}
          </div>
        )}
        {onlinePlayers.length === 0 ? (
          <div style={{ fontSize: 11, color: "#666" }}>
            Waiting for players...
          </div>
        ) : (
          onlinePlayers.map((p, i) => {
            const col = ["#00aaff", "#ff44aa", "#44ffaa", "#ffaa00", "#aa44ff"][
              i % 5
            ];
            return (
              <div
                key={p.id}
                style={{
                  fontSize: 12,
                  color: col,
                  marginBottom: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: col,
                    display: "inline-block",
                  }}
                />
                {p.name}
              </div>
            );
          })
        )}
        <div
          style={{
            marginTop: 6,
            fontSize: 10,
            color: "#555",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: 4,
          }}
        >
          {playerName && (
            <span style={{ color: "#aaa" }}>You: {playerName}</span>
          )}
        </div>
      </div>

      {/* Camera rotate buttons - right side */}
      <div
        style={{
          position: "absolute",
          right: 16,
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {CAM_BUTTONS.map(({ mode, icon, label }) => (
          <button
            type="button"
            key={mode}
            data-ocid={`game.cam.${mode}.button`}
            onClick={() => setCameraMode(mode)}
            style={{
              ...btnBase,
              width: 56,
              height: 56,
              fontSize: 11,
              borderColor:
                cameraMode === mode ? "#ffcc00" : "rgba(100,180,255,0.3)",
              background:
                cameraMode === mode
                  ? "rgba(255,200,0,0.25)"
                  : "rgba(0,0,0,0.6)",
              pointerEvents: "auto",
            }}
          >
            <span style={{ fontSize: 18 }}>{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Car brand selector */}
      {!inCar && (
        <div
          style={{
            position: "absolute",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 8,
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", gap: 8 }}>
            {BRANDS.map((brand) => (
              <button
                type="button"
                key={brand}
                data-ocid={`game.brand.${brand.toLowerCase()}.button`}
                onClick={() => setSelectedBrand(brand)}
                style={{
                  ...btnBase,
                  padding: "6px 12px",
                  fontSize: 12,
                  borderColor:
                    selectedBrand === brand
                      ? BRAND_COLORS[brand]
                      : "rgba(255,255,255,0.2)",
                  background:
                    selectedBrand === brand
                      ? `${BRAND_COLORS[brand]}44`
                      : "rgba(0,0,0,0.6)",
                  color: selectedBrand === brand ? BRAND_COLORS[brand] : "#ccc",
                  pointerEvents: "auto",
                  width: "auto",
                  height: "auto",
                  flexDirection: "row",
                }}
              >
                {brand}
              </button>
            ))}
          </div>
          {/* Enter car button */}
          <button
            type="button"
            data-ocid="game.enter.button"
            onClick={canEnterCar ? enterCar : undefined}
            style={{
              ...btnBase,
              padding: "10px 32px",
              fontSize: 15,
              borderColor: canEnterCar ? "#00ff88" : "rgba(255,255,255,0.15)",
              background: canEnterCar
                ? "rgba(0,255,136,0.2)"
                : "rgba(0,0,0,0.55)",
              color: canEnterCar ? "#00ff88" : "#666",
              pointerEvents: "auto",
              width: "auto",
              height: "auto",
              flexDirection: "row",
            }}
          >
            🚗 {canEnterCar ? "ENTER CAR" : "Walk near a car…"}
          </button>
        </div>
      )}

      {/* Exit car button */}
      {inCar && (
        <div
          style={{
            position: "absolute",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          {/* Current brand label */}
          <div
            style={{
              color: BRAND_COLORS[selectedBrand],
              fontFamily: "monospace",
              fontSize: 14,
              fontWeight: 700,
              background: "rgba(0,0,0,0.6)",
              padding: "4px 16px",
              borderRadius: 8,
            }}
          >
            🚗 {selectedBrand}
          </div>
          <button
            type="button"
            data-ocid="game.exit.button"
            onClick={exitCar}
            style={{
              ...btnBase,
              padding: "10px 36px",
              fontSize: 15,
              borderColor: "#ff6644",
              background: "rgba(255,100,68,0.25)",
              color: "#ff8866",
              pointerEvents: "auto",
              width: "auto",
              height: "auto",
              flexDirection: "row",
            }}
          >
            🚪 EXIT CAR
          </button>
        </div>
      )}

      {/* Touch Controls */}
      <TouchControls controlsRef={controlsRef} />

      {/* Controls hint */}
      <div
        data-ocid="game.controls.panel"
        style={{
          position: "absolute",
          top: 180,
          left: 16,
          background: "rgba(0,0,0,0.5)",
          border: "1px solid rgba(100,180,255,0.2)",
          borderRadius: 10,
          padding: "8px 12px",
          color: "#88aacc",
          fontFamily: "monospace",
          fontSize: 10,
          lineHeight: 1.8,
          backdropFilter: "blur(4px)",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            color: "#e8f4ff",
            fontWeight: 700,
            marginBottom: 4,
            fontSize: 11,
          }}
        >
          {inCar ? `🚗 ${selectedBrand}` : "🚶 ON FOOT"}
        </div>
        <div>
          <span style={{ color: "#fff" }}>W/S</span>{" "}
          {inCar ? "Gas/Brake" : "Walk fwd/bk"}
        </div>
        <div>
          <span style={{ color: "#fff" }}>A/D</span> {inCar ? "Steer" : "Turn"}
        </div>
        <div>
          <span style={{ color: "#fff" }}>E</span>{" "}
          {inCar ? "Exit car" : "Enter car"}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          position: "absolute",
          bottom: 4,
          left: "50%",
          transform: "translateX(-50%)",
          color: "rgba(100,140,200,0.35)",
          fontSize: 9,
          fontFamily: "system-ui, sans-serif",
          pointerEvents: "none",
          whiteSpace: "nowrap",
        }}
      >
        © {new Date().getFullYear()} Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
          style={{ color: "rgba(100,180,255,0.45)", pointerEvents: "auto" }}
          target="_blank"
          rel="noreferrer"
        >
          caffeine.ai
        </a>
      </div>
    </div>
  );
}
