'use client';

import { useEffect, useRef, useState } from 'react';
import { Container } from '@/components/ui/Container';
import { usePalette } from '@/lib/palette';
import { emit, setActivity, setBackdropBoost, type Activity } from '@/lib/system-bus';
import { intelligence } from '@/content/site';

/**
 * DOLMIR INTELLIGENCE — looking inside the technology.
 *
 * The fixed WebGL core behind the whole site normally recedes to atmosphere
 * after the opening. This is the one section that asks for it back at full
 * strength and builds the product around it: six unstructured channels on the
 * left, six finished actions on the right, and a canvas drawing live packet
 * streams through the middle where the core burns. The state line under the
 * core cycles through the real stages of the pipeline, and every arrival is a
 * real event on the system bus — the same log Inspect mode shows.
 *
 * Hovering a channel pulls its stream forward and dims the rest, so a visitor
 * can ask "what happens to *email*?" with the pointer instead of a form.
 *
 * Not a diagram of the product. The shape of the product, running.
 */

/** Which internal activity each cycled state maps to, for the 3D core. */
const STATE_ACTIVITY: readonly Activity[] = [
  'listening', 'listening', 'analyzing', 'analyzing', 'understanding',
  'verifying', 'processing', 'holding', 'ready',
];

interface Pulse {
  /** stream index; inputs are 0..5, outputs 6..11 */
  s: number;
  t: number;
  speed: number;
}

export function Intelligence() {
  const host = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const chipRefs = useRef<(HTMLElement | null)[]>([]);
  const hoverRef = useRef<number>(-1);
  const palette = usePalette();
  const [state, setState] = useState(0);
  const [visible, setVisible] = useState(false);
  const [reduce, setReduce] = useState<boolean | null>(null);

  useEffect(() => {
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  /* Visibility: starts the machine, raises the backdrop, and releases both. */
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        const on = Boolean(e && e.intersectionRatio > 0.25);
        setVisible(on);
        setBackdropBoost(on ? 1 : 0);
      },
      { threshold: [0, 0.25, 0.6] },
    );
    io.observe(el);
    return () => { io.disconnect(); setBackdropBoost(0); };
  }, []);

  /* The state cycle. Each state drives the 3D core through the bus; a few of
     them leave a line in the system log, so Inspect mode shows this section
     actually happened. */
  useEffect(() => {
    if (!visible || reduce) return;
    const id = setInterval(() => {
      setState((s) => {
        const next = (s + 1) % intelligence.states.length;
        setActivity(STATE_ACTIVITY[next] ?? 'processing');
        if (next === 5) emit('CONF.CHECK', 'confidenza 97,4% · esempio', 'accent');
        if (next === 7) emit('GATE.HOLD', 'revisione umana richiesta', 'amber');
        if (next === 8) emit('ACT.READY', 'azione preparata · in attesa di approvazione', 'good');
        return next;
      });
    }, 1500);
    return () => { clearInterval(id); setActivity('idle'); };
  }, [visible, reduce]);

  /* The streams. Anchor positions are measured from the chips themselves and
     cached, so the canvas always agrees with the DOM at any viewport. */
  useEffect(() => {
    const el = canvas.current;
    const box = stage.current;
    if (!el || !box || !palette || reduce !== false) return;
    const ctx = el.getContext('2d');
    if (!ctx) return;

    let w = 0; let h = 0;
    let anchors: { x: number; y: number; input: boolean }[] = [];
    const pulses: Pulse[] = [];
    let raf = 0;
    let running = false;
    let last = performance.now();
    let spawnClock = 0;

    function layout() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = box!.getBoundingClientRect();
      w = r.width; h = r.height;
      el!.width = Math.floor(w * dpr);
      el!.height = Math.floor(h * dpr);
      el!.style.width = `${w}px`;
      el!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      anchors = chipRefs.current.map((chip, i) => {
        if (!chip) return { x: 0, y: 0, input: i < 6 };
        const c = chip.getBoundingClientRect();
        const input = i < 6;
        return {
          // Streams leave from the chip's inner edge, toward the core.
          x: input ? c.right - r.left + 6 : c.left - r.left - 6,
          y: c.top - r.top + c.height / 2,
          input,
        };
      });
    }

    function path(a: { x: number; y: number; input: boolean }, t: number) {
      const cx = w / 2; const cy = h / 2;
      const x0 = a.input ? a.x : cx;
      const y0 = a.input ? a.y : cy;
      const x1 = a.input ? cx : a.x;
      const y1 = a.input ? cy : a.y;
      const mx = (x0 + x1) / 2;
      const mt = 1 - t;
      return {
        x: mt * mt * mt * x0 + 3 * mt * mt * t * mx + 3 * mt * t * t * mx + t * t * t * x1,
        y: mt * mt * mt * y0 + 3 * mt * mt * t * y0 + 3 * mt * t * t * y1 + t * t * t * y1,
      };
    }

    function draw(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      ctx!.clearRect(0, 0, w, h);
      const hovered = hoverRef.current;

      // Streams.
      anchors.forEach((a, i) => {
        if (a.x === 0 && a.y === 0) return;
        const isHover = hovered === i;
        const dimmed = hovered !== -1 && !isHover;
        ctx!.save();
        ctx!.globalAlpha = dimmed ? 0.06 : isHover ? 0.8 : 0.38;
        ctx!.strokeStyle = palette!.accent;
        ctx!.lineWidth = isHover ? 1.5 : 1;
        ctx!.beginPath();
        const steps = 22;
        for (let s = 0; s <= steps; s++) {
          const pt = path(a, s / steps);
          s === 0 ? ctx!.moveTo(pt.x, pt.y) : ctx!.lineTo(pt.x, pt.y);
        }
        ctx!.stroke();
        ctx!.restore();
      });

      // Packets.
      spawnClock -= dt;
      if (spawnClock <= 0) {
        spawnClock = 0.2 + Math.random() * 0.22;
        const input = Math.random() < 0.55;
        const s = input
          ? Math.floor(Math.random() * 6)
          : 6 + Math.floor(Math.random() * 6);
        pulses.push({ s, t: 0, speed: 0.35 + Math.random() * 0.25 });
      }
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i]!;
        p.t += dt * p.speed * (hoverRef.current === p.s ? 1.7 : 1);
        if (p.t >= 1) { pulses.splice(i, 1); continue; }
        const a = anchors[p.s];
        if (!a || (a.x === 0 && a.y === 0)) continue;
        const isHover = hoverRef.current === p.s;
        const dimmed = hoverRef.current !== -1 && !isHover;
        const pt = path(a, p.t);
        ctx!.save();
        ctx!.globalAlpha = dimmed ? 0.12 : isHover ? 1 : 0.7;
        ctx!.fillStyle = palette!.accent;
        const sz = isHover ? 3.5 : 2.5;
        ctx!.fillRect(pt.x - sz, pt.y - sz / 2, sz * 2, sz);
        ctx!.restore();
      }

      // The core's ground ring, so the streams visibly converge on something
      // even while the 3D core drifts behind.
      const cx = w / 2; const cy = h / 2;
      const t = now / 1000;
      ctx!.save();
      ctx!.strokeStyle = palette!.accent;
      ctx!.globalAlpha = 0.4;
      ctx!.lineWidth = 1;
      ctx!.setLineDash([2, 7]);
      ctx!.beginPath();
      ctx!.arc(cx, cy, 74 + Math.sin(t * 1.4) * 3, 0, Math.PI * 2);
      ctx!.stroke();
      ctx!.setLineDash([]);
      ctx!.globalAlpha = 0.85;
      const arc = t * 0.7;
      ctx!.beginPath();
      ctx!.arc(cx, cy, 58, arc, arc + Math.PI * 0.45);
      ctx!.stroke();
      ctx!.restore();

      raf = requestAnimationFrame(draw);
    }

    function start() { if (!running) { running = true; last = performance.now(); raf = requestAnimationFrame(draw); } }
    function stop() { running = false; cancelAnimationFrame(raf); }

    layout();
    const io = new IntersectionObserver(([e]) => (e?.isIntersecting ? start() : stop()), { rootMargin: '80px' });
    io.observe(box);
    const ro = new ResizeObserver(layout);
    ro.observe(box);
    return () => { stop(); io.disconnect(); ro.disconnect(); };
  }, [palette, reduce]);

  const chip = (
    item: { k: string; d: string },
    i: number,
    side: 'in' | 'out',
  ) => (
    <li key={item.k}>
      <button
        type="button"
        ref={(n) => { chipRefs.current[i] = n; }}
        onMouseEnter={() => { hoverRef.current = i; }}
        onMouseLeave={() => { hoverRef.current = -1; }}
        onFocus={() => { hoverRef.current = i; }}
        onBlur={() => { hoverRef.current = -1; }}
        className={`group w-full border border-rule bg-surface/85 px-3.5 py-2.5 backdrop-blur-sm transition-colors duration-[var(--duration-fast)] hover:border-accent/60 ${
          side === 'in' ? 'text-left' : 'text-left lg:text-right'
        }`}
      >
        <span className="telemetry block text-ink transition-colors group-hover:text-accent">
          {side === 'in' ? '▸ ' : ''}{item.k}{side === 'out' ? ' ▸' : ''}
        </span>
        <span className="mt-0.5 block text-[0.6875rem] leading-snug text-muted">{item.d}</span>
      </button>
    </li>
  );

  return (
    <section
      ref={host}
      className="relative py-[var(--space-section)]"
      aria-labelledby="intelligence-heading"
      data-inspect="Intelligence · il nucleo, dal vivo"
    >
      <Container>
        <header className="max-w-[54ch]">
          <p className="chapter">
            <span className="tnum text-accent">{intelligence.n}</span>
            <span>{intelligence.label}</span>
          </p>
          <h2 id="intelligence-heading" className="headline mt-7 text-[length:var(--text-display-m)]">
            {intelligence.headline}
          </h2>
          <div className="mt-8 h-px w-full max-w-[16rem] bg-gradient-to-r from-accent to-transparent" />
          <p className="lead mt-7">{intelligence.body}</p>
        </header>

        <div ref={stage} className="relative mt-[var(--space-block)]">
          {reduce === false && (
            <canvas ref={canvas} aria-hidden className="pointer-events-none absolute inset-0" />
          )}
          {/* Static wires for the tiers without the canvas. */}
          {reduce !== false && (
            <div aria-hidden className="pointer-events-none absolute inset-x-[16%] top-1/2 hidden h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent lg:block" />
          )}

          <div className="relative grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)_15rem] lg:gap-6">
            {/* Inputs. */}
            <div>
              <p className="telemetry mb-3 text-faint">IN ENTRATA</p>
              <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1">
                {intelligence.inputs.map((it, i) => chip(it, i, 'in'))}
              </ul>
            </div>

            {/* The core. The 3D machine burns through from the fixed backdrop;
                this block only frames it and reports its state. */}
            <div className="relative flex min-h-[14rem] flex-col items-center justify-center py-8 text-center lg:min-h-[26rem]">
              <div className="glass bracket px-7 py-5">
              <p className="telemetry text-faint">DOLMIR</p>
              <p className="mt-1 font-mono text-[0.8125rem] tracking-[0.3em] text-ink">
                INTELLIGENCE CORE
              </p>
              <p
                key={state}
                className="settle mt-5 min-h-[1.5em] font-mono text-[0.75rem] tracking-[0.18em] text-accent"
                aria-live="polite"
              >
                {intelligence.states[state]}
              </p>
              <p className="telemetry mt-2 text-faint">{intelligence.disclaimer}</p>
              </div>
            </div>

            {/* Outputs. */}
            <div>
              <p className="telemetry mb-3 text-faint lg:text-right">IN USCITA</p>
              <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1">
                {intelligence.outputs.map((it, i) => chip(it, 6 + i, 'out'))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
