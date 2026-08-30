'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { Palette } from '@/lib/palette';
import { stagePosition } from './stages';

/**
 * The DOLMIR system, rendered.
 *
 * This is one continuous machine that changes state as the page scrolls; it is
 * not a background image and it is not six different scenes. Everything below
 * reads a single smoothed stage value:
 *
 *   0 SYS.INIT  core idle
 *   1 INPUT     unstructured fragments arrive from outside the frame
 *   2 PARSE     the fragments snap onto a lattice
 *   3 INFER     the lattice is drawn into the core; the core lights
 *   4 EXEC      the shell separates and modules extend — an exploded view
 *   5 HOLD      everything stops, one node holds amber, waiting for a person
 *   6 OUTPUT    the system recomposes into an ordered result
 *
 * Deliberate constraints: no postprocessing pass and no HDRI, because both mean
 * a new dependency or a download. Glow is additive geometry and an emissive
 * core; the environment is a gradient painted into a canvas and run through
 * PMREM. Instanced geometry keeps the fragment field to one draw call.
 */

const FRAGMENTS = 150;
const MODULES = 8;

type Props = { palette: Palette; dark: boolean; progress: React.RefObject<number> };

/* --------------------------------------------------------------- helpers ---*/

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function clamp01(v: number) { return Math.min(1, Math.max(0, v)); }
/** 1 inside [a,b], falling to 0 over `fade` either side. */
function band(x: number, a: number, b: number, fade = 0.6) {
  return clamp01(Math.min((x - a + fade) / fade, (b + fade - x) / fade));
}

function useEnvironment(dark: boolean) {
  const { gl, scene } = useThree();
  useEffect(() => {
    const c = document.createElement('canvas');
    c.width = 512; c.height = 256;
    const ctx = c.getContext('2d');
    if (!ctx) return;

    const g = ctx.createLinearGradient(0, 0, 0, 256);
    if (dark) {
      g.addColorStop(0, '#1b2126'); g.addColorStop(0.45, '#0b0e11');
      g.addColorStop(0.55, '#050708'); g.addColorStop(1, '#0a0d10');
    } else {
      g.addColorStop(0, '#ffffff'); g.addColorStop(0.45, '#d5dbde');
      g.addColorStop(0.55, '#a3adb2'); g.addColorStop(1, '#e9eded');
    }
    ctx.fillStyle = g; ctx.fillRect(0, 0, 512, 256);

    const key = ctx.createRadialGradient(150, 30, 4, 150, 30, 130);
    key.addColorStop(0, '#ffffff'); key.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = key; ctx.fillRect(0, 0, 512, 170);

    const rim = ctx.createRadialGradient(400, 100, 2, 400, 100, 120);
    rim.addColorStop(0, dark ? 'rgba(110,215,240,0.9)' : 'rgba(80,150,175,0.6)');
    rim.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = rim; ctx.fillRect(200, 10, 312, 220);

    const tex = new THREE.CanvasTexture(c);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    const pmrem = new THREE.PMREMGenerator(gl);
    pmrem.compileEquirectangularShader();
    const rt = pmrem.fromEquirectangular(tex);
    scene.environment = rt.texture;
    return () => { scene.environment = null; rt.dispose(); pmrem.dispose(); tex.dispose(); };
  }, [gl, scene, dark]);
}

/* ------------------------------------------------------------------ core ---*/

function Core({ palette, dark, stage }: { palette: Palette; dark: boolean; stage: React.RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const shell = useRef<THREE.LineSegments>(null);
  const inner = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);

  useEnvironment(dark);

  const shellGeo = useMemo(() => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.15, 1)), []);
  const innerGeo = useMemo(() => new THREE.IcosahedronGeometry(0.58, 1), []);
  const haloGeo = useMemo(() => new THREE.PlaneGeometry(4.6, 4.6), []);

  const shellMat = useMemo(
    () => new THREE.LineBasicMaterial({ color: new THREE.Color(palette.accent), transparent: true, opacity: 0.55 }),
    [palette.accent],
  );

  const innerMat = useMemo(
    () => new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(dark ? '#0d1418' : '#8f9ba1'),
      metalness: 0.82, roughness: 0.22,
      transmission: 0.35, thickness: 1.4, ior: 1.48,
      emissive: new THREE.Color(palette.accent), emissiveIntensity: 0.22,
      envMapIntensity: 1.9,
    }),
    [dark, palette.accent],
  );

  // Additive halo. This is what reads as "the core is powered" without a bloom
  // pass — a single always-facing quad with a radial falloff baked into a texture.
  const haloMat = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const ctx = c.getContext('2d')!;
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, 'rgba(255,255,255,0.85)');
    g.addColorStop(0.28, 'rgba(255,255,255,0.20)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128);
    const tex = new THREE.CanvasTexture(c);
    return new THREE.MeshBasicMaterial({
      map: tex, color: new THREE.Color(palette.accent),
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.5,
    });
  }, [palette.accent]);

  useEffect(() => () => {
    shellGeo.dispose(); innerGeo.dispose(); haloGeo.dispose();
    shellMat.dispose(); innerMat.dispose();
    haloMat.map?.dispose(); haloMat.dispose();
  }, [shellGeo, innerGeo, haloGeo, shellMat, innerMat, haloMat]);

  useFrame((state, delta) => {
    const s = stage.current ?? 0;
    const t = state.clock.elapsedTime;
    const g = group.current;
    if (!g) return;

    // The whole core stops turning at HOLD. Freezing a live scene is the most
    // direct way to say "the machine is waiting for a person".
    const holding = band(s, 4.85, 5.35, 0.45);
    const spin = lerp(0.16, 0.005, holding);
    g.rotation.y += delta * spin;
    g.rotation.x = Math.sin(t * 0.12) * 0.07;

    // Separation: the shell lifts off the core during the exploded view.
    const explode = band(s, 3.7, 5.6, 0.7);
    if (shell.current) {
      shell.current.scale.setScalar(1 + explode * 0.55);
      (shell.current.material as THREE.LineBasicMaterial).opacity = 0.24 + explode * 0.4;
      shell.current.rotation.y -= delta * 0.09;
    }

    // Ignition: the core is dark until inference begins.
    const live = clamp01((s - 2.2) / 1.1);
    if (inner.current) {
      const m = inner.current.material as THREE.MeshPhysicalMaterial;
      m.emissiveIntensity = 0.22 + live * 0.8 + Math.sin(t * 1.7) * 0.06;
      m.emissive.set(holding > 0.4 ? palette.amber : palette.accent);
      inner.current.scale.setScalar(1 + Math.sin(t * 1.1) * 0.012);
    }
    if (halo.current) {
      const m = halo.current.material as THREE.MeshBasicMaterial;
      m.opacity = 0.3 + live * 0.42;
      m.color.set(holding > 0.4 ? palette.amber : palette.accent);
      halo.current.quaternion.copy(state.camera.quaternion);
    }
  });

  return (
    <group ref={group}>
      <mesh ref={halo} geometry={haloGeo} material={haloMat} renderOrder={-1} />
      <mesh ref={inner} geometry={innerGeo} material={innerMat} />
      <lineSegments ref={shell} geometry={shellGeo} material={shellMat} />
      <Rings palette={palette} stage={stage} />
    </group>
  );
}

/* ----------------------------------------------------------------- rings ---*/

function Rings({ palette, stage }: { palette: Palette; stage: React.RefObject<number> }) {
  const refs = [useRef<THREE.Mesh>(null), useRef<THREE.Mesh>(null), useRef<THREE.Mesh>(null)];
  const geos = useMemo(
    () => [1.42, 1.78, 2.2].map((r) => new THREE.TorusGeometry(r, 0.0055, 6, 200)),
    [],
  );
  const mats = useMemo(
    () => [0.62, 0.4, 0.24].map((o) =>
      new THREE.MeshBasicMaterial({ color: new THREE.Color(palette.accent), transparent: true, opacity: o }),
    ),
    [palette.accent],
  );

  useEffect(() => () => { geos.forEach((g) => g.dispose()); mats.forEach((m) => m.dispose()); }, [geos, mats]);

  useFrame((_, delta) => {
    const s = stage.current ?? 0;
    const hold = band(s, 4.85, 5.35, 0.45);
    const speed = lerp(1, 0.03, hold);
    refs.forEach((r, i) => {
      if (!r.current) return;
      r.current.rotation.z += delta * (0.05 + i * 0.035) * speed * (i % 2 ? -1 : 1);
      r.current.rotation.x = 1.1 + i * 0.42;
      r.current.rotation.y = i * 0.3;
    });
  });

  return (
    <>
      {geos.map((g, i) => (
        <mesh key={i} ref={refs[i]} geometry={g} material={mats[i]} />
      ))}
    </>
  );
}

/* ------------------------------------------------------------- fragments ---*/

/**
 * The information field.
 *
 * One instanced mesh carries the whole narrative: the same 150 quads are the
 * unstructured inbox at INPUT, the lattice at PARSE, the stream at INFER and
 * the ordered result at OUTPUT. Each instance interpolates between four
 * precomputed positions, so the transition costs nothing but a lerp.
 */
function Fragments({ palette, stage }: { palette: Palette; stage: React.RefObject<number> }) {
  const mesh = useRef<THREE.InstancedMesh>(null);

  const layout = useMemo(() => {
    const chaos: THREE.Vector3[] = [];
    const lattice: THREE.Vector3[] = [];
    const orbit: THREE.Vector3[] = [];
    const result: THREE.Vector3[] = [];
    const seed: number[] = [];

    const cols = 15;
    for (let i = 0; i < FRAGMENTS; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 5.5 + Math.random() * 5;
      chaos.push(new THREE.Vector3(Math.cos(a) * r, (Math.random() - 0.5) * 7, Math.sin(a) * r - 2));

      const cx = (i % cols) - (cols - 1) / 2;
      const cy = Math.floor(i / cols) - (FRAGMENTS / cols - 1) / 2;
      lattice.push(new THREE.Vector3(cx * 0.62, cy * 0.62, 0));

      const oa = (i / FRAGMENTS) * Math.PI * 2 * 3;
      const orr = 1.7 + (i % 5) * 0.34;
      orbit.push(new THREE.Vector3(Math.cos(oa) * orr, Math.sin(oa * 0.5) * 0.7, Math.sin(oa) * orr));

      const ra = (i / FRAGMENTS) * Math.PI * 2;
      const rr = 3.1;
      result.push(new THREE.Vector3(Math.cos(ra) * rr, ((i % 7) - 3) * 0.16, Math.sin(ra) * rr));

      seed.push(Math.random());
    }
    return { chaos, lattice, orbit, result, seed };
  }, []);

  const geo = useMemo(() => new THREE.PlaneGeometry(0.19, 0.038), []);
  const mat = useMemo(
    () => new THREE.MeshBasicMaterial({
      color: new THREE.Color(palette.accent), transparent: true, opacity: 1,
      blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
    }),
    [palette.accent],
  );

  useEffect(() => () => { geo.dispose(); mat.dispose(); }, [geo, mat]);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    const m = mesh.current;
    if (!m) return;
    const s = stage.current ?? 0;
    const t = state.clock.elapsedTime;

    // Where in the story the field is, as four crossfading weights.
    const wChaos = band(s, -0.4, 1.6, 0.8);
    const wLattice = band(s, 2.0, 2.9, 0.7);
    const wOrbit = band(s, 3.2, 5.4, 0.8);
    const wResult = band(s, 5.9, 7.0, 0.7);
    const total = wChaos + wLattice + wOrbit + wResult || 1;
    const hold = band(s, 4.85, 5.35, 0.45);

    for (let i = 0; i < FRAGMENTS; i++) {
      const sd = layout.seed[i]!;
      const drift = hold > 0.5 ? 0 : Math.sin(t * (0.4 + sd * 0.5) + sd * 9) * 0.16;

      tmp.set(0, 0, 0)
        .addScaledVector(layout.chaos[i]!, wChaos)
        .addScaledVector(layout.lattice[i]!, wLattice)
        .addScaledVector(layout.orbit[i]!, wOrbit)
        .addScaledVector(layout.result[i]!, wResult)
        .multiplyScalar(1 / total);

      dummy.position.set(tmp.x + drift, tmp.y + drift * 0.5, tmp.z);
      // Unstructured input tumbles; structured data lies flat and aligned.
      const order = clamp01((wLattice + wOrbit + wResult) / total);
      dummy.rotation.set(
        lerp(sd * 6, 0, order),
        lerp(sd * 5, t * 0.1, order),
        lerp(sd * 4, 0, order),
      );
      const scale = lerp(0.7, 1.15, order) * (0.7 + sd * 0.6);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;

    const visible = clamp01(total);
    mat.opacity = 0.32 + visible * 0.62;
    mat.color.set(hold > 0.5 ? palette.amber : palette.accent);
  });

  return <instancedMesh ref={mesh} args={[geo, mat, FRAGMENTS]} />;
}

/* --------------------------------------------------------------- modules ---*/

/** The connected systems: gestionale, posta, documenti, API. They extend on EXEC. */
function Modules({ palette, stage }: { palette: Palette; stage: React.RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const wires = useRef<THREE.LineSegments>(null);

  const geo = useMemo(() => new THREE.BoxGeometry(0.26, 0.26, 0.06), []);
  const mat = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: new THREE.Color('#7d878d'), metalness: 1, roughness: 0.3, envMapIntensity: 1.1,
    }),
    [],
  );
  const wireGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(MODULES * 6), 3));
    return g;
  }, []);
  const wireMat = useMemo(
    () => new THREE.LineBasicMaterial({ color: new THREE.Color(palette.accent), transparent: true, opacity: 0.3 }),
    [palette.accent],
  );

  useEffect(() => () => { geo.dispose(); mat.dispose(); wireGeo.dispose(); wireMat.dispose(); }, [geo, mat, wireGeo, wireMat]);

  useFrame((state, delta) => {
    const s = stage.current ?? 0;
    const g = group.current;
    if (!g) return;
    const explode = band(s, 3.6, 5.8, 0.8);
    const hold = band(s, 4.85, 5.35, 0.45);
    g.rotation.y += delta * lerp(0.07, 0.004, hold);

    const radius = lerp(1.75, 2.95, explode);
    const pos = wireGeo.attributes.position as THREE.BufferAttribute;
    g.children.forEach((child, i) => {
      if (!(child instanceof THREE.Mesh)) return;
      const a = (i / MODULES) * Math.PI * 2;
      const y = Math.sin(a * 2) * 0.5 * explode;
      child.position.set(Math.cos(a) * radius, y, Math.sin(a) * radius);
      child.lookAt(0, 0, 0);
      child.scale.setScalar(0.4 + explode * 0.9);
      pos.setXYZ(i * 2, 0, 0, 0);
      pos.setXYZ(i * 2 + 1, child.position.x, child.position.y, child.position.z);
    });
    pos.needsUpdate = true;
    wireMat.opacity = 0.06 + explode * 0.4;
    wireMat.color.set(hold > 0.5 ? palette.amber : palette.accent);
    if (wires.current) wires.current.rotation.copy(g.rotation);
  });

  return (
    <>
      <group ref={group}>
        {Array.from({ length: MODULES }).map((_, i) => (
          <mesh key={i} geometry={geo} material={mat} />
        ))}
      </group>
      <lineSegments ref={wires} geometry={wireGeo} material={wireMat} />
    </>
  );
}

/* ------------------------------------------------------------------ rig ----*/

function Rig({ stage, pointer }: { stage: React.RefObject<number>; pointer: React.RefObject<{ x: number; y: number }> }) {
  const look = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  useFrame((state, delta) => {
    const s = stage.current ?? 0;
    const p = pointer.current ?? { x: 0, y: 0 };
    // A slow dolly: close at the start, pulled back for the exploded view,
    // returning for the result. The camera is part of the story, not a fixture.
    const z = 6.4 - band(s, 0, 1.2, 0.9) * 1.1 + band(s, 3.6, 5.6, 0.9) * 2.0 - band(s, 5.9, 7, 0.8) * 0.5;
    // On a wide viewport the copy owns the left half, so the camera looks left
    // of the origin and the machine sits in the right half of the frame. As the
    // story moves past the opening it recentres — the system takes the stage.
    const wide = state.size.width / Math.max(1, state.size.height) > 1.15;
    const bias = wide ? -1.55 * (1 - band(s, 1.6, 7, 1.2)) : 0;
    const targetX = p.x * 0.5;
    const targetY = -p.y * 0.35 + band(s, 2, 3.2, 0.8) * 0.25;
    const cam = state.camera;
    const k = Math.min(1, delta * 2.4);
    cam.position.x = lerp(cam.position.x, targetX, k);
    cam.position.y = lerp(cam.position.y, targetY, k);
    cam.position.z = lerp(cam.position.z, z, k);
    look.set(lerp(look.x, bias, k), 0, 0);
    cam.lookAt(look);
  });
  return null;
}

/* --------------------------------------------------------------- exported --*/

export default function SystemScene({ palette, dark, progress }: Props) {
  const stage = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    function onMove(e: PointerEvent) {
      pointer.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    }
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  // Smooth the raw scroll so a flick of the wheel does not snap the machine.
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const target = stagePosition(progress.current ?? 0);
      stage.current += (target - stage.current) * 0.08;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progress]);

  return (
    <Canvas
      aria-hidden
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 6.4], fov: 40 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = dark ? 1.1 : 1.0;
      }}
    >
      <ambientLight intensity={dark ? 0.3 : 0.7} />
      <directionalLight position={[4, 5, 4]} intensity={dark ? 2.0 : 1.8} />
      <directionalLight position={[-5, -2, 2]} intensity={dark ? 0.9 : 0.5} color={palette.accent} />
      <pointLight position={[0, 0, 0]} intensity={dark ? 4 : 1.5} color={palette.accent} distance={7} />
      <Rig stage={stage} pointer={pointer} />
      <Core palette={palette} dark={dark} stage={stage} />
      <Fragments palette={palette} stage={stage} />
      <Modules palette={palette} stage={stage} />
    </Canvas>
  );
}
