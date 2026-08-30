'use client';

import { useEffect, useRef } from 'react';
import { CALLOUTS, PART, holeAngles } from './part';

/**
 * The CAD tier.
 *
 * When WebGL is unavailable or the device is too modest for a lit metal render,
 * the visitor does not get a static image — they get the same part as a live
 * orthographic view: centre lines, bolt circle, and a measuring sweep that walks
 * the callouts one at a time. It costs a 2D context and runs on anything.
 */

type Palette = { accent: string; ink: string; amber: string; rule: string; muted: string };

export default function ForgeCanvas2D({ palette }: { palette: Palette }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const start = performance.now();
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

    function ring(cx: number, cy: number, r: number, color: string, width = 1, dash: number[] = []) {
      ctx!.save();
      ctx!.strokeStyle = color;
      ctx!.lineWidth = width;
      ctx!.setLineDash(dash);
      ctx!.beginPath();
      ctx!.arc(cx, cy, r, 0, Math.PI * 2);
      ctx!.stroke();
      ctx!.restore();
    }

    function draw(now: number) {
      const t = reduce ? 6 : (now - start) / 1000;
      ctx!.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const scale = (Math.min(w, h) * 0.78) / PART.outerDiameter;
      const R = (PART.outerDiameter / 2) * scale;
      const bore = (PART.innerDiameter / 2) * scale;
      const bcd = (PART.boltCircle / 2) * scale;
      const hole = (PART.holeDiameter / 2) * scale;
      const hub = (PART.hubDiameter / 2) * scale;

      // centre lines
      ctx!.save();
      ctx!.strokeStyle = palette.rule;
      ctx!.lineWidth = 1;
      ctx!.setLineDash([10, 5, 2, 5]);
      ctx!.beginPath();
      ctx!.moveTo(cx - R * 1.24, cy);
      ctx!.lineTo(cx + R * 1.24, cy);
      ctx!.moveTo(cx, cy - R * 1.24);
      ctx!.lineTo(cx, cy + R * 1.24);
      ctx!.stroke();
      ctx!.restore();

      ring(cx, cy, R, palette.ink, 1.6);
      ring(cx, cy, R - 3, palette.rule, 1);
      ring(cx, cy, hub, palette.muted, 1.2);
      ring(cx, cy, bore, palette.ink, 1.6);
      ring(cx, cy, bcd, palette.accent, 1, [4, 4]);

      // peripheral holes, appearing in sequence as if being drawn
      const drawn = reduce ? PART.holeCount : Math.min(PART.holeCount, Math.floor(t * 4) + 1);
      holeAngles().forEach((a, i) => {
        if (i >= drawn) return;
        const hx = cx + Math.cos(a - Math.PI / 2) * bcd;
        const hy = cy + Math.sin(a - Math.PI / 2) * bcd;
        ring(hx, hy, hole, palette.ink, 1.4);
        ctx!.save();
        ctx!.strokeStyle = palette.rule;
        ctx!.lineWidth = 1;
        ctx!.beginPath();
        ctx!.moveTo(hx - hole * 1.5, hy);
        ctx!.lineTo(hx + hole * 1.5, hy);
        ctx!.moveTo(hx, hy - hole * 1.5);
        ctx!.lineTo(hx, hy + hole * 1.5);
        ctx!.stroke();
        ctx!.restore();
      });

      // the measuring sweep — a radius line walking the circle
      if (!reduce) {
        const a = t * 0.55;
        ctx!.save();
        ctx!.strokeStyle = palette.accent;
        ctx!.lineWidth = 1.2;
        ctx!.globalAlpha = 0.85;
        ctx!.beginPath();
        ctx!.moveTo(cx, cy);
        ctx!.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
        ctx!.stroke();
        ctx!.globalAlpha = 1;
        ctx!.fillStyle = palette.accent;
        ctx!.beginPath();
        ctx!.arc(cx + Math.cos(a) * R, cy + Math.sin(a) * R, 2.6, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.restore();
      }

      // callout, one at a time, bottom left
      const idx = reduce ? 0 : Math.floor(t / 2.4) % CALLOUTS.length;
      const callout = CALLOUTS[idx]!;
      ctx!.save();
      ctx!.fillStyle = palette.muted;
      ctx!.font = '500 11px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx!.letterSpacing = '0.14em';
      ctx!.fillText(`${PART.code} REV ${PART.revision}`, 4, 14);
      ctx!.fillStyle = palette.accent;
      ctx!.font = '500 13px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx!.fillText(callout.label, 4, h - 6);
      ctx!.restore();

      raf = requestAnimationFrame(draw);
    }

    resize();
    raf = requestAnimationFrame(draw);
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [palette]);

  return <canvas ref={ref} className="absolute inset-0" aria-hidden />;
}
