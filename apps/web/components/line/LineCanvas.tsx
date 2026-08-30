'use client';

import { useEffect, useRef } from 'react';
import type { Palette } from '@/lib/palette';
import { stationFromProgress, stations } from './stations';

/**
 * The Line, drawn.
 *
 * Canvas rather than WebGL, deliberately: the hero already holds a GPU context,
 * and this scene is 2D by nature — a section through a process, the way it would
 * be drawn on a sheet. It runs at full rate on a five-year-old phone.
 *
 * The world moves past a fixed read-head rather than the camera travelling, so
 * the composition never drifts off centre and the active station is always in
 * the same place on screen. Everything is derived from one scalar: progress.
 */
export default function LineCanvas({
  progress,
  palette,
}: {
  progress: React.RefObject<number>;
  palette: Palette;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    let t0 = performance.now();

    // Chaotic inbound tokens — the mess before station 02.
    const debris = Array.from({ length: 26 }, () => ({
      r: Math.random(),
      y: (Math.random() - 0.5) * 2,
      s: 0.4 + Math.random() * 0.9,
      p: Math.random() * Math.PI * 2,
    }));

    function resize() {
      const parent = canvas!.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas!.width = Math.floor(w * dpr);
      canvas!.height = Math.floor(h * dpr);
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function line(x1: number, y1: number, x2: number, y2: number, color: string, width = 1, dash: number[] = []) {
      ctx!.save();
      ctx!.strokeStyle = color;
      ctx!.lineWidth = width;
      ctx!.setLineDash(dash);
      ctx!.beginPath();
      ctx!.moveTo(x1, y1);
      ctx!.lineTo(x2, y2);
      ctx!.stroke();
      ctx!.restore();
    }

    function draw(now: number) {
      const time = (now - t0) / 1000;
      const p = progress.current ?? 0;
      const { index, local } = stationFromProgress(p);

      ctx!.clearRect(0, 0, w, h);

      const cy = h * 0.5;
      const spacing = Math.min(280, Math.max(170, w * 0.22));
      // The token rests ON the active station for most of its dwell and only
      // travels during the last part of the segment, so the caption and the
      // read-head always describe the same thing.
      const travel = easeInOut(clamp((local - 0.55) / 0.45, 0, 1));
      const worldPos = index + travel;
      const headX = w * 0.5;

      /* ---- the rail ------------------------------------------------------ */
      const railGrad = ctx!.createLinearGradient(0, 0, w, 0);
      railGrad.addColorStop(0, 'transparent');
      railGrad.addColorStop(0.12, palette.rule);
      railGrad.addColorStop(0.88, palette.rule);
      railGrad.addColorStop(1, 'transparent');
      line(0, cy, w, cy, railGrad as unknown as string, 1);

      // Travelled portion of the rail, in accent.
      const doneGrad = ctx!.createLinearGradient(0, 0, headX, 0);
      doneGrad.addColorStop(0, 'transparent');
      doneGrad.addColorStop(0.25, palette.accent);
      doneGrad.addColorStop(1, palette.accent);
      ctx!.save();
      ctx!.globalAlpha = 0.55;
      line(0, cy, headX, cy, doneGrad as unknown as string, 1.4);
      ctx!.restore();

      /* ---- debris converging into order ---------------------------------- */
      // Before station 02 the inbound is unstructured; it collapses onto the
      // rail exactly when the system starts reading.
      const order = clamp((worldPos - 0.2) / 1.6, 0, 1);
      ctx!.save();
      for (const d of debris) {
        const x = headX + (d.r - worldPos / stations.length) * spacing * stations.length * 0.62;
        if (x < -40 || x > w + 40) continue;
        const drift = Math.sin(time * 0.5 + d.p) * 26 * d.s;
        const y = cy + (d.y * 64 * d.s + drift) * (1 - order);
        const a = (1 - order) * 0.5 + 0.06;
        ctx!.globalAlpha = a;
        ctx!.fillStyle = palette.muted;
        ctx!.fillRect(x, y, 9 * d.s, 2);
      }
      ctx!.restore();

      /* ---- stations ------------------------------------------------------ */
      stations.forEach((s, i) => {
        const x = headX + (i - worldPos) * spacing;
        if (x < -160 || x > w + 160) return;

        const active = i === index;
        const passed = i < index || (i === index && local > 0.55);
        const isGate = s.kind === 'gate';
        const color = passed ? palette.accent : active ? palette.ink : palette.rule;

        // tick
        const tick = active ? 30 : 18;
        line(x, cy - tick, x, cy + tick, color, active ? 1.6 : 1);

        // index
        ctx!.save();
        ctx!.font = '500 10px ui-monospace, SFMono-Regular, Menlo, monospace';
        ctx!.fillStyle = active ? palette.accent : palette.rule;
        ctx!.textAlign = 'center';
        ctx!.fillText(s.k, x, cy - tick - 12);
        ctx!.restore();

        if (isGate) drawGate(x, cy, i, index, local, time);
        else if (s.kind === 'result') drawResult(x, cy, passed);
        else drawNode(x, cy, active, passed, s.kind, time);
      });

      /* ---- the travelling document --------------------------------------- */
      const gateIndex = stations.findIndex((s) => s.kind === 'gate');
      // The token rides the head, except at the gate where it is held back.
      let tokenX = headX;
      const atGate = index === gateIndex;
      if (atGate) {
        const hold = clamp((local - 0.12) / 0.5, 0, 1);
        tokenX = headX - spacing * 0.16 * (1 - hold * 0.15);
        if (local > 0.72) tokenX = headX - spacing * 0.16 + spacing * 0.16 * clamp((local - 0.72) / 0.28, 0, 1);
      }
      drawToken(tokenX, cy, index, local, time);

      raf = requestAnimationFrame(draw);
    }

    /* ------------------------------------------------------------- pieces --*/

    function drawNode(x: number, cy: number, active: boolean, passed: boolean, kind: string, time: number) {
      const r = active ? 7 : 5;
      ctx!.save();
      if (kind === 'decide') {
        // A diamond: this is where a judgement is made.
        ctx!.translate(x, cy);
        ctx!.rotate(Math.PI / 4);
        ctx!.strokeStyle = passed ? palette.accent : active ? palette.ink : palette.rule;
        ctx!.lineWidth = 1.4;
        ctx!.strokeRect(-r, -r, r * 2, r * 2);
        if (passed) {
          ctx!.fillStyle = palette.accent;
          ctx!.globalAlpha = 0.18;
          ctx!.fillRect(-r, -r, r * 2, r * 2);
        }
      } else {
        ctx!.strokeStyle = passed ? palette.accent : active ? palette.ink : palette.rule;
        ctx!.fillStyle = palette.accent;
        ctx!.lineWidth = 1.4;
        ctx!.beginPath();
        ctx!.arc(x, cy, r, 0, Math.PI * 2);
        ctx!.stroke();
        if (passed) {
          ctx!.globalAlpha = 0.22 + Math.sin(time * 2) * 0.05;
          ctx!.fill();
        }
      }
      ctx!.restore();
    }

    /** The gate: two bars that close across the rail and hold the document. */
    function drawGate(x: number, cy: number, i: number, index: number, local: number, time: number) {
      const before = index < i;
      const at = index === i;
      const after = index > i;
      // 0 = open, 1 = fully closed
      const closed = before ? 0 : after ? 0 : clamp((local - 0.05) / 0.28, 0, 1) * (1 - clamp((local - 0.7) / 0.3, 0, 1));
      const gap = 46;
      const bar = gap * closed;

      ctx!.save();
      ctx!.strokeStyle = at && closed > 0.4 ? palette.amber : palette.rule;
      ctx!.lineWidth = 3;
      ctx!.lineCap = 'butt';
      ctx!.beginPath();
      ctx!.moveTo(x, cy - gap);
      ctx!.lineTo(x, cy - gap + bar);
      ctx!.moveTo(x, cy + gap);
      ctx!.lineTo(x, cy + gap - bar);
      ctx!.stroke();

      // approval mark once the person has acted
      if (at && local > 0.62) {
        const a = clamp((local - 0.62) / 0.14, 0, 1);
        ctx!.globalAlpha = a;
        ctx!.strokeStyle = palette.accent;
        ctx!.lineWidth = 2;
        ctx!.lineCap = 'round';
        ctx!.beginPath();
        ctx!.moveTo(x - 8, cy - 62);
        ctx!.lineTo(x - 2, cy - 56);
        ctx!.lineTo(x + 9, cy - 70);
        ctx!.stroke();
      } else if (at && closed > 0.6) {
        ctx!.globalAlpha = 0.5 + Math.sin(time * 3.4) * 0.35;
        ctx!.fillStyle = palette.amber;
        ctx!.beginPath();
        ctx!.arc(x, cy - 62, 3.4, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.restore();
    }

    function drawResult(x: number, cy: number, passed: boolean) {
      ctx!.save();
      ctx!.strokeStyle = passed ? palette.accent : palette.rule;
      ctx!.lineWidth = 1.4;
      ctx!.strokeRect(x - 11, cy - 14, 22, 28);
      ctx!.globalAlpha = 0.5;
      for (let i = 0; i < 3; i++) {
        line(x - 6, cy - 6 + i * 6, x + 6, cy - 6 + i * 6, passed ? palette.accent : palette.rule, 1);
      }
      ctx!.restore();
    }

    /** The request itself: a small sheet that gains structure as it travels. */
    function drawToken(x: number, cy: number, index: number, local: number, time: number) {
      const gateIndex = stations.findIndex((s) => s.kind === 'gate');
      const held = index === gateIndex && local > 0.1 && local < 0.7;
      const wobble = held ? Math.sin(time * 6) * 0.6 : 0;

      ctx!.save();
      ctx!.translate(x + wobble, cy);

      // glow
      const g = ctx!.createRadialGradient(0, 0, 0, 0, 0, 34);
      g.addColorStop(0, hexA(held ? palette.amber : palette.accent, 0.32));
      g.addColorStop(1, hexA(held ? palette.amber : palette.accent, 0));
      ctx!.fillStyle = g;
      ctx!.fillRect(-34, -34, 68, 68);

      ctx!.fillStyle = held ? palette.amber : palette.accent;
      ctx!.fillRect(-7, -9, 14, 18);

      // structure lines appear from station 03 onward
      const structured = clamp((index + local - 1.6) / 1.2, 0, 1);
      ctx!.globalAlpha = structured;
      ctx!.strokeStyle = hexA(palette.ink, 0.85);
      ctx!.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        ctx!.beginPath();
        ctx!.moveTo(-4, -5 + i * 5);
        ctx!.lineTo(4, -5 + i * 5);
        ctx!.stroke();
      }
      ctx!.restore();
    }

    resize();
    t0 = performance.now();
    raf = requestAnimationFrame(draw);
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [palette, progress]);

  return <canvas ref={ref} className="absolute inset-0" aria-hidden />;
}

/* -------------------------------------------------------------- helpers ---- */

function clamp(v: number, a: number, b: number) {
  return Math.min(b, Math.max(a, v));
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

/** Adds an alpha channel to a token colour, whatever notation it came in. */
function hexA(color: string, alpha: number) {
  const c = color.trim();
  if (c.startsWith('#') && (c.length === 7 || c.length === 4)) {
    const full =
      c.length === 4 ? `#${c[1]}${c[1]}${c[2]}${c[2]}${c[3]}${c[3]}` : c;
    const r = parseInt(full.slice(1, 3), 16);
    const g = parseInt(full.slice(3, 5), 16);
    const b = parseInt(full.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }
  return c;
}
