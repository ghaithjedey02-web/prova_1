'use client';

import { useEffect, useRef } from 'react';
import { Chapter } from '@/components/ui/Chapter';
import { Container } from '@/components/ui/Container';
import { Counter } from '@/components/ui/Counter';
import { Reveal } from '@/components/ui/Reveal';
import { chapters } from '@/content/site';
import { usePalette } from '@/lib/palette';

const c = chapters.intelligence;

/**
 * Chapter 03 — the intelligence graph.
 *
 * Inputs on the left, the core in the middle, outputs on the right, and packets
 * of information actually travelling the edges. This is the one place on the
 * site where a diagram earns being animated: the claim is that DOLMIR sits
 * between fragmented sources and useful results, and watching a packet cross
 * from "Email" through the core to "Decisione" makes that argument in about two
 * seconds without a paragraph.
 *
 * Canvas rather than WebGL: the hero already holds a GPU context and this is a
 * flat graph by nature. It pauses when off screen and reacts to the pointer.
 */
export function Intelligence() {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const { palette } = usePalette();

  useEffect(() => {
    const el = canvas.current;
    const box = host.current;
    if (!el || !box || !palette) return;
    const ctx = el.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let running = false;
    let w = 0;
    let h = 0;
    const t0 = performance.now();
    const mouse = { x: -9999, y: -9999 };

    type Node = { x: number; y: number; label: string; side: -1 | 0 | 1 };
    let nodes: Node[] = [];

    const packets = Array.from({ length: 14 }, (_, i) => ({
      from: i % c.inputs.length,
      to: i % c.outputs.length,
      t: Math.random(),
      speed: 0.16 + Math.random() * 0.14,
    }));

    function layout() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = box!.clientWidth;
      h = box!.clientHeight;
      el!.width = Math.floor(w * dpr);
      el!.height = Math.floor(h * dpr);
      el!.style.width = `${w}px`;
      el!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const padX = Math.min(140, w * 0.14);
      const midX = w / 2;
      nodes = [];
      c.inputs.forEach((label, i) => {
        const t = (i + 0.5) / c.inputs.length;
        nodes.push({ x: padX, y: h * (0.1 + t * 0.8), label, side: -1 });
      });
      c.outputs.forEach((label, i) => {
        const t = (i + 0.5) / c.outputs.length;
        nodes.push({ x: w - padX, y: h * (0.14 + t * 0.72), label, side: 1 });
      });
      nodes.push({ x: midX, y: h / 2, label: c.core, side: 0 });
    }

    const inputs = () => nodes.filter((n) => n.side === -1);
    const outputs = () => nodes.filter((n) => n.side === 1);
    const core = () => nodes.find((n) => n.side === 0)!;

    function edge(a: Node, b: Node, alpha: number, width = 1) {
      const cp = (a.x + b.x) / 2;
      ctx!.strokeStyle = withAlpha(palette!.accent, alpha);
      ctx!.lineWidth = width;
      ctx!.beginPath();
      ctx!.moveTo(a.x, a.y);
      ctx!.bezierCurveTo(cp, a.y, cp, b.y, b.x, b.y);
      ctx!.stroke();
    }

    function pointOnEdge(a: Node, b: Node, t: number) {
      const cp = (a.x + b.x) / 2;
      const mt = 1 - t;
      const x = mt * mt * mt * a.x + 3 * mt * mt * t * cp + 3 * mt * t * t * cp + t * t * t * b.x;
      const y = mt * mt * mt * a.y + 3 * mt * mt * t * a.y + 3 * mt * t * t * b.y + t * t * t * b.y;
      return { x, y };
    }

    function draw(now: number) {
      const time = (now - t0) / 1000;
      ctx!.clearRect(0, 0, w, h);
      const K = core();

      // edges
      inputs().forEach((n) => {
        const near = Math.hypot(mouse.x - n.x, mouse.y - n.y) < 90;
        edge(n, K, near ? 0.55 : 0.16, near ? 1.5 : 1);
      });
      outputs().forEach((n) => {
        const near = Math.hypot(mouse.x - n.x, mouse.y - n.y) < 90;
        edge(K, n, near ? 0.55 : 0.16, near ? 1.5 : 1);
      });

      // packets: input → core → output, one continuous journey
      if (!reduce) {
        packets.forEach((p) => {
          p.t += p.speed * 0.008;
          if (p.t > 2) p.t -= 2;
          const first = p.t < 1;
          const a = first ? inputs()[p.from % inputs().length]! : K;
          const b = first ? K : outputs()[p.to % outputs().length]!;
          const local = first ? p.t : p.t - 1;
          const pt = pointOnEdge(a, b, local);
          ctx!.fillStyle = withAlpha(palette!.accent, 0.85);
          ctx!.fillRect(pt.x - 2, pt.y - 1, 4, 2);
        });
      }

      // core
      const pulse = reduce ? 0.5 : 0.5 + Math.sin(time * 1.6) * 0.22;
      const g = ctx!.createRadialGradient(K.x, K.y, 0, K.x, K.y, 78);
      g.addColorStop(0, withAlpha(palette!.accent, 0.24 * pulse + 0.12));
      g.addColorStop(1, withAlpha(palette!.accent, 0));
      ctx!.fillStyle = g;
      ctx!.fillRect(K.x - 80, K.y - 80, 160, 160);

      ctx!.strokeStyle = withAlpha(palette!.accent, 0.7);
      ctx!.lineWidth = 1.2;
      ctx!.beginPath();
      for (let i = 0; i <= 6; i++) {
        const a = (i / 6) * Math.PI * 2 - Math.PI / 2 + (reduce ? 0 : time * 0.12);
        const px = K.x + Math.cos(a) * 30;
        const py = K.y + Math.sin(a) * 30;
        i === 0 ? ctx!.moveTo(px, py) : ctx!.lineTo(px, py);
      }
      ctx!.closePath();
      ctx!.stroke();

      // node markers
      [...inputs(), ...outputs()].forEach((n) => {
        const near = Math.hypot(mouse.x - n.x, mouse.y - n.y) < 90;
        ctx!.fillStyle = near ? palette!.accent : palette!.muted;
        ctx!.fillRect(n.x - 2.5, n.y - 2.5, 5, 5);
      });

      raf = requestAnimationFrame(draw);
    }

    function start() { if (!running) { running = true; raf = requestAnimationFrame(draw); } }
    function stop() { running = false; cancelAnimationFrame(raf); }

    layout();
    const io = new IntersectionObserver(([e]) => (e?.isIntersecting ? start() : stop()), { rootMargin: '120px' });
    io.observe(box);

    const ro = new ResizeObserver(layout);
    ro.observe(box);

    function onMove(e: PointerEvent) {
      const r = box!.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    }
    function onLeave() { mouse.x = -9999; mouse.y = -9999; }
    box.addEventListener('pointermove', onMove);
    box.addEventListener('pointerleave', onLeave);

    return () => {
      stop(); io.disconnect(); ro.disconnect();
      box.removeEventListener('pointermove', onMove);
      box.removeEventListener('pointerleave', onLeave);
    };
  }, [palette]);

  return (
    <section className="relative py-[var(--space-section)]">
      <Container>
        <Chapter n={c.n} label={c.label} headline={c.headline} lead={c.body} />

        <Reveal delay={140}>
          <div className="mt-[var(--space-block)] glass-solid bracket relative">
            {/* Labels are DOM, not canvas: they stay selectable, translatable and
                readable by a screen reader. */}
            <div ref={host} className="relative h-[24rem] w-full sm:h-[30rem]">
              <canvas ref={canvas} className="absolute inset-0" aria-hidden />

              <ul className="pointer-events-none absolute inset-y-0 left-0 flex w-[min(28%,10rem)] flex-col justify-center gap-[clamp(0.5rem,2.2vh,1.4rem)] pl-4 sm:pl-6">
                {c.inputs.map((i) => (
                  <li key={i} className="telemetry truncate text-right text-muted">{i}</li>
                ))}
              </ul>

              <ul className="pointer-events-none absolute inset-y-0 right-0 flex w-[min(28%,10rem)] flex-col justify-center gap-[clamp(0.6rem,2.6vh,1.6rem)] pr-4 sm:pr-6">
                {c.outputs.map((i) => (
                  <li key={i} className="telemetry truncate text-accent">{i}</li>
                ))}
              </ul>

              <p className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-[2.6rem] text-center telemetry text-ink">
                {c.core}
              </p>
            </div>

            <dl className="grid gap-px border-t border-rule bg-rule/70 sm:grid-cols-3">
              {c.metrics.map((m) => (
                <div key={m.k} className="bg-surface/60 px-5 py-5 backdrop-blur-sm">
                  <dd className="font-display text-[length:var(--text-display-m)] font-semibold text-ink">
                    <Counter to={m.v} suffix={'suffix' in m ? (m.suffix as string) : ''} />
                  </dd>
                  <dt className="mt-1.5 text-[var(--text-micro)] leading-snug text-muted">{m.k}</dt>
                </div>
              ))}
            </dl>
            <p className="telemetry border-t border-rule px-5 py-3.5 normal-case tracking-[0.08em] text-muted">
              {c.note}
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

function withAlpha(color: string, alpha: number) {
  const c2 = color.trim();
  if (c2.startsWith('#')) {
    const full = c2.length === 4 ? `#${c2[1]}${c2[1]}${c2[2]}${c2[2]}${c2[3]}${c2[3]}` : c2;
    const r = parseInt(full.slice(1, 3), 16);
    const g = parseInt(full.slice(3, 5), 16);
    const b = parseInt(full.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }
  return c2;
}
