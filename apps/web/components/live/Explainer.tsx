'use client';

import { useEffect, useRef, useState } from 'react';
import { usePalette } from '@/lib/palette';
import { explainer as c } from '@/content/site';

/**
 * THE EXPLAINER — what DOLMIR does, as motion design, rendered by the site.
 *
 * Seven beats, twenty-one seconds, looping:
 *
 *   CAOS              documents adrift, unaligned, going nowhere
 *   UN SOLO FLUSSO    they find lanes and converge
 *   DATI              the ring reads them; they become fields with sources
 *   VERIFICA          each field is checked against another source
 *   CONFLITTO         two sources disagree — everything else dims, amber
 *   DECIDE UNA PERSONA the ring stops. It does not resolve this itself.
 *   AZIONE            approved: the flow leaves, ordered, and is written down
 *
 * Why this is code and not a video:
 *
 *   1. Every word on screen is real DOM in the brand's own typeface. Generated
 *      footage cannot render trustworthy typography, and text baked into a
 *      video cannot be read by a screen reader, translated, or corrected.
 *   2. It weighs a few kilobytes instead of megabytes, and starts instantly.
 *   3. It always works. The previous flagship pointed at a CDN URL belonging
 *      to a generation service — an asset that can disappear without notice,
 *      leaving an empty black box where the argument used to be.
 *
 * Canvas 2D, one rAF, wall-clock timed so a slow frame drops motion rather
 * than stretching the story. Under reduced motion nothing moves: the seven
 * beats render as a still storyboard, which carries the same argument.
 */

const BEAT = 3.0;                    // seconds per beat
const TOTAL = c.beats.length * BEAT;
const DOCS = 54;

interface Doc {
  /** chaos position + drift */
  cx: number; cy: number; rot: number; vx: number; vy: number; vr: number;
  /** the lane it eventually finds */
  lane: number; phase: number; w: number; h: number;
}

function makeDocs(): Doc[] {
  // Deterministic: the same composition every load, no hydration surprises.
  let seed = 20260901;
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  return Array.from({ length: DOCS }, () => ({
    cx: rnd(), cy: rnd(), rot: (rnd() - 0.5) * 1.6,
    vx: (rnd() - 0.5) * 0.012, vy: (rnd() - 0.5) * 0.012, vr: (rnd() - 0.5) * 0.35,
    lane: Math.floor(rnd() * 5), phase: rnd(), w: 0.030 + rnd() * 0.022, h: 0.042 + rnd() * 0.026,
  }));
}

export function Explainer({ children }: { children?: React.ReactNode }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const palette = usePalette();
  const [reduce, setReduce] = useState<boolean | null>(null);
  const [beat, setBeat] = useState(0);
  const beatRef = useRef(0);

  useEffect(() => {
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    const el = canvas.current;
    const box = host.current;
    if (!el || !box || !palette || reduce !== false) return;
    const ctx = el.getContext('2d');
    if (!ctx) return;

    const pal = palette;
    const docs = makeDocs();
    let w = 0, h = 0, raf = 0, running = false;
    let t = 0;                       // story clock, seconds
    /* Absolute wall time, not an accumulator: at 7fps an accumulator with a
       per-frame clamp silently runs the story at a fraction of speed. The
       clock is the clock; a slow device drops frames, not seconds. */
    let origin = performance.now();

    function size() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = box!.getBoundingClientRect();
      w = r.width; h = r.height;
      el!.width = Math.floor(w * dpr);
      el!.height = Math.floor(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    size();

    const ease = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);
    const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

    /** One sheet of paper: a rectangle with a few ruled lines. */
    function sheet(x: number, y: number, rot: number, sw: number, sh: number, alpha: number, color: string) {
      ctx!.save();
      ctx!.translate(x, y);
      ctx!.rotate(rot);
      ctx!.globalAlpha = alpha;
      ctx!.strokeStyle = color;
      ctx!.lineWidth = 1;
      ctx!.strokeRect(-sw / 2, -sh / 2, sw, sh);
      ctx!.globalAlpha = alpha * 0.55;
      for (let i = 1; i <= 3; i++) {
        const ly = -sh / 2 + (sh / 4) * i;
        ctx!.beginPath();
        ctx!.moveTo(-sw / 2 + sw * 0.16, ly);
        ctx!.lineTo(sw / 2 - sw * (i === 3 ? 0.42 : 0.16), ly);
        ctx!.stroke();
      }
      ctx!.restore();
    }

    function draw(now: number) {
      t = ((now - origin) / 1000) % TOTAL;

      const b = Math.floor(t / BEAT);
      const k = (t % BEAT) / BEAT;               // 0..1 within the beat
      if (b !== beatRef.current) { beatRef.current = b; setBeat(b); }

      ctx!.clearRect(0, 0, w, h);

      const cx = w * 0.5, cy = h * 0.5;
      const R = Math.min(w, h) * 0.17;

      /* ---------------------------------------------------------- documents */
      // How gathered the flow is: 0 chaos, 1 fully in lanes and consumed.
      const gather = b === 0 ? ease(k) * 0.12 : b === 1 ? 0.12 + ease(k) * 0.88 : 1;
      const consumed = b >= 2;

      for (const d of docs) {
        // chaos position, drifting
        const chaosX = ((d.cx + d.vx * t * 6) % 1.2 - 0.1) * w;
        const chaosY = ((d.cy + d.vy * t * 6) % 1.2 - 0.1) * h;
        const chaosR = d.rot + d.vr * t * 0.25;

        // lane position: five ordered lanes converging on the ring
        const laneY = cy + (d.lane - 2) * (h * 0.115);
        const travel = (d.phase + t * 0.16) % 1;
        const laneX = lerp(-w * 0.06, cx - R * 1.35, travel);

        const x = lerp(chaosX, laneX, gather);
        const y = lerp(chaosY, laneY, gather);
        const rot = lerp(chaosR, 0, gather);

        // Once the ring is reading, sheets fade as they reach it.
        let a = 0.30 + gather * 0.28;
        if (consumed) {
          const near = Math.max(0, 1 - Math.abs(x - (cx - R * 1.35)) / (w * 0.34));
          a *= 1 - near;
          if (b >= 5) a *= 0.25;                 // the flow is held at the gate
        }
        if (a <= 0.01) continue;
        sheet(x, y, rot, d.w * w, d.h * h, a, gather > 0.5 ? pal.accent : pal.muted);
      }

      /* -------------------------------------------------------- lane guides */
      if (b >= 1 && b <= 4) {
        ctx!.save();
        ctx!.globalAlpha = 0.16 * (b === 1 ? ease(k) : 1);
        ctx!.strokeStyle = pal.accent;
        ctx!.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
          const ly = cy + (i - 2) * (h * 0.115);
          ctx!.beginPath();
          ctx!.moveTo(0, ly);
          ctx!.lineTo(cx - R * 1.3, ly);
          ctx!.stroke();
        }
        ctx!.restore();
      }

      /* ------------------------------------------------- structured output */
      // Paper goes in on the left; structure comes out on the right. Without
      // this the ring looks like a drain rather than a process.
      if (b >= 2) {
        const rows = 5;
        const held = b === 5;                    // the gate holds the output
        for (let i = 0; i < rows; i++) {
          const ry = cy + (i - 2) * (h * 0.115);
          const appear = ease(b === 2 ? k * 1.6 - i * 0.14 : 1);
          if (appear <= 0) continue;
          const x0 = cx + R * 1.32;
          const full = w * 0.30;
          const len = full * appear * (held ? 0.35 : 1);
          const bad = (b === 4 || b === 5) && i === 3;   // the row in dispute
          ctx!.save();
          ctx!.globalAlpha = (bad ? 0.95 : held ? 0.30 : 0.62) * appear;
          ctx!.strokeStyle = bad ? pal.amber : pal.accent;
          ctx!.lineWidth = 1;
          // a key box and its value rule: a field, not a shape
          ctx!.strokeRect(x0, ry - h * 0.022, w * 0.045, h * 0.044);
          ctx!.beginPath();
          ctx!.moveTo(x0 + w * 0.055, ry);
          ctx!.lineTo(x0 + len, ry);
          ctx!.stroke();
          ctx!.restore();
        }
      }

      /* ------------------------------------------------- verification beams */
      if (b === 3 || b === 4) {
        const conflict = b === 4;
        for (let i = 0; i < 4; i++) {
          const a0 = -Math.PI / 2 + (i / 4) * Math.PI * 2 + t * 0.15;
          const rr = R * 2.15;
          const px = cx + Math.cos(a0) * rr;
          const py = cy + Math.sin(a0) * rr * 0.62;
          // The fourth pair is the one that disagrees.
          const bad = conflict && i === 3;
          const prog = ease(conflict ? 1 : k * 1.4 - i * 0.12);
          if (prog <= 0) continue;
          ctx!.save();
          ctx!.globalAlpha = (bad ? 0.85 : conflict ? 0.16 : 0.5) * prog;
          ctx!.strokeStyle = bad ? pal.amber : pal.accent;
          ctx!.lineWidth = bad ? 1.6 : 1;
          ctx!.beginPath();
          ctx!.moveTo(cx + Math.cos(a0) * R * 1.08, cy + Math.sin(a0) * R * 1.08);
          ctx!.lineTo(px, py);
          ctx!.stroke();
          ctx!.fillStyle = bad ? pal.amber : pal.accent;
          ctx!.globalAlpha = (bad ? 1 : 0.6) * prog;
          ctx!.fillRect(px - 3, py - 3, 6, 6);
          ctx!.restore();
        }
      }

      /* ------------------------------------------------------- action burst */
      if (b === 6) {
        const p = ease(k);
        for (let i = 0; i < 5; i++) {
          const ly = cy + (i - 2) * (h * 0.115);
          const x0 = cx + R * 1.3;
          const x1 = lerp(x0, w * 1.02, p);
          ctx!.save();
          ctx!.globalAlpha = 0.5 * (1 - p * 0.4);
          ctx!.strokeStyle = pal.accent;
          ctx!.lineWidth = 1.5;
          ctx!.beginPath();
          ctx!.moveTo(x0, ly);
          ctx!.lineTo(x1, ly);
          ctx!.stroke();
          ctx!.restore();
        }
      }

      /* -------------------------------------------------------------- ring */
      const amber = b === 4 || b === 5;
      const col = amber ? pal.amber : pal.accent;
      const spin = b === 5 ? 0 : t * (b >= 2 ? 0.5 : 0.16);
      ctx!.save();
      // glow
      const g = ctx!.createRadialGradient(cx, cy, 0, cx, cy, R * 2.2);
      g.addColorStop(0, col);
      g.addColorStop(1, 'transparent');
      ctx!.globalAlpha = b === 0 ? 0.05 : amber ? 0.20 : 0.13;
      ctx!.fillStyle = g;
      ctx!.fillRect(cx - R * 2.4, cy - R * 2.4, R * 4.8, R * 4.8);

      ctx!.globalAlpha = b === 0 ? 0.30 : 0.85;
      ctx!.strokeStyle = col;
      ctx!.lineWidth = 1.5;
      ctx!.beginPath(); ctx!.arc(cx, cy, R, 0, Math.PI * 2); ctx!.stroke();

      ctx!.globalAlpha = 0.4;
      ctx!.setLineDash([4, 10]);
      ctx!.beginPath(); ctx!.arc(cx, cy, R * 1.28, spin, spin + Math.PI * 2); ctx!.stroke();
      ctx!.setLineDash([]);
      ctx!.restore();

      raf = requestAnimationFrame(draw);
    }

    const ro = new ResizeObserver(size);
    ro.observe(box);
    const io = new IntersectionObserver(([e]) => {
      if (e?.isIntersecting && !running) { running = true; origin = performance.now() - t * 1000; raf = requestAnimationFrame(draw); }
      else if (!e?.isIntersecting && running) { running = false; cancelAnimationFrame(raf); }
    }, { threshold: 0.2 });
    io.observe(box);

    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); };
  }, [palette, reduce]);

  /* ------------------------------------------------------- reduced motion */
  if (reduce) {
    return (
      <div className="relative overflow-hidden border border-rule-strong bg-void">
        <div className="grid gap-px bg-rule sm:grid-cols-2 lg:grid-cols-4">
          {c.beats.map((s) => (
            <div key={s.word} className="bg-void p-4">
              <p className={`font-display text-[1.05rem] font-semibold uppercase leading-none tracking-[0.04em] ${s.amber ? 'text-amber' : 'text-ink'}`}>
                {s.word}
              </p>
              <p className="mt-2 text-[length:var(--text-micro)] leading-snug text-ink-2">{s.line}</p>
            </div>
          ))}
        </div>
        {children && <div className="flex items-center justify-center border-t border-rule py-8">{children}</div>}
      </div>
    );
  }

  const s = c.beats[beat] ?? c.beats[0]!;

  return (
    <div ref={host} className="relative aspect-[21/9] overflow-hidden border border-rule-strong bg-void">
      <canvas ref={canvas} aria-hidden className="absolute inset-0 h-full w-full" />

      {/* Every word is real DOM, in our own typeface. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
        <p className={`telemetry ${s.amber ? 'text-amber' : 'text-accent'}`}>{s.code}</p>
        <div className="flex items-center gap-1">
          {c.beats.map((x, i) => (
            <span
              key={x.code}
              className={`block h-0.5 w-4 transition-colors duration-300 sm:w-6 ${
                i < beat ? 'bg-accent/70' : i === beat ? (x.amber ? 'bg-amber' : 'bg-accent') : 'bg-rule-strong'
              }`}
            />
          ))}
        </div>
      </div>

      {children && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center [&>*]:pointer-events-auto">
          {children}
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-void via-void/70 to-transparent px-4 pb-4 pt-14 sm:px-5">
        <p
          key={`w${beat}`}
          className={`settle text-center font-display text-[clamp(1.15rem,3.2vw,2.1rem)] font-semibold uppercase leading-none tracking-[0.05em] ${
            s.amber ? 'text-amber' : 'text-ink'
          }`}
        >
          {s.word}
        </p>
        <p key={`l${beat}`} className="settle mx-auto mt-2 max-w-[44rem] text-center text-[length:var(--text-small)] leading-snug text-ink-2">
          {s.line}
        </p>
      </div>
    </div>
  );
}
