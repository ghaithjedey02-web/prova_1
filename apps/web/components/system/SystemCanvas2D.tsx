'use client';

import { useEffect, useRef } from 'react';
import type { Palette } from '@/lib/palette';
import { stagePosition } from './stages';

/**
 * The system without a GPU.
 *
 * Same six states, same narrative, drawn in 2D: a core, orbital rings, a field
 * of information fragments that goes from scattered to lattice to stream to
 * ordered result, and modules that extend during the exploded view. It runs on
 * a five-year-old phone and it is the tier most visitors on mobile will see, so
 * it is built to be good rather than tolerated.
 */
export default function SystemCanvas2D({
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
    let smoothed = 0;
    const t0 = performance.now();

    const N = 90;
    const seeds = Array.from({ length: N }, () => ({
      a: Math.random() * Math.PI * 2,
      r: 0.55 + Math.random() * 0.6,
      y: Math.random() - 0.5,
      s: Math.random(),
    }));

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas!.width = Math.floor(w * dpr);
      canvas!.height = Math.floor(h * dpr);
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
    const band = (x: number, a: number, b: number, f = 0.6) =>
      clamp01(Math.min((x - a + f) / f, (b + f - x) / f));
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    function draw(now: number) {
      const time = (now - t0) / 1000;
      const target = stagePosition(progress.current ?? 0);
      smoothed += (target - smoothed) * 0.08;
      const s = smoothed;

      ctx!.clearRect(0, 0, w, h);

      const cx = w * 0.5;
      const cy = h * 0.5;
      const unit = Math.min(w, h) * 0.34;
      const hold = band(s, 4.85, 5.35, 0.45);
      const live = clamp01((s - 2.2) / 1.1);
      const explode = band(s, 3.6, 5.8, 0.8);
      const accent = hold > 0.5 ? palette.amber : palette.accent;

      /* --- core halo --- */
      const halo = ctx!.createRadialGradient(cx, cy, 0, cx, cy, unit * 1.5);
      halo.addColorStop(0, withAlpha(accent, 0.16 + live * 0.2));
      halo.addColorStop(1, withAlpha(accent, 0));
      ctx!.fillStyle = halo;
      ctx!.fillRect(cx - unit * 1.6, cy - unit * 1.6, unit * 3.2, unit * 3.2);

      /* --- rings --- */
      const spin = lerp(1, 0.05, hold);
      [0.62, 0.82, 1.06].forEach((r, i) => {
        ctx!.save();
        ctx!.translate(cx, cy);
        ctx!.rotate(time * (0.06 + i * 0.04) * spin * (i % 2 ? -1 : 1));
        ctx!.scale(1, 0.34 + i * 0.05);
        ctx!.strokeStyle = withAlpha(accent, 0.34 - i * 0.09);
        ctx!.lineWidth = 1;
        ctx!.beginPath();
        ctx!.arc(0, 0, unit * r, 0, Math.PI * 2);
        ctx!.stroke();
        ctx!.restore();
      });

      /* --- fragments: chaos → lattice → orbit → result --- */
      const wChaos = band(s, -0.4, 1.6, 0.8);
      const wLat = band(s, 2.0, 2.9, 0.7);
      const wOrb = band(s, 3.2, 5.4, 0.8);
      const wRes = band(s, 5.9, 7.0, 0.7);
      const tot = wChaos + wLat + wOrb + wRes || 1;
      const order = clamp01((wLat + wOrb + wRes) / tot);

      ctx!.save();
      ctx!.globalCompositeOperation = 'lighter';
      seeds.forEach((sd, i) => {
        const drift = hold > 0.5 ? 0 : Math.sin(time * (0.4 + sd.s * 0.5) + i) * unit * 0.03;

        const chaosX = cx + Math.cos(sd.a) * unit * (2.1 + sd.r);
        const chaosY = cy + sd.y * h * 0.6 + drift;

        const cols = 12;
        const latX = cx + (((i % cols) - (cols - 1) / 2) * unit) / 6.4;
        const latY = cy + ((Math.floor(i / cols) - N / cols / 2) * unit) / 6.4;

        const oa = (i / N) * Math.PI * 6 + time * 0.14 * spin;
        const orr = unit * (0.6 + (i % 5) * 0.09);
        const orbX = cx + Math.cos(oa) * orr;
        const orbY = cy + Math.sin(oa) * orr * 0.4;

        const ra = (i / N) * Math.PI * 2;
        const resX = cx + Math.cos(ra) * unit * 1.02;
        const resY = cy + Math.sin(ra) * unit * 0.4;

        const x = (chaosX * wChaos + latX * wLat + orbX * wOrb + resX * wRes) / tot;
        const y = (chaosY * wChaos + latY * wLat + orbY * wOrb + resY * wRes) / tot;

        const len = lerp(3, 9, order) * (0.6 + sd.s * 0.7);
        ctx!.strokeStyle = withAlpha(accent, 0.14 + clamp01(tot) * 0.5);
        ctx!.lineWidth = 1.4;
        ctx!.beginPath();
        if (order > 0.5) {
          ctx!.moveTo(x - len / 2, y);
          ctx!.lineTo(x + len / 2, y);
        } else {
          const ang = sd.a + time * 0.2;
          ctx!.moveTo(x - Math.cos(ang) * len / 2, y - Math.sin(ang) * len / 2);
          ctx!.lineTo(x + Math.cos(ang) * len / 2, y + Math.sin(ang) * len / 2);
        }
        ctx!.stroke();
      });
      ctx!.restore();

      /* --- modules + wires --- */
      const mods = 8;
      const mr = lerp(unit * 0.95, unit * 1.5, explode);
      for (let i = 0; i < mods; i++) {
        const a = (i / mods) * Math.PI * 2 + time * 0.05 * spin;
        const mx = cx + Math.cos(a) * mr;
        const my = cy + Math.sin(a) * mr * 0.42;
        ctx!.strokeStyle = withAlpha(accent, 0.06 + explode * 0.3);
        ctx!.lineWidth = 1;
        ctx!.beginPath();
        ctx!.moveTo(cx, cy);
        ctx!.lineTo(mx, my);
        ctx!.stroke();

        const size = lerp(3, 7, explode);
        ctx!.strokeStyle = withAlpha(palette.ink, 0.35 + explode * 0.35);
        ctx!.lineWidth = 1.2;
        ctx!.strokeRect(mx - size / 2, my - size / 2, size, size);
      }

      /* --- core --- */
      ctx!.save();
      ctx!.strokeStyle = withAlpha(accent, 0.3 + explode * 0.35);
      ctx!.lineWidth = 1.2;
      const shellR = unit * (0.44 + explode * 0.22);
      ctx!.beginPath();
      for (let i = 0; i <= 6; i++) {
        const a = (i / 6) * Math.PI * 2 - Math.PI / 2 + time * 0.05 * spin;
        const px = cx + Math.cos(a) * shellR;
        const py = cy + Math.sin(a) * shellR;
        i === 0 ? ctx!.moveTo(px, py) : ctx!.lineTo(px, py);
      }
      ctx!.stroke();

      const coreR = unit * 0.2 * (1 + Math.sin(time * 1.1) * 0.02);
      const cg = ctx!.createRadialGradient(cx, cy, 0, cx, cy, coreR);
      cg.addColorStop(0, withAlpha(accent, 0.25 + live * 0.6));
      cg.addColorStop(1, withAlpha(accent, 0.05));
      ctx!.fillStyle = cg;
      ctx!.beginPath();
      ctx!.arc(cx, cy, coreR, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.restore();

      raf = requestAnimationFrame(draw);
    }

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [palette, progress]);

  return <canvas ref={ref} className="fixed inset-0 h-full w-full" aria-hidden />;
}

function withAlpha(color: string, alpha: number) {
  const c = color.trim();
  if (c.startsWith('#')) {
    const full = c.length === 4 ? `#${c[1]}${c[1]}${c[2]}${c[2]}${c[3]}${c[3]}` : c;
    const r = parseInt(full.slice(1, 3), 16);
    const g = parseInt(full.slice(3, 5), 16);
    const b = parseInt(full.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }
  return c;
}
