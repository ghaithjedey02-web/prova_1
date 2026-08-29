'use client';

import { useEffect, useRef } from 'react';
import { stationFromProgress } from './stations';

/**
 * Tier 2 — the same five stations drawn in 2D canvas.
 *
 * This is the tier most mobile visitors will see, so it is not a degraded
 * version of the story: it is the story at a resolution that suits a small
 * screen. Same rail, same stall at the gate, same amber for uncertainty.
 */
export default function LineCanvas2D({
  progress,
  palette,
}: {
  progress: React.RefObject<number>;
  palette: { ink: string; accent: string; amber: string; muted: string; rule: string };
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const raf = useRef<number>(0);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const COUNT = 140;
    const rand = mulberry32(20260829);
    const seeds = Array.from({ length: COUNT }, () => ({
      cx: rand(), cy: rand(), flag: rand() < 0.16, j: rand(),
    }));

    let w = 0;
    let h = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas!.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    function draw() {
      const p = progress.current ?? 0;
      const { index, local } = stationFromProgress(p);
      // Settle into the captioned station, matching the 3D tier.
      const raw = Math.min(1, local / 0.6);
      const k = raw < 0.5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2;

      ctx!.clearRect(0, 0, w, h);

      const midY = h * 0.5;
      const padX = w * 0.09;
      const railW = w - padX * 2;

      // Rail + ticks
      ctx!.strokeStyle = palette.rule;
      ctx!.lineWidth = 1;
      ctx!.beginPath();
      ctx!.moveTo(padX, midY);
      ctx!.lineTo(padX + railW, midY);
      ctx!.stroke();

      for (let i = 0; i < 5; i++) {
        const x = padX + (railW * i) / 4;
        ctx!.beginPath();
        ctx!.moveTo(x, midY - 7);
        ctx!.lineTo(x, midY + 7);
        ctx!.stroke();
      }

      // Particle field — cloud → lattice → flagged → packed → resolved
      const boxW = railW * 0.2;
      const stageX = padX + (railW * Math.max(0, index - 1)) / 4;
      const nextX = padX + (railW * Math.min(index, 4)) / 4;
      const cx = stageX + (nextX - stageX) * k;

      for (let i = 0; i < COUNT; i++) {
        const s = seeds[i]!;
        const cols = 12;
        const col = i % cols;
        const row = Math.floor(i / cols);
        const gx = cx - boxW / 2 + (col / cols) * boxW;
        const gy = midY + (row - COUNT / cols / 2) * 5.2;

        let x: number;
        let y: number;
        if (index === 0) {
          const chaosX = padX + railW * 0.04 + s.cx * boxW * 1.3;
          const chaosY = midY + (s.cy - 0.5) * h * 0.42;
          x = chaosX + (gx - chaosX) * k;
          y = chaosY + (gy - chaosY) * k;
        } else if (index === 2 && s.flag) {
          x = gx + 10 * k;
          y = gy - 26 * k - s.j * 10 * k;
        } else {
          x = gx;
          y = gy;
        }

        const flagged = s.flag && index >= 2 && index < 4;
        ctx!.fillStyle = flagged ? palette.amber : index >= 4 ? palette.accent : palette.muted;
        ctx!.globalAlpha = flagged ? 1 : 0.75;
        ctx!.fillRect(Math.round(x), Math.round(y), 3, 3);
      }
      ctx!.globalAlpha = 1;

      // The gate at station 4, and the marker that stalls there
      const gateX = padX + (railW * 3) / 4;
      const open = index > 3 ? 1 : index === 3 ? Math.max(0, (local - 0.62) / 0.38) : 0;
      ctx!.strokeStyle = palette.accent;
      ctx!.lineWidth = 2;
      ctx!.beginPath();
      ctx!.moveTo(gateX, midY - 14 - open * 26);
      ctx!.lineTo(gateX, midY - 44 - open * 26);
      ctx!.moveTo(gateX, midY + 14 + open * 26);
      ctx!.lineTo(gateX, midY + 44 + open * 26);
      ctx!.stroke();

      let travel: number;
      if (index < 3) travel = (index + local) / 4;
      else if (index === 3) travel = 3 / 4 + (Math.max(0, local - 0.62) / 0.38) * (1 / 4);
      else travel = 1;
      travel = Math.min(travel, 1);

      ctx!.fillStyle = palette.accent;
      const mx = padX + travel * railW;
      ctx!.fillRect(mx - 3, midY - 3, 6, 6);

      raf.current = requestAnimationFrame(draw);
    }

    raf.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf.current);
      ro.disconnect();
    };
  }, [progress, palette]);

  return <canvas ref={ref} className="size-full" aria-hidden />;
}

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
