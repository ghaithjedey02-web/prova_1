'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { Palette } from '@/lib/palette';

/**
 * The film's stage: one continuous WebGL transformation.
 *
 * Four hundred and forty engineered fragments perform the whole story without
 * a single cut. The same instances are the chaos, the scan beam, the
 * structured grid, the company constellation, and the final flow — five
 * precomputed layouts, interpolated per-particle with a staggered ripple so
 * every transition reads as matter reorganising, never as a crossfade. Five
 * brighter "document" slabs travel inside the crowd carrying the inputs.
 *
 * The clock lives OUTSIDE this component: the wrapper advances `time.current`
 * only while the film is playing, and freezes it at the human gate — so the
 * pause is not an overlay trick, the world genuinely stops (and cools to
 * amber while it waits).
 */

const COUNT = 440;
const DOCS = 5;

import { T } from './film-timeline';

type Props = {
  time: React.RefObject<number>;
  gateHold: React.RefObject<boolean>;
  palette: Palette;
};

function lcg(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
function clamp01(v: number) { return Math.min(1, Math.max(0, v)); }
function seg(t: number, a: number, b: number) { return clamp01((t - a) / (b - a)); }
function ease(t: number) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

/** The five destinations every fragment moves between. */
function buildLayouts() {
  const rnd = lcg(20260901);
  const mk = () => new Float32Array(COUNT * 3);
  const chaos = mk(); const beam = mk(); const grid = mk(); const map = mk(); const flow = mk();

  // Node anchor positions (world units) matching the DOM constellation labels.
  const NODE_XY: [number, number][] = [
    [0, 1.75], [3.1, 0.85], [3.1, -0.85], [0, -1.75], [-3.1, -0.85], [-3.1, 0.85],
  ];
  const STATIONS = [-3.5, -1.75, 0, 1.75, 3.5];

  for (let i = 0; i < COUNT; i++) {
    const j = i * 3;

    // CHAOS: a loose ellipsoid, denser toward the rim so the centre feels empty.
    const a = rnd() * Math.PI * 2;
    const r = 0.55 + Math.pow(rnd(), 0.6) * 0.45;
    chaos[j] = Math.cos(a) * r * 4.4;
    chaos[j + 1] = Math.sin(a) * r * 2.3;
    chaos[j + 2] = (rnd() - 0.5) * 2.2;

    // BEAM: everything pulled into one horizontal reading line.
    beam[j] = -3.5 + rnd() * 7.0;
    beam[j + 1] = (rnd() - 0.5) * 0.12;
    beam[j + 2] = (rnd() - 0.5) * 0.2;

    // GRID: a structured field — 28 columns of ordered records.
    const cols = 28;
    const col = i % cols;
    const row = Math.floor(i / cols);
    grid[j] = (col - (cols - 1) / 2) * 0.26;
    grid[j + 1] = ((COUNT / cols - 1) / 2 - row) * 0.24;
    grid[j + 2] = 0;

    // MAP: a core ring, six satellites, and fragments strung along the wires.
    const role = i % 10;
    if (role < 3) {
      const t2 = rnd() * Math.PI * 2;
      map[j] = Math.cos(t2) * 0.55;
      map[j + 1] = Math.sin(t2) * 0.55;
      map[j + 2] = (rnd() - 0.5) * 0.25;
    } else if (role < 8) {
      const n = NODE_XY[i % 6]!;
      const t2 = rnd() * Math.PI * 2;
      map[j] = n[0] + Math.cos(t2) * 0.34;
      map[j + 1] = n[1] + Math.sin(t2) * 0.34;
      map[j + 2] = (rnd() - 0.5) * 0.2;
    } else {
      const n = NODE_XY[i % 6]!;
      const k = 0.15 + rnd() * 0.7;
      map[j] = n[0] * k;
      map[j + 1] = n[1] * k;
      map[j + 2] = 0;
    }

    // FLOW: five dense stations on one calm line.
    const st = STATIONS[i % 5]!;
    flow[j] = st + (rnd() - 0.5) * 0.5;
    flow[j + 1] = (rnd() - 0.5) * 0.5;
    flow[j + 2] = (rnd() - 0.5) * 0.2;
  }

  // The document slabs take deliberate chaos positions, then ride the crowd.
  const docChaos: [number, number, number][] = [
    [-2.6, 1.2, 0.4], [2.4, 1.5, -0.3], [-3.1, -0.9, 0.2], [2.9, -1.2, 0.5], [0.4, 1.9, -0.5],
  ];
  for (let d = 0; d < DOCS; d++) {
    const j = d * 3;
    chaos[j] = docChaos[d]![0]; chaos[j + 1] = docChaos[d]![1]; chaos[j + 2] = docChaos[d]![2];
    beam[j] = -2.8 + d * 1.4; beam[j + 1] = 0; beam[j + 2] = 0.1;
    grid[j] = -2.4 + d * 1.2; grid[j + 1] = 2.0; grid[j + 2] = 0.05;
    map[j] = 0; map[j + 1] = 0; map[j + 2] = 0.3;
    flow[j] = -3.5 + d * 1.75; flow[j + 1] = 0; flow[j + 2] = 0.3;
  }

  // Per-particle stagger + rotation seeds.
  const delay = new Float32Array(COUNT);
  const rot = new Float32Array(COUNT * 3);
  const rnd2 = lcg(77);
  for (let i = 0; i < COUNT; i++) {
    delay[i] = rnd2() * 0.35;
    rot[i * 3] = rnd2() * Math.PI;
    rot[i * 3 + 1] = rnd2() * Math.PI;
    rot[i * 3 + 2] = rnd2() * Math.PI;
  }
  return { chaos, beam, grid, map, flow, delay, rot };
}

function Fragments({ time, gateHold, palette }: Props) {
  const inst = useRef<THREE.InstancedMesh>(null);
  const docs = useRef<THREE.InstancedMesh>(null);
  const L = useMemo(buildLayouts, []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const accent = useMemo(() => new THREE.Color(palette.accent), [palette.accent]);
  const amber = useMemo(() => new THREE.Color(palette.amber), [palette.amber]);
  const good = useMemo(() => new THREE.Color('#55C08D'), []);
  const cur = useMemo(() => new THREE.Color(), []);

  useFrame((state) => {
    const t = time.current ?? 0;
    const held = gateHold.current ?? false;
    const wallT = state.clock.elapsedTime;

    // Which pair of layouts, and how far between them. Staggered per particle.
    const toBeam = seg(t, T.beam, T.beam + 2.2);
    const toGrid = seg(t, T.grid, T.grid + 2.6);
    const toMap = seg(t, T.map, T.map + 2.4);
    const toFlow = seg(t, T.flow, T.flow + 2.2);
    const settleEnd = seg(t, T.result, T.result + 2.0);

    // The world's temperature: accent while working, amber while it waits for
    // a person, a touch of green once the action is approved and running.
    if (held) cur.lerpColors(accent, amber, 0.85);
    else if (t > T.flow && t < T.result + 1) cur.lerpColors(accent, good, seg(t, T.flow, T.flow + 1.5) * 0.45);
    else cur.copy(accent);

    const mesh = inst.current;
    const dmesh = docs.current;
    if (!mesh || !dmesh) return;
    (mesh.material as THREE.MeshBasicMaterial).color.copy(cur);
    (dmesh.material as THREE.MeshBasicMaterial).color.lerpColors(new THREE.Color('#DFE9EC'), amber, held ? 0.7 : 0);

    // In the last chapter the work recedes so the ledger can take the frame.
    (mesh.material as THREE.MeshBasicMaterial).opacity = 0.85 - settleEnd * 0.62;
    (dmesh.material as THREE.MeshBasicMaterial).opacity = 0.32 - settleEnd * 0.26;

    for (let i = 0; i < COUNT; i++) {
      const j = i * 3;
      const d = L.delay[i]!;
      const kB = ease(clamp01((toBeam - d) / (1 - d)));
      const kG = ease(clamp01((toGrid - d) / (1 - d)));
      const kM = ease(clamp01((toMap - d) / (1 - d)));
      const kF = ease(clamp01((toFlow - d) / (1 - d)));

      let x = L.chaos[j]!; let y = L.chaos[j + 1]!; let z = L.chaos[j + 2]!;
      x += (L.beam[j]! - x) * kB; y += (L.beam[j + 1]! - y) * kB; z += (L.beam[j + 2]! - z) * kB;
      x += (L.grid[j]! - x) * kG; y += (L.grid[j + 1]! - y) * kG; z += (L.grid[j + 2]! - z) * kG;
      x += (L.map[j]! - x) * kM; y += (L.map[j + 1]! - y) * kM; z += (L.map[j + 2]! - z) * kM;
      x += (L.flow[j]! - x) * kF; y += (L.flow[j + 1]! - y) * kF; z += (L.flow[j + 2]! - z) * kF;

      // Life: chaotic drift early, a held breath at the gate, calm at the end.
      const structure = Math.max(kG, kM, kF);
      const drift = held ? 0.004 : (1 - structure) * 0.09 + 0.008;
      x += Math.sin(wallT * 0.7 + i) * drift;
      y += Math.cos(wallT * 0.6 + i * 1.7) * drift;

      // In-flight turbulence so each transition reads as motion, not a fade.
      const flight = Math.max(kB * (1 - kB), kG * (1 - kG), kM * (1 - kM), kF * (1 - kF)) * 4;
      y += Math.sin(wallT * 2.1 + i) * 0.05 * flight;

      dummy.position.set(x, y, z);
      const unwind = 1 - structure * 0.92;
      dummy.rotation.set(L.rot[j]! * unwind, L.rot[j + 1]! * unwind, L.rot[j + 2]! * unwind);
      const shrink = 1 - settleEnd * 0.25;
      dummy.scale.setScalar((0.8 + (i % 5) * 0.12) * shrink);
      dummy.updateMatrix();

      if (i < DOCS) {
        dummy.scale.multiplyScalar(3.2);
        dummy.rotation.set(0, 0, L.rot[j]! * unwind * 0.2);
        dummy.updateMatrix();
        dmesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
    dmesh.instanceMatrix.needsUpdate = true;

    // Camera: one slow dolly across the whole film; still while the gate holds.
    // A portrait stage (phone) pulls back so the wide layouts still fit.
    const cam = state.camera;
    const dollyT = seg(t, 0, T.end);
    const aspect = state.size.width / Math.max(1, state.size.height);
    const fit = aspect < 1.2 ? 1.6 : aspect < 1.5 ? 1.25 : 1;
    const targetZ = (8.4 - dollyT * 1.5 + settleEnd * 0.7) * fit;
    const targetX = Math.sin(t * 0.13) * (held ? 0.02 : 0.25) * (1 - dollyT * 0.5);
    cam.position.x += (targetX - cam.position.x) * 0.04;
    cam.position.z += (targetZ - cam.position.z) * 0.04;
    cam.lookAt(0, 0, 0);
  });

  return (
    <>
      <instancedMesh ref={inst} args={[undefined, undefined, COUNT]} frustumCulled={false}>
        <boxGeometry args={[0.085, 0.016, 0.016]} />
        <meshBasicMaterial transparent opacity={0.85} blending={THREE.AdditiveBlending} depthWrite={false} />
      </instancedMesh>
      {/* The documents: five brighter slabs riding inside the crowd. */}
      <instancedMesh ref={docs} args={[undefined, undefined, DOCS]} frustumCulled={false}>
        <boxGeometry args={[0.34, 0.22, 0.012]} />
        <meshBasicMaterial transparent opacity={0.32} blending={THREE.AdditiveBlending} depthWrite={false} />
      </instancedMesh>
    </>
  );
}

export default function FilmScene(props: Props) {
  return (
    <Canvas
      aria-hidden
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 8.4], fov: 40 }}
    >
      <Fragments {...props} />
    </Canvas>
  );
}
