'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { PART, holeAngles } from './part';

/**
 * The hero render.
 *
 * Deliberately not a rotating primitive. This is FL-2280 built from its real
 * dimensions, in machined steel, lit the way a part is lit when it is being
 * inspected: one hard key from above, a cold fill, and a rim that separates the
 * edge from the black.
 *
 * There is no drei and no HDRI download. The environment is a gradient painted
 * into a canvas and run through PMREM, which is what makes the metal read as
 * metal — a MeshStandardMaterial with metalness 1 and no environment is just a
 * black silhouette. It costs one 512×256 canvas.
 */

type Palette = { accent: string; ink: string; amber: string; steel: string };

/* --------------------------------------------------------------- geometry ---*/

function useFlangeGeometry() {
  return useMemo(() => {
    const S = 0.0155; // mm → world units
    const outer = (PART.outerDiameter / 2) * S;
    const bore = (PART.innerDiameter / 2) * S;
    const bcd = (PART.boltCircle / 2) * S;
    const hole = (PART.holeDiameter / 2) * S;

    const shape = new THREE.Shape();
    shape.absarc(0, 0, outer, 0, Math.PI * 2, false);

    const bore_ = new THREE.Path();
    bore_.absarc(0, 0, bore, 0, Math.PI * 2, true);
    shape.holes.push(bore_);

    for (const a of holeAngles()) {
      const h = new THREE.Path();
      h.absarc(Math.cos(a) * bcd, Math.sin(a) * bcd, hole, 0, Math.PI * 2, true);
      shape.holes.push(h);
    }

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: PART.thickness * S,
      bevelEnabled: true,
      bevelThickness: 0.012,
      bevelSize: 0.012,
      bevelSegments: 3,
      curveSegments: 84,
    });
    geo.center();
    geo.computeVertexNormals();
    return geo;
  }, []);
}

function useHubGeometry() {
  return useMemo(() => {
    const S = 0.0155;
    const geo = new THREE.CylinderGeometry(
      (PART.hubDiameter / 2) * S,
      (PART.hubDiameter / 2) * S,
      PART.hubHeight * S,
      96,
      1,
      true,
    );
    return geo;
  }, []);
}

/* ------------------------------------------------------------ environment ---*/

/**
 * A softbox and a floor, painted into an equirectangular canvas. This is the
 * whole lighting rig for the reflections; the actual lights below only carve
 * the form.
 */
function useStudioEnvironment(dark: boolean) {
  const { gl, scene } = useThree();

  useEffect(() => {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 256;
    const ctx = c.getContext('2d');
    if (!ctx) return;

    const sky = ctx.createLinearGradient(0, 0, 0, 256);
    if (dark) {
      sky.addColorStop(0, '#20262b');
      sky.addColorStop(0.42, '#0d1013');
      sky.addColorStop(0.52, '#050708');
      sky.addColorStop(1, '#0b0e10');
    } else {
      sky.addColorStop(0, '#ffffff');
      sky.addColorStop(0.45, '#cfd6d9');
      sky.addColorStop(0.55, '#9aa4a9');
      sky.addColorStop(1, '#e6eaea');
    }
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, 512, 256);

    // Key softbox, upper left-of-centre.
    const key = ctx.createRadialGradient(170, 34, 4, 170, 34, 120);
    key.addColorStop(0, dark ? '#ffffff' : '#ffffff');
    key.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = key;
    ctx.fillRect(0, 0, 512, 160);

    // Cold instrument bounce, right side — where the accent colour comes from.
    const rim = ctx.createRadialGradient(392, 96, 2, 392, 96, 108);
    rim.addColorStop(0, dark ? 'rgba(120,220,240,0.85)' : 'rgba(90,160,180,0.6)');
    rim.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = rim;
    ctx.fillRect(200, 20, 312, 200);

    const tex = new THREE.CanvasTexture(c);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.colorSpace = THREE.SRGBColorSpace;

    const pmrem = new THREE.PMREMGenerator(gl);
    pmrem.compileEquirectangularShader();
    const rt = pmrem.fromEquirectangular(tex);
    scene.environment = rt.texture;

    return () => {
      scene.environment = null;
      rt.dispose();
      pmrem.dispose();
      tex.dispose();
    };
  }, [gl, scene, dark]);
}

/* ------------------------------------------------------------------ part ----*/

function Part({ palette, dark, pointer }: { palette: Palette; dark: boolean; pointer: React.RefObject<{ x: number; y: number }> }) {
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const flange = useFlangeGeometry();
  const hub = useHubGeometry();

  useStudioEnvironment(dark);

  const steel = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(dark ? '#8b969c' : '#b9c1c5'),
        metalness: 1,
        roughness: 0.29,
        envMapIntensity: dark ? 1.15 : 0.9,
      }),
    [dark],
  );

  const machined = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(dark ? '#6d777c' : '#a3acb0'),
        metalness: 1,
        roughness: 0.46,
        envMapIntensity: dark ? 1 : 0.8,
        side: THREE.DoubleSide,
      }),
    [dark],
  );

  const accentRing = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(palette.accent),
        transparent: true,
        opacity: 0.5,
      }),
    [palette.accent],
  );

  useEffect(() => () => {
    flange.dispose();
    hub.dispose();
    steel.dispose();
    machined.dispose();
    accentRing.dispose();
  }, [flange, hub, steel, machined, accentRing]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    // A slow inspection turn — the speed of a part on a rotary table, not a logo.
    g.rotation.z += delta * 0.09;

    const p = pointer.current ?? { x: 0, y: 0 };
    const targetX = -0.62 + p.y * 0.16;
    const targetY = p.x * 0.26;
    g.rotation.x += (targetX - g.rotation.x) * Math.min(1, delta * 3);
    g.position.x += (p.x * 0.12 - g.position.x) * Math.min(1, delta * 3);
    g.position.y += (0.02 + -p.y * 0.08 - g.position.y) * Math.min(1, delta * 3);
    g.rotation.y = targetY;

    if (ring.current) {
      const t = state.clock.elapsedTime;
      const s = 1 + Math.sin(t * 0.7) * 0.012;
      ring.current.scale.setScalar(s);
      (ring.current.material as THREE.MeshBasicMaterial).opacity = 0.26 + Math.sin(t * 0.7) * 0.16;
    }
  });

  const S = 0.0155;

  return (
    <group ref={group} rotation={[-0.62, 0, 0]}>
      <mesh geometry={flange} material={steel} castShadow receiveShadow />
      <mesh
        geometry={hub}
        material={machined}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, (PART.thickness / 2 + PART.hubHeight / 2) * S]}
      />
      {/* Measurement ring: the outer diameter being reported, not decoration. */}
      <mesh ref={ring} material={accentRing} position={[0, 0, -(PART.thickness / 2) * S - 0.02]}>
        <ringGeometry args={[(PART.outerDiameter / 2) * S + 0.05, (PART.outerDiameter / 2) * S + 0.056, 128]} />
      </mesh>
    </group>
  );
}

/* ----------------------------------------------------------------- motes ----*/

function Motes({ color }: { color: string }) {
  const pts = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const n = 180;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 9;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 5.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);

  const mat = useMemo(
    () => new THREE.PointsMaterial({ color: new THREE.Color(color), size: 0.014, transparent: true, opacity: 0.5, depthWrite: false }),
    [color],
  );

  useEffect(() => () => { geo.dispose(); mat.dispose(); }, [geo, mat]);

  useFrame((_, delta) => {
    if (pts.current) pts.current.rotation.y += delta * 0.014;
  });

  return <points ref={pts} geometry={geo} material={mat} />;
}

/* ---------------------------------------------------------------- export ----*/

export default function ForgeScene({ palette, dark }: { palette: Palette; dark: boolean }) {
  const pointer = useRef({ x: 0, y: 0 });
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    function onMove(e: PointerEvent) {
      const r = el!.getBoundingClientRect();
      pointer.current = {
        x: ((e.clientX - r.left) / r.width - 0.5) * 2,
        y: ((e.clientY - r.top) / r.height - 0.5) * 2,
      };
    }
    function onLeave() { pointer.current = { x: 0, y: 0 }; }
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div ref={host} className="absolute inset-0">
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 5.1], fov: 32 }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = dark ? 1.15 : 1.02;
        }}
      >
        <ambientLight intensity={dark ? 0.28 : 0.7} />
        <directionalLight position={[3.2, 4.4, 3]} intensity={dark ? 2.4 : 2.1} color="#ffffff" />
        <directionalLight position={[-4, -1.5, 2]} intensity={dark ? 1.1 : 0.6} color={palette.accent} />
        <pointLight position={[0, 0, -3.4]} intensity={dark ? 3.2 : 1.2} color={palette.accent} distance={9} />
        <Part palette={palette} dark={dark} pointer={pointer} />
        <Motes color={dark ? palette.steel : palette.accent} />
      </Canvas>
    </div>
  );
}
