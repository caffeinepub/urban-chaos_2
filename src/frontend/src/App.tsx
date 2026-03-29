import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";

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

// ── BMW Car Component ──────────────────────────────────────────────────────
function BMWCar({ carRef }: { carRef: React.MutableRefObject<CarState> }) {
  const groupRef = useRef<THREE.Group>(null);
  const wheelRefs = useRef<THREE.Mesh[]>([]);

  useFrame(() => {
    const state = carRef.current;
    if (!groupRef.current) return;
    groupRef.current.position.x = state.x;
    groupRef.current.position.z = state.z;
    groupRef.current.rotation.y = state.angle;
    // Rotate wheels based on speed
    for (const w of wheelRefs.current) {
      if (w) w.rotation.x -= state.speed * 0.05;
    }
  });

  const setWheelRef = (i: number) => (el: THREE.Mesh | null) => {
    if (el) wheelRefs.current[i] = el;
  };

  return (
    <group ref={groupRef}>
      {/* Main body */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[4.5, 0.6, 2.0]} />
        <meshStandardMaterial color="#d0d8e8" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Cabin */}
      <mesh position={[0.1, 0.98, 0]} castShadow>
        <boxGeometry args={[2.4, 0.65, 1.72]} />
        <meshStandardMaterial
          color="#b8c2d4"
          metalness={0.7}
          roughness={0.25}
        />
      </mesh>

      {/* Hood - slight wedge shape using a thin box */}
      <mesh position={[1.6, 0.55, 0]} castShadow>
        <boxGeometry args={[1.4, 0.12, 1.9]} />
        <meshStandardMaterial color="#c8d2e4" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Front bumper */}
      <mesh position={[2.32, 0.28, 0]} castShadow>
        <boxGeometry args={[0.18, 0.28, 2.1]} />
        <meshStandardMaterial color="#5a6070" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Rear bumper */}
      <mesh position={[-2.32, 0.28, 0]} castShadow>
        <boxGeometry args={[0.18, 0.28, 2.1]} />
        <meshStandardMaterial color="#5a6070" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Front grille area */}
      <mesh position={[2.28, 0.44, 0]} castShadow>
        <boxGeometry args={[0.08, 0.25, 1.7]} />
        <meshStandardMaterial color="#222830" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* BMW Kidney grille - left */}
      <mesh position={[2.31, 0.44, 0.32]}>
        <boxGeometry args={[0.06, 0.2, 0.28]} />
        <meshStandardMaterial
          color="#111418"
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>

      {/* BMW Kidney grille - right */}
      <mesh position={[2.31, 0.44, -0.32]}>
        <boxGeometry args={[0.06, 0.2, 0.28]} />
        <meshStandardMaterial
          color="#111418"
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>

      {/* Windshield front */}
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

      {/* Rear window */}
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

      {/* Side windows left */}
      <mesh position={[0.1, 1.05, 0.88]}>
        <boxGeometry args={[2.1, 0.42, 0.04]} />
        <meshStandardMaterial
          color="#99bbdd"
          transparent
          opacity={0.4}
          metalness={0.1}
          roughness={0.05}
        />
      </mesh>

      {/* Side windows right */}
      <mesh position={[0.1, 1.05, -0.88]}>
        <boxGeometry args={[2.1, 0.42, 0.04]} />
        <meshStandardMaterial
          color="#99bbdd"
          transparent
          opacity={0.4}
          metalness={0.1}
          roughness={0.05}
        />
      </mesh>

      {/* Headlights - front left */}
      <mesh position={[2.24, 0.52, 0.72]}>
        <boxGeometry args={[0.12, 0.15, 0.32]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffcc"
          emissiveIntensity={3}
        />
      </mesh>

      {/* Headlights - front right */}
      <mesh position={[2.24, 0.52, -0.72]}>
        <boxGeometry args={[0.12, 0.15, 0.32]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffcc"
          emissiveIntensity={3}
        />
      </mesh>

      {/* Taillights - rear left */}
      <mesh position={[-2.24, 0.52, 0.72]}>
        <boxGeometry args={[0.12, 0.14, 0.44]} />
        <meshStandardMaterial
          color="#ff2222"
          emissive="#ff0000"
          emissiveIntensity={2}
        />
      </mesh>

      {/* Taillights - rear right */}
      <mesh position={[-2.24, 0.52, -0.72]}>
        <boxGeometry args={[0.12, 0.14, 0.44]} />
        <meshStandardMaterial
          color="#ff2222"
          emissive="#ff0000"
          emissiveIntensity={2}
        />
      </mesh>

      {/* Under-body */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[4.2, 0.1, 1.8]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>

      {/* Wheels - front left */}
      <group position={[1.55, 0.38, 1.05]}>
        <mesh ref={setWheelRef(0)} rotation={[0, 0, Math.PI / 2]} castShadow>
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
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 0.27, 6]} />
          <meshStandardMaterial
            color="#cccccc"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* Wheels - front right */}
      <group position={[1.55, 0.38, -1.05]}>
        <mesh ref={setWheelRef(1)} rotation={[0, 0, Math.PI / 2]} castShadow>
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
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 0.27, 6]} />
          <meshStandardMaterial
            color="#cccccc"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* Wheels - rear left */}
      <group position={[-1.55, 0.38, 1.05]}>
        <mesh ref={setWheelRef(2)} rotation={[0, 0, Math.PI / 2]} castShadow>
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
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 0.27, 6]} />
          <meshStandardMaterial
            color="#cccccc"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* Wheels - rear right */}
      <group position={[-1.55, 0.38, -1.05]}>
        <mesh ref={setWheelRef(3)} rotation={[0, 0, Math.PI / 2]} castShadow>
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
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 0.27, 6]} />
          <meshStandardMaterial
            color="#cccccc"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* Headlight point lights */}
      <pointLight
        position={[2.5, 0.6, 0.7]}
        color="#ffffcc"
        intensity={8}
        distance={18}
      />
      <pointLight
        position={[2.5, 0.6, -0.7]}
        color="#ffffcc"
        intensity={8}
        distance={18}
      />
    </group>
  );
}

// ── Camera Controller ──────────────────────────────────────────────────────
function CameraController({
  carRef,
}: { carRef: React.MutableRefObject<CarState> }) {
  const { camera } = useThree();
  const camPos = useRef(new THREE.Vector3(0, 5, -10));

  useFrame(() => {
    const state = carRef.current;
    const angle = state.angle;
    // Offset behind and above
    const offsetX = -Math.sin(angle) * 10;
    const offsetZ = -Math.cos(angle) * 10;
    const targetPos = new THREE.Vector3(
      state.x + offsetX,
      5,
      state.z + offsetZ,
    );
    camPos.current.lerp(targetPos, 0.08);
    camera.position.copy(camPos.current);
    camera.lookAt(state.x, 1, state.z);
  });

  return null;
}

// ── Physics Controller ─────────────────────────────────────────────────────
function PhysicsController({
  carRef,
  controlsRef,
}: {
  carRef: React.MutableRefObject<CarState>;
  controlsRef: React.MutableRefObject<Controls>;
}) {
  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const state = carRef.current;
    const ctrl = controlsRef.current;

    // Gas / Brake / Reverse
    if (ctrl.gas) {
      state.speed = Math.min(state.speed + 8 * dt, 20);
    } else if (ctrl.brake) {
      if (state.speed > 0) {
        state.speed = Math.max(0, state.speed - 12 * dt);
      } else {
        state.speed = Math.max(state.speed - 5 * dt, -8);
      }
    } else {
      state.speed *= 0.97;
      if (Math.abs(state.speed) < 0.05) state.speed = 0;
    }

    // Steering
    if (Math.abs(state.speed) > 0.5) {
      const steerAmount = 1.8;
      const dir = state.speed > 0 ? 1 : -1;
      if (ctrl.left) state.angle += steerAmount * dt * dir;
      if (ctrl.right) state.angle -= steerAmount * dt * dir;
    }

    // Move
    state.x += Math.sin(state.angle) * state.speed * dt;
    state.z += Math.cos(state.angle) * state.speed * dt;

    // Boundary clamp
    state.x = Math.max(-98, Math.min(98, state.x));
    state.z = Math.max(-98, Math.min(98, state.z));

    // Wheel rotation
    state.wheelRot += state.speed * dt;
  });

  return null;
}

// ── Ground ─────────────────────────────────────────────────────────────────
function Ground() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 200, 40, 40]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.95} />
      </mesh>
      {/* Grid lines overlay */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[200, 200, 20, 20]} />
        <meshStandardMaterial
          color="#2a2a2a"
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
}

// ── Buildings ──────────────────────────────────────────────────────────────
const BUILDING_DATA = (() => {
  const buildings: Array<{
    x: number;
    z: number;
    w: number;
    d: number;
    h: number;
    color: string;
  }> = [];
  const colors = [
    "#1e2330",
    "#1a1e2c",
    "#22263a",
    "#1c2028",
    "#252038",
    "#1e2232",
  ];
  const rng = (seed: number) => {
    let s = seed;
    return () => {
      s = (s * 16807 + 0) % 2147483647;
      return (s - 1) / 2147483646;
    };
  };
  const rand = rng(42);
  for (let i = 0; i < 30; i++) {
    let x = 0;
    let z = 0;
    do {
      x = (rand() - 0.5) * 180;
      z = (rand() - 0.5) * 180;
    } while (Math.abs(x) < 20 && Math.abs(z) < 20);
    const w = 4 + rand() * 8;
    const d = 4 + rand() * 8;
    const h = 3 + rand() * 12;
    buildings.push({
      x,
      z,
      w,
      d,
      h,
      color: colors[Math.floor(rand() * colors.length)],
    });
  }
  return buildings;
})();

function Buildings() {
  return (
    <>
      {BUILDING_DATA.map((b) => (
        <mesh
          key={`${b.x.toFixed(1)}-${b.z.toFixed(1)}`}
          position={[b.x, b.h / 2, b.z]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[b.w, b.h, b.d]} />
          <meshStandardMaterial
            color={b.color}
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>
      ))}
    </>
  );
}

// ── Scene ──────────────────────────────────────────────────────────────────
function Scene({
  carRef,
  controlsRef,
}: {
  carRef: React.MutableRefObject<CarState>;
  controlsRef: React.MutableRefObject<Controls>;
}) {
  const { scene } = useThree();

  useEffect(() => {
    scene.background = new THREE.Color("#0a0d1a");
    scene.fog = new THREE.Fog("#0a0d1a", 40, 120);
  }, [scene]);

  return (
    <>
      <ambientLight intensity={0.15} color="#334466" />
      <directionalLight
        position={[20, 30, 20]}
        intensity={0.6}
        color="#aabbdd"
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
      {/* Street lamps */}
      <pointLight
        position={[15, 6, 0]}
        color="#ffddaa"
        intensity={12}
        distance={30}
      />
      <pointLight
        position={[-15, 6, 0]}
        color="#ffddaa"
        intensity={12}
        distance={30}
      />
      <pointLight
        position={[0, 6, 15]}
        color="#ffddaa"
        intensity={12}
        distance={30}
      />
      <pointLight
        position={[0, 6, -15]}
        color="#ffddaa"
        intensity={12}
        distance={30}
      />
      <Ground />
      <Buildings />
      <BMWCar carRef={carRef} />
      <CameraController carRef={carRef} />
      <PhysicsController carRef={carRef} controlsRef={controlsRef} />
    </>
  );
}

// ── HUD ────────────────────────────────────────────────────────────────────
function HUD({ carRef }: { carRef: React.MutableRefObject<CarState> }) {
  const [displaySpeed, setDisplaySpeed] = useState(0);
  const [gear, setGear] = useState("N");

  useEffect(() => {
    let raf: number;
    const update = () => {
      const spd = carRef.current.speed;
      const absSpd = Math.abs(spd);
      const kmh = Math.round(absSpd * 18); // rough km/h
      setDisplaySpeed(kmh);
      if (spd < -0.5) setGear("R");
      else if (absSpd < 0.5) setGear("N");
      else if (kmh < 30) setGear("1");
      else if (kmh < 60) setGear("2");
      else if (kmh < 100) setGear("3");
      else if (kmh < 150) setGear("4");
      else setGear("5");
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [carRef]);

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
        fontFamily: "'JetBrains Mono', monospace, system-ui",
        backdropFilter: "blur(4px)",
        userSelect: "none",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: "#88aacc",
          letterSpacing: 2,
          marginBottom: 2,
        }}
      >
        SPEED
      </div>
      <div
        style={{
          fontSize: 38,
          fontWeight: 700,
          lineHeight: 1,
          color: "#e8f4ff",
        }}
      >
        {displaySpeed}
        <span style={{ fontSize: 12, color: "#88aacc", marginLeft: 4 }}>
          km/h
        </span>
      </div>
      <div style={{ marginTop: 6, display: "flex", gap: 6 }}>
        <span style={{ fontSize: 11, color: "#88aacc" }}>GEAR</span>
        <span
          style={{
            fontSize: 18,
            fontWeight: 700,
            color:
              gear === "R" ? "#ff5555" : gear === "N" ? "#ffaa44" : "#44ff88",
            minWidth: 16,
          }}
        >
          {gear}
        </span>
      </div>
    </div>
  );
}

// ── Touch Controls ─────────────────────────────────────────────────────────
function TouchControls({
  controlsRef,
}: {
  controlsRef: React.MutableRefObject<Controls>;
}) {
  const btnStyle = (color: string, border: string): React.CSSProperties => ({
    background: "rgba(0,0,0,0.55)",
    border: `2px solid ${border}`,
    borderRadius: 16,
    color,
    fontWeight: 700,
    fontSize: 13,
    width: 72,
    height: 72,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column" as const,
    gap: 2,
    userSelect: "none" as const,
    touchAction: "none" as const,
    cursor: "pointer",
    backdropFilter: "blur(4px)",
    WebkitUserSelect: "none" as const,
  });

  const prevent = (e: React.TouchEvent | React.PointerEvent) =>
    e.preventDefault();

  return (
    <>
      {/* Left side: Steering */}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          left: 20,
          display: "flex",
          gap: 12,
          alignItems: "center",
        }}
      >
        <div
          data-ocid="game.left.button"
          style={btnStyle("#88ccff", "#4488cc")}
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
          <span style={{ fontSize: 28 }}>◀</span>
          <span>LEFT</span>
        </div>
        <div
          data-ocid="game.right.button"
          style={btnStyle("#88ccff", "#4488cc")}
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
          <span style={{ fontSize: 28 }}>▶</span>
          <span>RIGHT</span>
        </div>
      </div>

      {/* Right side: Gas + Brake */}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          right: 20,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          alignItems: "center",
        }}
      >
        <div
          data-ocid="game.brake.button"
          style={{ ...btnStyle("#ff6666", "#cc3333"), width: 80, height: 64 }}
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
          <span style={{ fontSize: 22 }}>⬇</span>
          <span>BRAKE/REV</span>
        </div>
        <div
          data-ocid="game.gas.button"
          style={{ ...btnStyle("#66ff99", "#33cc66"), width: 88, height: 80 }}
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
          <span style={{ fontSize: 30 }}>⬆</span>
          <span style={{ fontSize: 15 }}>GAS</span>
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
  }, []);

  return (
    <div
      style={{
        width: "100dvw",
        height: "100dvh",
        overflow: "hidden",
        position: "relative",
        background: "#0a0d1a",
        touchAction: "none",
      }}
    >
      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ fov: 60, near: 0.1, far: 300, position: [0, 5, -10] }}
        style={{ width: "100%", height: "100%" }}
      >
        <Scene carRef={carRef} controlsRef={controlsRef} />
      </Canvas>

      {/* HUD overlay */}
      <HUD carRef={carRef} />

      {/* Controls hint top right */}
      <div
        data-ocid="game.controls.panel"
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          background: "rgba(0,0,0,0.55)",
          border: "1px solid rgba(100,180,255,0.2)",
          borderRadius: 10,
          padding: "8px 14px",
          color: "#88aacc",
          fontFamily: "system-ui, sans-serif",
          fontSize: 11,
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
            fontSize: 12,
          }}
        >
          🚗 BMW DRIVE
        </div>
        <div>
          <span style={{ color: "#fff" }}>W</span> Gas
        </div>
        <div>
          <span style={{ color: "#fff" }}>S</span> Brake / Reverse
        </div>
        <div>
          <span style={{ color: "#fff" }}>A / D</span> Steer
        </div>
      </div>

      {/* Touch Controls */}
      <TouchControls controlsRef={controlsRef} />

      {/* Footer */}
      <div
        style={{
          position: "absolute",
          bottom: 6,
          left: "50%",
          transform: "translateX(-50%)",
          color: "rgba(100,140,200,0.4)",
          fontSize: 10,
          fontFamily: "system-ui, sans-serif",
          pointerEvents: "none",
          whiteSpace: "nowrap",
        }}
      >
        © {new Date().getFullYear()} Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
          style={{ color: "rgba(100,180,255,0.5)", pointerEvents: "auto" }}
          target="_blank"
          rel="noreferrer"
        >
          caffeine.ai
        </a>
      </div>
    </div>
  );
}
