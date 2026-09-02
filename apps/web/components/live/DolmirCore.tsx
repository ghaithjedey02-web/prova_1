'use client';

import { useEffect, useRef } from 'react';
import { usePalette } from '@/lib/palette';

/**
 * The DOLMIR Core — the physical presence of the system in the console.
 *
 * A machined dark ring with a breathing cyan aperture: the same object the
 * film resolves into, so the cinematic and the console read as one system.
 * It is not a mascot and not an orb — it is an instrument, and it is the
 * microphone: clicking the Core starts the voice interaction.
 *
 * States, driven by the console:
 *   idle       slow breath
 *   listening  strong pulse + expanding ripples (the system is hearing you)
 *   thinking   the dashed orbit accelerates and tightens
 *   speaking   radial ticks modulate around the ring like a voice
 *   amber      everything slows and warms — a decision point
 *
 * While listening, the ring is driven by the REAL microphone amplitude
 * (`level`, a ref written by the voice layer's analyser): the ripples and the
 * radial ticks answer the visitor's actual voice, so the feedback is a
 * measurement rather than an animation that would run just the same in a
 * silent room.
 *
 * Canvas 2D, one rAF, ~1KB of state; reduced motion renders a still ring.
 */

export type CoreState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'amber';

export function DolmirCore({
  state,
  onActivate,
  label,
  level,
  className = 'size-40 sm:size-48',
}: {
  state: CoreState;
  onActivate?: () => void;
  label: string;
  /** Live microphone amplitude 0..1 while listening. */
  level?: React.RefObject<number>;
  /** The box the instrument fills; the drawing scales with it. */
  className?: string;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<CoreState>(state);
  stateRef.current = state;
  const levelRef = useRef(0);
  const liveLevel = level ?? levelRef;
  const palette = usePalette();

  useEffect(() => {
    const el = canvas.current;
    if (!el || !palette) return;
    const ctx = el.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let running = false;
    // Eased intensity per state so transitions glide instead of snapping.
    let energy = 0;      // 0 calm → 1 listening/speaking
    let warmth = 0;      // 0 cyan → 1 amber
    let spin = 0;
    let amp = 0;         // smoothed real microphone amplitude

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = el.getBoundingClientRect();
      el.width = Math.floor(r.width * dpr);
      el.height = Math.floor(r.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { w: r.width, h: r.height };
    };
    let { w, h } = size();

    const mix = (a: string, b: string, t: number) => {
      const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
      const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
      const c = pa.map((v, i) => Math.round(v + (pb[i]! - v) * t));
      return `rgb(${c[0]},${c[1]},${c[2]})`;
    };

    let last = performance.now();
    function draw(now: number) {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const t = now / 1000;
      const s = stateRef.current;

      const targetEnergy = s === 'listening' ? 1 : s === 'speaking' ? 0.85 : s === 'thinking' ? 0.5 : s === 'amber' ? 0.15 : 0.22;
      const targetWarmth = s === 'amber' ? 1 : 0;
      energy += (targetEnergy - energy) * Math.min(1, dt * 4);
      warmth += (targetWarmth - warmth) * Math.min(1, dt * 4);
      // Fast attack, slow release: speech reads as impulses, not as a wobble.
      const target = s === 'listening' ? Math.min(1, liveLevel.current) : 0;
      amp += (target - amp) * Math.min(1, dt * (target > amp ? 18 : 6));
      spin += dt * (s === 'thinking' ? 1.6 : s === 'amber' ? 0.08 : 0.35);

      const cx = w / 2;
      const cy = h / 2;
      const R = Math.min(w, h) * 0.32;
      const breath = Math.sin(t * (s === 'listening' ? 4.2 : 1.3)) * (0.5 + energy) * 0.035;
      const r = R * (1 + breath);
      const col = mix(palette!.accent, palette!.amber, warmth);

      ctx!.clearRect(0, 0, w, h);

      // Aperture glow — the system's presence.
      const glow = ctx!.createRadialGradient(cx, cy, 0, cx, cy, r * 1.9);
      glow.addColorStop(0, col);
      glow.addColorStop(1, 'transparent');
      ctx!.save();
      ctx!.globalAlpha = 0.16 + energy * 0.2;
      ctx!.fillStyle = glow;
      ctx!.fillRect(cx - r * 2, cy - r * 2, r * 4, r * 4);
      ctx!.restore();

      // The machined body: two dark concentric rings.
      ctx!.save();
      ctx!.strokeStyle = palette!.rule;
      ctx!.lineWidth = Math.max(1.5, R * 0.1);
      ctx!.globalAlpha = 0.9;
      ctx!.beginPath(); ctx!.arc(cx, cy, r * 1.22, 0, Math.PI * 2); ctx!.stroke();
      ctx!.lineWidth = 1;
      ctx!.globalAlpha = 0.6;
      ctx!.beginPath(); ctx!.arc(cx, cy, r * 1.32, 0, Math.PI * 2); ctx!.stroke();
      ctx!.restore();

      // The living inner edge.
      ctx!.save();
      ctx!.strokeStyle = col;
      ctx!.globalAlpha = 0.55 + energy * 0.4;
      ctx!.lineWidth = 1.6;
      ctx!.beginPath(); ctx!.arc(cx, cy, r, 0, Math.PI * 2); ctx!.stroke();

      // Dashed orbit — thinking accelerates it.
      ctx!.globalAlpha = 0.5;
      ctx!.lineWidth = 1;
      ctx!.setLineDash([3, 9]);
      ctx!.beginPath(); ctx!.arc(cx, cy, r * 1.12, spin, spin + Math.PI * 2); ctx!.stroke();
      ctx!.setLineDash([]);

      // Voice ticks — radial bars that modulate while speaking/listening.
      const ticks = 36;
      for (let i = 0; i < ticks; i++) {
        const a = (i / ticks) * Math.PI * 2 + spin * 0.4;
        const mod = s === 'speaking'
          ? 0.5 + 0.5 * Math.abs(Math.sin(t * 7 + i * 1.7))
          : s === 'listening'
            // The visitor's own voice, measured: a quiet room keeps the ring quiet.
            ? 0.18 + (0.25 + 0.75 * Math.abs(Math.sin(t * 5 + i * 0.9))) * amp * 1.5
            : 0.25;
        const l = 3 + mod * energy * 10;
        const r0 = r * 0.82;
        ctx!.globalAlpha = 0.25 + mod * energy * 0.55;
        ctx!.lineWidth = 1.2;
        ctx!.beginPath();
        ctx!.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0);
        ctx!.lineTo(cx + Math.cos(a) * (r0 - l), cy + Math.sin(a) * (r0 - l));
        ctx!.stroke();
      }

      // Listening ripples — sound arriving at the system.
      if (s === 'listening') {
        for (let k = 0; k < 2; k++) {
          const ph = ((t * 0.7 + k * 0.5) % 1);
          ctx!.globalAlpha = (1 - ph) * (0.12 + amp * 0.45);
          ctx!.lineWidth = 1;
          ctx!.beginPath();
          ctx!.arc(cx, cy, r * (1.25 + ph * 0.55), 0, Math.PI * 2);
          ctx!.stroke();
        }
      }
      ctx!.restore();

      raf = requestAnimationFrame(draw);
    }

    function still() {
      const cx = w / 2, cy = h / 2, R = Math.min(w, h) * 0.32;
      ctx!.clearRect(0, 0, w, h);
      ctx!.strokeStyle = palette!.rule;
      ctx!.lineWidth = Math.max(1.5, R * 0.1);
      ctx!.beginPath(); ctx!.arc(cx, cy, R * 1.22, 0, Math.PI * 2); ctx!.stroke();
      ctx!.strokeStyle = palette!.accent;
      ctx!.lineWidth = 1.6;
      ctx!.globalAlpha = 0.8;
      ctx!.beginPath(); ctx!.arc(cx, cy, R, 0, Math.PI * 2); ctx!.stroke();
    }

    const ro = new ResizeObserver(() => { ({ w, h } = size()); if (reduce) still(); });
    ro.observe(el);

    if (reduce) { still(); return () => ro.disconnect(); }

    const io = new IntersectionObserver(([e]) => {
      if (e?.isIntersecting && !running) { running = true; last = performance.now(); raf = requestAnimationFrame(draw); }
      else if (!e?.isIntersecting && running) { running = false; cancelAnimationFrame(raf); }
    }, { rootMargin: '60px' });
    io.observe(el);

    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); };
  }, [palette]);

  return (
    <button
      type="button"
      onClick={onActivate}
      aria-label={label}
      className={`group relative block rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${className}`}
    >
      <canvas ref={canvas} aria-hidden className="absolute inset-0 h-full w-full" />
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden className="text-accent opacity-70 transition-opacity group-hover:opacity-100">
          <rect x="5" y="1" width="4" height="7" rx="2" fill="currentColor" />
          <path d="M3 6v1a4 4 0 0 0 8 0V6M7 11v2" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
        </svg>
      </span>
    </button>
  );
}
