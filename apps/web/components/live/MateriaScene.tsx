'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { PART, holeAngles } from '@/components/forge/part';
import type { Palette } from '@/lib/palette';

/**
 * MATERIA — the sequence where a physical object becomes a system.
 *
 * This is the argument DOLMIR exists to make, and it is made without a sentence:
 *
 *   0.00  a machined part, lit and turning. Matter.
 *   0.20  a scan plane passes through it.
 *   0.35  the material goes; the geometry stays. Wireframe.
 *   0.50  the edges let go and the object becomes a point cloud. Data.
 *   0.70  the points leave their shape and take a grid. Structure.
 *   0.88  the grid compacts into a single record. A row in a system.
 *
 * Every point is the *same* point throughout: the cloud is sampled once from the
 * real FL-2280 surface and then interpolated between three target layouts. The
 * part is never swapped for a different object, because the whole claim is that
 * this is the same thing seen at four levels of abstraction.
 *
 * One geometry, one instanced-free Points object, three materials. No
 * postprocessing and no new dependency.
 */

const COUNT = 4200;
const S = 0.019;

type Props = { progress: React.RefObject<number>; palette: Palette };

/* ------------------------------------------------------------- geometry ----*/

function useFlange() {
  return useMemo(() => {
    const outer = (PART.outerDiameter / 2) * S;
    const bore = (PART.innerDiameter / 2) * S;
    const bcd = (PART.boltCircle / 2) * S;
    const hole = (PART.holeDiameter / 2) * S;

    const shape = new THREE.Shape();
    shape.absarc(0, 0, outer, 0, Math.PI * 2, false);
    const b = new THREE.Path();
    b.absarc(0, 0, bore, 0, Math.PI * 2, true);
    shape.holes.push(b);
    for (const a of holeAngles()) {
      const h = new THREE.Path();
      h.absarc(Math.cos(a) * bcd, Math.sin(a) * bcd, hole, 0, Math.PI * 2, true);
      shape.holes.push(h);
    }

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: PART.thickness * S,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.01,
      bevelSegments: 2,
      curveSegments: 64,
    });
    geo.center();
    geo.computeVertexNormals();
    return geo;
  }, []);
}

/**
 * Samples points across the surface, area-weighted.
 *
 * Written out rather than pulled from three's examples: it is twenty lines, it
 * avoids a deep import that the bundler would have to resolve, and it lets the
 * sampling be deterministic per build.
 */
function sampleSurface(geo: THREE.BufferGeometry, count: number): Float32Array {
  const pos = geo.getAttribute('position') as THREE.BufferAttribute;
  const index = geo.getIndex();
  const triCount = index ? index.count / 3 : pos.count / 3;

  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();
  const areas = new Float32Array(triCount);
  let total = 0;

  const vi = (t: number, k: number) => (index ? index.getX(t * 3 + k) : t * 3 + k);

  for (let t = 0; t < triCount; t++) {
    a.fromBufferAttribute(pos, vi(t, 0));
    b.fromBufferAttribute(pos, vi(t, 1));
    c.fromBufferAttribute(pos, vi(t, 2));
    const area = b.clone().sub(a).cross(c.clone().sub(a)).length() * 0.5;
    areas[t] = area;
    total += area;
  }

  const out = new Float32Array(count * 3);
  let seed = 20260830;
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);

  for (let i = 0; i < count; i++) {
    let target = rnd() * total;
    let t = 0;
    while (t < triCount - 1 && (target -= areas[t]!) > 0) t++;
    a.fromBufferAttribute(pos, vi(t, 0));
    b.fromBufferAttribute(pos, vi(t, 1));
    c.fromBufferAttribute(pos, vi(t, 2));
    let u = rnd();
    let v = rnd();
    if (u + v > 1) { u = 1 - u; v = 1 - v; }
    out[i * 3] = a.x + u * (b.x - a.x) + v * (c.x - a.x);
    out[i * 3 + 1] = a.y + u * (b.y - a.y) + v * (c.y - a.y);
    out[i * 3 + 2] = a.z + u * (b.z - a.z) + v * (c.z - a.z);
  }
  return out;
}

/* ---------------------------------------------------------------- scene ----*/

function clamp01(v: number) { return Math.min(1, Math.max(0, v)); }
function seg(p: number, a: number, b: number) { return clamp01((p - a) / (b - a)); }
function ease(t: number) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

function Sequence({ progress, palette }: Props) {
  const geo = useFlange();
  const group = useRef<THREE.Group>(null);
  const solid = useRef<THREE.Mesh>(null);
  const wire = useRef<THREE.LineSegments>(null);
  const cloud = useRef<THREE.Points>(null);
  const scan = useRef<THREE.Mesh>(null);

  const edges = useMemo(() => new THREE.EdgesGeometry(geo, 22), [geo]);

  /* The three destinations every point moves between. */
  const layouts = useMemo(() => {
    const surface = sampleSurface(geo, COUNT);
    const grid = new Float32Array(COUNT * 3);
    const record = new Float32Array(COUNT * 3);

    const cols = 84;
    const rows = Math.ceil(COUNT / cols);
    for (let i = 0; i < COUNT; i++) {
      const cx = (i % cols) - (cols - 1) / 2;
      const cy = Math.floor(i / cols) - (rows - 1) / 2;
      grid[i * 3] = cx * 0.034;
      grid[i * 3 + 1] = -cy * 0.034;
      grid[i * 3 + 2] = 0;

      // Compacted: eight dense bands, the shape of a record in a table.
      const band = i % 8;
      const along = Math.floor(i / 8) / (COUNT / 8);
      record[i * 3] = (along - 0.5) * 1.85;
      record[i * 3 + 1] = (band - 3.5) * 0.062;
      record[i * 3 + 2] = 0;
    }
    return { surface, grid, record };
  }, [geo]);

  const cloudGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(layouts.surface), 3));
    return g;
  }, [layouts]);

  const steel = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: new THREE.Color('#98a2a8'), metalness: 1, roughness: 0.26,
      envMapIntensity: 2.1, transparent: true, opacity: 1,
    }),
    [],
  );
  const wireMat = useMemo(
    () => new THREE.LineBasicMaterial({ color: new THREE.Color(palette.accent), transparent: true, opacity: 0 }),
    [palette.accent],
  );
  const pointMat = useMemo(
    () => new THREE.PointsMaterial({
      color: new THREE.Color(palette.accent), size: 0.017, transparent: true, opacity: 0,
      depthWrite: false, blending: THREE.AdditiveBlending,
    }),
    [palette.accent],
  );
  const scanTex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 128; c.height = 128;
    const ctx = c.getContext('2d');
    if (!ctx) return null;
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, 'rgba(255,255,255,0.95)');
    g.addColorStop(0.42, 'rgba(255,255,255,0.3)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, []);

  const scanMat = useMemo(
    () => new THREE.MeshBasicMaterial({
      color: new THREE.Color(palette.accent), transparent: true, opacity: 0,
      map: scanTex, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
    }),
    [palette.accent, scanTex],
  );

  /* A studio environment, so the metal reads as metal in the first act. */
  useEffect(() => {
    const c = document.createElement('canvas');
    c.width = 256; c.height = 128;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const g = ctx.createLinearGradient(0, 0, 0, 128);
    g.addColorStop(0, '#3c464d'); g.addColorStop(0.5, '#0e1317'); g.addColorStop(1, '#1d262b');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 256, 128);
    const key = ctx.createRadialGradient(80, 18, 2, 80, 18, 70);
    key.addColorStop(0, '#ffffff'); key.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = key; ctx.fillRect(0, 0, 256, 90);
    const tex = new THREE.CanvasTexture(c);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    steel.envMap = tex;
    steel.needsUpdate = true;
    return () => { tex.dispose(); };
  }, [steel]);

  useEffect(() => () => {
    geo.dispose(); edges.dispose(); cloudGeo.dispose();
    steel.dispose(); wireMat.dispose(); pointMat.dispose(); scanMat.dispose();
    scanTex?.dispose();
  }, [geo, edges, cloudGeo, steel, wireMat, pointMat, scanMat, scanTex]);

  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    const p = clamp01(progress.current ?? 0);
    const t = state.clock.elapsedTime;
    const g = group.current;
    if (!g) return;

    // Orientation is choreographed by scroll, not by the clock. A free spin
    // would put the part edge-on at the exact moment the scan or the wireframe
    // needs to be read; here every beat has a chosen angle, and the part settles
    // face-on by the time it is a grid, because a table is not read at 40°.
    const flat = ease(seg(p, 0.5, 0.78));
    const drift = Math.sin(t * 0.22) * 0.1 * (1 - seg(p, 0.1, 0.3));
    g.rotation.y = (-0.62 + p * 0.55 + drift) * (1 - flat);
    g.rotation.x = (-0.42 + p * 0.18) * (1 - flat);

    // The object is framed above the writing rather than behind it: a beautiful
    // sequence that makes a paragraph hard to read is a failed sequence. On a
    // short viewport it recentres, because there is no room to lift it.
    const tall = state.size.height > 720;
    const lift = tall ? 0.62 : 0.34;
    g.position.y += (lift - g.position.y) * 0.1;

    /* --- act 1: matter, scanned ------------------------------------------ */
    const scanT = seg(p, 0.16, 0.42);
    const dissolve = seg(p, 0.3, 0.5);
    if (solid.current) {
      steel.opacity = 1 - dissolve;
      solid.current.visible = steel.opacity > 0.01;
    }
    if (scan.current) {
      const active = scanT > 0 && scanT < 1;
      scanMat.opacity = active ? 0.62 * Math.sin(scanT * Math.PI) : 0;
      scan.current.position.y = -1.5 + scanT * 3;
      scan.current.visible = active;
    }

    /* --- act 2: geometry without material -------------------------------- */
    const wireIn = seg(p, 0.26, 0.44);
    const wireOut = seg(p, 0.46, 0.6);
    wireMat.opacity = wireIn * (1 - wireOut) * 0.8;
    if (wire.current) wire.current.visible = wireMat.opacity > 0.01;

    /* --- act 3: data ------------------------------------------------------ */
    const cloudIn = seg(p, 0.42, 0.56);
    pointMat.opacity = cloudIn * 0.95;
    pointMat.size = 0.02 - seg(p, 0.68, 0.9) * 0.005;

    const toGrid = ease(seg(p, 0.54, 0.72));
    const toRecord = ease(seg(p, 0.76, 0.9));

    const file = ease(seg(p, 0.9, 1));
    pointMat.opacity *= 1 - file * 0.6;

    if (cloud.current) {
      cloud.current.visible = pointMat.opacity > 0.01;
      cloud.current.position.set(file * 0.6, -file * 0.42, 0);
      cloud.current.scale.setScalar(1 - file * 0.42);
      const attr = cloudGeo.getAttribute('position') as THREE.BufferAttribute;
      const arr = attr.array as Float32Array;
      for (let i = 0; i < COUNT; i++) {
        const j = i * 3;
        // Surface → grid → record, as one continuous blend.
        const sx = layouts.surface[j]!, sy = layouts.surface[j + 1]!, sz = layouts.surface[j + 2]!;
        const gx = layouts.grid[j]!, gy = layouts.grid[j + 1]!, gz = layouts.grid[j + 2]!;
        const rx = layouts.record[j]!, ry = layouts.record[j + 1]!, rz = layouts.record[j + 2]!;
        const ax = sx + (gx - sx) * toGrid;
        const ay = sy + (gy - sy) * toGrid;
        const az = sz + (gz - sz) * toGrid;
        // A little turbulence while in flight, so the transition reads as
        // motion rather than as a cross-fade between two pictures.
        const fly = toGrid * (1 - toGrid) * 4;
        tmp.set(
          ax + (rx - ax) * toRecord + Math.sin(t * 2 + i) * 0.012 * fly,
          ay + (ry - ay) * toRecord + Math.cos(t * 2.3 + i) * 0.012 * fly,
          az + (rz - az) * toRecord,
        );
        arr[j] = tmp.x; arr[j + 1] = tmp.y; arr[j + 2] = tmp.z;
      }
      attr.needsUpdate = true;
    }
  });

  return (
    <group ref={group} rotation={[-0.5, 0, 0]} scale={0.55}>
      <mesh ref={solid} geometry={geo} material={steel} />
      <lineSegments ref={wire} geometry={edges} material={wireMat} />
      <points ref={cloud} geometry={cloudGeo} material={pointMat} />
      <mesh ref={scan} material={scanMat} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.4, 4.4]} />
      </mesh>
    </group>
  );
}

export default function MateriaScene({ progress, palette }: Props) {
  return (
    <Canvas
      aria-hidden
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 5.6], fov: 34 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.25;
      }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 3]} intensity={2.6} />
      <directionalLight position={[2, 2.5, 6]} intensity={1.9} />
      <directionalLight position={[-4, -1, 2]} intensity={0.8} color={palette.accent} />
      <Sequence progress={progress} palette={palette} />
    </Canvas>
  );
}
