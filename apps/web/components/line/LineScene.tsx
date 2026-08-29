'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { stationFromProgress } from './stations';

/**
 * Tier 1 — the full 3D reading of The Line.
 *
 * COMPOSITION: the request stays at the centre of frame and the *world* moves
 * past it. A fixed read-head marks the present position, and the rail carries
 * the five stations through it. This keeps the composition balanced at every
 * scroll position — an earlier version travelled the request along a static
 * rail and drifted badly off-centre.
 *
 * The meaning is carried by three things:
 *  · the field, which morphs from unstructured cloud to ordered lattice to
 *    resolved block — the state of the information;
 *  · the rail and its ticks — the process, so the visitor sees where they are;
 *  · the gate at station 4, which arrives at the read-head and STOPS.
 *
 * Everything is instanced boxes and flat materials: no models, no shadows, no
 * post-processing. That is what keeps it inside the performance budget.
 */

const COUNT = 240;
const COLS = 20;
const ROWS = COUNT / COLS;
const STATION_GAP = 2.2;
const GATE_STATION = 3;

type Palette = { ink: string; accent: string; amber: string; muted: string; rule: string };

/** Position along the stations, 0..4, with a deliberate stall at the gate. */
function travelFrom(p: number) {
  const { index, local } = stationFromProgress(p);
  if (index < GATE_STATION) return index + local;
  if (index === GATE_STATION) {
    // Hold at the gate through most of the segment, then release.
    const release = Math.max(0, (local - 0.62) / 0.38);
    return GATE_STATION + release;
  }
  return GATE_STATION + 1 + local * 0;
}

function useArrangements() {
  return useMemo(() => {
    const rand = mulberry32(20260829);
    const chaos: THREE.Vector3[] = [];
    const order: THREE.Vector3[] = [];
    const flag: THREE.Vector3[] = [];
    const packed: THREE.Vector3[] = [];
    const result: THREE.Vector3[] = [];
    const uncertain: boolean[] = [];

    for (let i = 0; i < COUNT; i++) {
      const c = i % COLS;
      const r = Math.floor(i / COLS);
      const isUncertain = rand() < 0.15;
      uncertain.push(isUncertain);

      // 01 — unstructured: a loose cloud, no readable shape
      chaos.push(new THREE.Vector3(
        (rand() - 0.5) * 2.1,
        (rand() - 0.5) * 1.15,
        (rand() - 0.5) * 0.9,
      ));

      // 02 — ordered: a clean lattice. The shape of a structured record.
      const ox = (c - (COLS - 1) / 2) * 0.082;
      const oy = (r - (ROWS - 1) / 2) * 0.066;
      order.push(new THREE.Vector3(ox, oy, 0));

      // 03 — validated: the uncertain fields step out of the record
      flag.push(isUncertain
        ? new THREE.Vector3(ox * 0.9 + 0.1, oy + 0.46 + rand() * 0.18, 0.34)
        : new THREE.Vector3(ox, oy, 0));

      // 04 — packed: compressed into a slab, waiting at the gate
      const pc = i % 10;
      const pr = Math.floor(i / 10);
      packed.push(new THREE.Vector3(
        -0.3 + (pc - 4.5) * 0.031,
        (pr - (COUNT / 10 - 1) / 2) * 0.025,
        0,
      ));

      // 05 — resolved: a single tidy block, past the gate
      result.push(new THREE.Vector3(
        0.3 + (c - (COLS - 1) / 2) * 0.055,
        (r - (ROWS - 1) / 2) * 0.048,
        0,
      ));
    }
    return { sets: [chaos, order, flag, packed, result], uncertain };
  }, []);
}

function Field({ progress, palette }: { progress: React.RefObject<number>; palette: Palette }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const a = useArrangements();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const cMuted = useMemo(() => new THREE.Color(palette.muted), [palette.muted]);
  const cAccent = useMemo(() => new THREE.Color(palette.accent), [palette.accent]);
  const cAmber = useMemo(() => new THREE.Color(palette.amber), [palette.amber]);
  const tmp = useMemo(() => new THREE.Color(), []);

  useFrame((state) => {
    const m = mesh.current;
    if (!m) return;
    const p = progress.current ?? 0;
    const { index, local } = stationFromProgress(p);
    const t = state.clock.elapsedTime;

    const from = a.sets[Math.max(0, index - 1)]!;
    const to = a.sets[Math.min(index, 4)]!;
    // Arrive at the captioned state within the first 60% of the segment, then
    // hold — so what is described and what is shown always agree.
    const raw = Math.min(1, local / 0.6);
    const k = raw < 0.5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2;

    for (let i = 0; i < COUNT; i++) {
      const f = from[i]!;
      const s = to[i]!;
      // Drift only while the information is still unstructured.
      const chaosAmount = index === 0 ? 1 : index === 1 ? 1 - k : 0;
      const d = chaosAmount * 0.045;

      dummy.position.set(
        f.x + (s.x - f.x) * k + Math.sin(t * 0.6 + i) * d,
        f.y + (s.y - f.y) * k + Math.cos(t * 0.5 + i * 1.3) * d,
        f.z + (s.z - f.z) * k,
      );
      dummy.rotation.z = chaosAmount * ((i % 7) * 0.22);
      dummy.scale.setScalar(0.036);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);

      const flagged = a.uncertain[i] && index >= 2 && index <= 3;
      tmp.copy(flagged ? cAmber : index >= 4 ? cAccent : cMuted);
      m.setColorAt(i, tmp);
    }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, COUNT]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  );
}

/** The rail, its ticks and the gate — all translated so the world moves. */
function World({ progress, palette }: { progress: React.RefObject<number>; palette: Palette }) {
  const group = useRef<THREE.Group>(null);
  const gateTop = useRef<THREE.Mesh>(null);
  const gateBottom = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const p = progress.current ?? 0;
    const travel = travelFrom(p);
    if (group.current) group.current.position.x = -travel * STATION_GAP;

    const { index, local } = stationFromProgress(p);
    const open = index > GATE_STATION ? 1 : index === GATE_STATION ? Math.max(0, (local - 0.62) / 0.38) : 0;
    // Closed: the bars almost meet across the rail. Open: they retract clear.
    const y = 0.62 + open * 0.62;
    if (gateTop.current) gateTop.current.position.y = y;
    if (gateBottom.current) gateBottom.current.position.y = -y;
  });

  return (
    <group ref={group} position={[0, 0, -0.5]}>
      <mesh>
        <boxGeometry args={[STATION_GAP * 8, 0.005, 0.005]} />
        <meshBasicMaterial color={palette.rule} toneMapped={false} />
      </mesh>

      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[i * STATION_GAP, 0, 0]}>
          <boxGeometry args={[0.008, 0.2, 0.008]} />
          <meshBasicMaterial color={palette.rule} toneMapped={false} />
        </mesh>
      ))}

      <mesh ref={gateTop} position={[GATE_STATION * STATION_GAP, 0.62, 0]}>
        <boxGeometry args={[0.03, 0.72, 0.03]} />
        <meshBasicMaterial color={palette.accent} toneMapped={false} />
      </mesh>
      <mesh ref={gateBottom} position={[GATE_STATION * STATION_GAP, -0.62, 0]}>
        <boxGeometry args={[0.03, 0.72, 0.03]} />
        <meshBasicMaterial color={palette.accent} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** Fixed read-head: two brackets marking the present position. */
function ReadHead({ palette }: { palette: Palette }) {
  return (
    <group position={[0, 0, -0.48]}>
      <mesh position={[0, 1.12, 0]}>
        <boxGeometry args={[0.006, 0.2, 0.006]} />
        <meshBasicMaterial color={palette.muted} toneMapped={false} />
      </mesh>
      <mesh position={[0, -1.12, 0]}>
        <boxGeometry args={[0.006, 0.2, 0.006]} />
        <meshBasicMaterial color={palette.muted} toneMapped={false} />
      </mesh>
    </group>
  );
}

export default function LineScene({
  progress,
  palette,
}: {
  progress: React.RefObject<number>;
  palette: Palette;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.2], fov: 30 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      aria-hidden
    >
      <World progress={progress} palette={palette} />
      <ReadHead palette={palette} />
      <Field progress={progress} palette={palette} />
    </Canvas>
  );
}

/** Deterministic PRNG so the arrangement is identical on every machine. */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
