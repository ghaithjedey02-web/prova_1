'use client';

import { useEffect, useRef, useState } from 'react';
import { usePalette } from '@/lib/palette';
import { heroScene as c } from '@/content/site';

/**
 * THE HERO SCENE — the product, happening, before a word is read.
 *
 * Fourteen seconds, looping, five beats:
 *
 *   ARRIVA      recognisable things — EMAIL, PDF, ORDINE, FATTURA — drift in,
 *               tilted, unrelated, the way a Monday inbox actually looks
 *   CAPISCE     they find lanes and flow into the core
 *   VERIFICA    out the other side they are rows: a field, a value, a source
 *   SI FERMA    one row does not add up — amber — and the core stops. A
 *               person marker appears. Nothing moves until it is decided.
 *   AGISCE      released: the rows complete and leave, ordered
 *
 * The scene replaces an abstract polyhedron that said "technology" and
 * nothing else. Every object here is something a company receives, and the
 * one moment the whole product is built around — stopping for a person — is
 * the only amber on screen.
 *
 * Canvas 2D, wall-clock timed, paused off-screen. The beat word is DOM in the
 * brand typeface; the labels on the sheets are drawn with the same webfont.
 * Under reduced motion the composed mid-story frame is drawn once and stays.
 */

const BEATS = [3.2, 2.6, 2.8, 3.0, 2.4] as const;      // seconds per beat
const TOTAL = BEATS.reduce((a, b) => a + b, 0);
const KINDS = ['EMAIL', 'PDF', 'ORDINE', 'FATTURA', 'EXCEL', 'WHATSAPP', 'EMAIL', 'PDF'] as const;
const N = 34;

interface Doc {
  cx: number; cy: number; rot: number; vx: number; vy: number; vr: number;
  lane: number; phase: number; w: number; h: number; kind: string;
}

function makeDocs(): Doc[] {
  let seed = 4821;
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  return Array.from({ length: N }, (_, i) => ({
    cx: rnd() * 0.7, cy: rnd(), rot: (rnd() - 0.5) * 1.3,
    vx: (rnd() - 0.5) * 0.010, vy: (rnd() - 0.5) * 0.010, vr: (rnd() - 0.5) * 0.3,
    lane: i % 4, phase: rnd(), w: 0.085 + rnd() * 0.035, h: 0.050 + rnd() * 0.02,
    kind: KINDS[i % KINDS.length]!,
  }));
}

function beatAt(t: number): [number, number] {
  let acc = 0;
  for (let i = 0; i < BEATS.length; i++) {
    if (t < acc + BEATS[i]!) return [i, (t - acc) / BEATS[i]!];
    acc += BEATS[i]!;
  }
  return [BEATS.length - 1, 1];
}

export function HeroScene() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const palette = usePalette();
  const [reduce, setReduce] = useState<boolean | null>(null);
  const [beat, setBeat] = useState(0);
  const beatRef = useRef(0);

  useEffect(() => { setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches); }, []);

  useEffect(() => {
    const el = canvas.current, box = host.current;
    if (!el || !box || !palette || reduce === null) return;
    const ctx = el.getContext('2d');
    if (!ctx) return;

    const pal = palette;
    const docs = makeDocs();
    const mono = getComputedStyle(document.body).getPropertyValue('--font-mono') || 'monospace';
    let w = 0, h = 0, raf = 0, running = false;
    let origin = performance.now();
    let t = 0;

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = box.getBoundingClientRect();
      w = r.width; h = r.height;
      el.width = Math.floor(w * dpr); el.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();

    const ease = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);
    const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

    function sheet(x: number, y: number, rot: number, sw: number, sh: number, a: number, color: string, label: string) {
      ctx!.save();
      ctx!.translate(x, y); ctx!.rotate(rot);
      ctx!.globalAlpha = a;
      ctx!.fillStyle = pal.ground;
      ctx!.fillRect(-sw / 2, -sh / 2, sw, sh);
      ctx!.strokeStyle = color; ctx!.lineWidth = 1;
      ctx!.strokeRect(-sw / 2, -sh / 2, sw, sh);
      // the label: what this thing IS
      ctx!.fillStyle = color;
      ctx!.font = `500 ${Math.max(8, Math.min(11, sh * 0.30))}px ${mono}`;
      ctx!.textBaseline = 'middle';
      ctx!.fillText(label, -sw / 2 + sw * 0.10, -sh / 2 + sh * 0.34);
      // two ruled lines: content
      ctx!.globalAlpha = a * 0.45;
      for (let i = 0; i < 2; i++) {
        const ly = -sh / 2 + sh * (0.62 + i * 0.2);
        ctx!.beginPath();
        ctx!.moveTo(-sw / 2 + sw * 0.10, ly);
        ctx!.lineTo(sw / 2 - sw * (i ? 0.45 : 0.12), ly);
        ctx!.stroke();
      }
      ctx!.restore();
    }

    function frame(tt: number) {
      const [b, k] = beatAt(tt);
      if (b !== beatRef.current) { beatRef.current = b; setBeat(b); }
      ctx!.clearRect(0, 0, w, h);

      // the core sits right of centre; documents come from the left
      const cx = w * 0.62, cy = h * 0.5;
      const R = Math.min(w * 0.11, h * 0.19);
      const laneGap = h * 0.13;
      const amber = b === 3;
      const col = amber ? pal.amber : pal.accent;

      /* ---- documents ------------------------------------------------ */
      const gather = b === 0 ? ease(k) * 0.08 : b === 1 ? 0.08 + ease(k) * 0.92 : 1;
      for (const d of docs) {
        const chaosX = ((d.cx + d.vx * tt * 5 + 1) % 1) * w * 0.62;
        const chaosY = ((d.cy + d.vy * tt * 5 + 1) % 1) * h;
        const chaosR = d.rot + d.vr * tt * 0.2;
        const laneY = cy + (d.lane - 1.5) * laneGap;
        const travel = (d.phase + tt * 0.14) % 1;
        const laneX = lerp(-w * 0.05, cx - R * 1.25, travel);
        const x = lerp(chaosX, laneX, gather);
        const y = lerp(chaosY, laneY, gather);
        const rot = lerp(chaosR, 0, gather);
        let a = 0.42 + gather * 0.3;
        if (b >= 2) {
          const near = Math.max(0, 1 - Math.abs(x - (cx - R * 1.25)) / (w * 0.26));
          a *= 1 - near;
        }
        if (b >= 3) a *= 0.3;
        if (a < 0.02) continue;
        sheet(x, y, rot, d.w * w * 0.72, d.h * h, a, gather > 0.5 ? pal.accent : pal.muted, d.kind);
      }

      /* ---- lane guides --------------------------------------------- */
      if (b >= 1 && b <= 2) {
        ctx!.save();
        ctx!.globalAlpha = 0.14 * (b === 1 ? ease(k) : 1);
        ctx!.strokeStyle = pal.accent; ctx!.lineWidth = 1;
        for (let i = 0; i < 4; i++) {
          const ly = cy + (i - 1.5) * laneGap;
          ctx!.beginPath(); ctx!.moveTo(0, ly); ctx!.lineTo(cx - R * 1.2, ly); ctx!.stroke();
        }
        ctx!.restore();
      }

      /* ---- structured rows out ------------------------------------- */
      if (b >= 2) {
        const held = b === 3;
        for (let i = 0; i < 4; i++) {
          const ry = cy + (i - 1.5) * laneGap;
          const appear = ease(b === 2 ? k * 1.7 - i * 0.16 : 1);
          if (appear <= 0) continue;
          const x0 = cx + R * 1.25;
          const full = w - x0 - w * 0.03;
          const bad = held && i === 2;
          const len = full * appear * (held ? (bad ? 0.55 : 0.4) : b === 4 ? 1 : 0.85);
          ctx!.save();
          ctx!.globalAlpha = (bad ? 1 : held ? 0.35 : 0.75) * appear;
          ctx!.strokeStyle = bad ? pal.amber : pal.accent; ctx!.lineWidth = 1;
          ctx!.strokeRect(x0, ry - h * 0.024, w * 0.045, h * 0.048);
          ctx!.beginPath(); ctx!.moveTo(x0 + w * 0.056, ry); ctx!.lineTo(x0 + len, ry); ctx!.stroke();
          if (bad) {
            // the person marker: a small square with a dot — someone, not something
            const px = x0 + len + w * 0.02;
            ctx!.fillStyle = pal.amber;
            ctx!.globalAlpha = 0.9;
            ctx!.strokeRect(px, ry - h * 0.03, h * 0.06, h * 0.06);
            ctx!.beginPath(); ctx!.arc(px + h * 0.03, ry - h * 0.008, h * 0.011, 0, Math.PI * 2); ctx!.fill();
            ctx!.font = `500 ${Math.max(9, h * 0.026)}px ${mono}`;
            ctx!.textBaseline = 'middle';
            ctx!.fillText('PERSONA', px + h * 0.075, ry);
          }
          ctx!.restore();
        }
      }

      /* ---- the core ------------------------------------------------ */
      const spin = b === 3 ? 0 : tt * (b >= 1 ? 0.55 : 0.2);
      ctx!.save();
      const g = ctx!.createRadialGradient(cx, cy, 0, cx, cy, R * 3.2);
      g.addColorStop(0, col); g.addColorStop(1, 'transparent');
      ctx!.globalAlpha = amber ? 0.26 : b === 0 ? 0.07 : 0.17;
      ctx!.fillStyle = g;
      ctx!.fillRect(cx - R * 3.4, cy - R * 3.4, R * 6.8, R * 6.8);
      ctx!.globalAlpha = b === 0 ? 0.35 : 0.95;
      ctx!.strokeStyle = col; ctx!.lineWidth = 1.6;
      ctx!.beginPath(); ctx!.arc(cx, cy, R, 0, Math.PI * 2); ctx!.stroke();
      ctx!.globalAlpha = 0.45; ctx!.lineWidth = 1;
      ctx!.setLineDash([4, 10]);
      ctx!.beginPath(); ctx!.arc(cx, cy, R * 1.3, spin, spin + Math.PI * 2); ctx!.stroke();
      ctx!.setLineDash([]);
      ctx!.globalAlpha = 0.9;
      ctx!.strokeStyle = pal.rule; ctx!.lineWidth = 5;
      ctx!.beginPath(); ctx!.arc(cx, cy, R * 1.55, 0, Math.PI * 2); ctx!.stroke();
      // inner ticks that breathe while it works
      const ticks = 28;
      for (let i = 0; i < ticks; i++) {
        const a0 = (i / ticks) * Math.PI * 2 + spin * 0.4;
        const mod = b === 3 ? 0.2 : 0.3 + 0.7 * Math.abs(Math.sin(tt * 4 + i * 0.8));
        const l = 3 + mod * 9;
        ctx!.strokeStyle = col; ctx!.lineWidth = 1.2;
        ctx!.globalAlpha = 0.25 + mod * 0.5;
        ctx!.beginPath();
        ctx!.moveTo(cx + Math.cos(a0) * R * 0.8, cy + Math.sin(a0) * R * 0.8);
        ctx!.lineTo(cx + Math.cos(a0) * (R * 0.8 - l), cy + Math.sin(a0) * (R * 0.8 - l));
        ctx!.stroke();
      }
      ctx!.restore();
    }

    function draw(now: number) {
      t = ((now - origin) / 1000) % TOTAL;
      frame(t);
      raf = requestAnimationFrame(draw);
    }

    const ro = new ResizeObserver(() => { size(); if (reduce) frame(BEATS[0]! + BEATS[1]! + BEATS[2]! + 0.4); });
    ro.observe(box);

    if (reduce) { frame(BEATS[0]! + BEATS[1]! + BEATS[2]! + 0.4); return () => ro.disconnect(); }

    const io = new IntersectionObserver(([e]) => {
      if (e?.isIntersecting && !running) { running = true; origin = performance.now() - t * 1000; raf = requestAnimationFrame(draw); }
      else if (!e?.isIntersecting && running) { running = false; cancelAnimationFrame(raf); }
    }, { threshold: 0.1 });
    io.observe(box);
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); };
  }, [palette, reduce]);

  const s = c.beats[reduce ? 3 : beat] ?? c.beats[0]!;

  return (
    <div ref={host} className="relative h-full w-full">
      <canvas ref={canvas} aria-hidden className="absolute inset-0 h-full w-full" />
      {/* the beat, named — DOM, our type. Inset from the right so it sits
          clear of the edge fade; on phones the word alone, the line would
          collide with the headline below the band. */}
      <div className="pointer-events-none absolute bottom-3 left-4 flex flex-col gap-1.5 sm:bottom-14 sm:left-auto sm:right-[12%] sm:items-end sm:text-right">
        <p key={`w${reduce ? 3 : beat}`} className={`settle font-display text-[clamp(1rem,2vw,1.5rem)] font-semibold uppercase leading-none tracking-[0.04em] ${s.amber ? 'text-amber' : 'text-ink'}`}>
          {s.word}
        </p>
        <p key={`l${reduce ? 3 : beat}`} className="settle hidden max-w-[26ch] text-[length:var(--text-micro)] leading-snug text-ink-2 sm:block">
          {s.line}
        </p>
        <div className="mt-1 flex gap-1" aria-hidden>
          {c.beats.map((x, i) => (
            <span key={x.word} className={`block h-0.5 w-5 transition-colors duration-300 ${i < beat ? 'bg-accent/60' : i === beat ? (x.amber ? 'bg-amber' : 'bg-accent') : 'bg-rule-strong'}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
