'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Container } from '@/components/ui/Container';
import { usePalette } from '@/lib/palette';
import { emit, setActivity, setBackdropBoost, type Activity } from '@/lib/system-bus';
import { intelligence as c } from '@/content/site';

/**
 * THE OPERATING LAYER — DOLMIR's flagship visualization.
 *
 * One intelligence layer connecting the whole company. The composition is the
 * argument: the client's own systems on the right, DOLMIR's specialised agents
 * on the left, the core between them, the company memory as the stratum
 * beneath, and — above everything — the person. A canvas draws the nervous
 * system live: luminous streams converging on the core, cyan for systems,
 * violet for intelligence, amber only for the human gate.
 *
 * It is not an illustration. Hover a node and its flow isolates. Pick a
 * process — ORDINE, FATTURA, SOLLECITO… — and watch a pulse physically travel
 * the architecture, station by station, narrating itself in plain Italian.
 * "GUARDA DOLMIR AL LAVORO" runs the whole pass unattended.
 *
 * Anchors are measured from the DOM chips themselves, so the same engine
 * renders the radial desktop composition and the reorganised mobile stack.
 * Under reduced motion the canvas is skipped entirely; the sequences still
 * work as discrete state changes, so nothing is lost but the motion.
 */

type SeqKind = 'watch' | number;
interface Step { n: string; s: string; line: string }
interface Anchor { x: number; y: number; id: string }

const stepsOf = (kind: SeqKind): readonly Step[] =>
  kind === 'watch' ? c.watch.steps : c.processes[kind]!.steps;

const ACT: Record<string, Activity> = {
  core: 'processing', memory: 'understanding', person: 'holding',
};
const activityFor = (n: string, last: boolean): Activity =>
  last ? 'ready' : ACT[n] ?? (n.startsWith('ag-') ? 'analyzing' : 'verifying');

export function Intelligence() {
  const host = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const nodeEls = useRef<Map<string, HTMLElement>>(new Map());
  const hoverRef = useRef<string | null>(null);
  const seqRef = useRef<{ ids: Set<string>; node: string | null }>({ ids: new Set(), node: null });
  const burstRef = useRef<((from: string | null, to: string) => void) | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const palette = usePalette();
  const [reduce, setReduce] = useState<boolean | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [seq, setSeq] = useState<{ kind: SeqKind; step: number } | null>(null);
  const [idle, setIdle] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  /* Visibility raises the backdrop and starts the ambient life. */
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        const on = Boolean(e && e.intersectionRatio > 0.2);
        setVisible(on);
        /* A hint of extra life behind the section, not the old full blaze:
           this map draws its own core, and the backdrop must not fight it. */
        setBackdropBoost(on ? 0.3 : 0);
      },
      { threshold: [0, 0.2, 0.6] },
    );
    io.observe(el);
    return () => { io.disconnect(); setBackdropBoost(0); };
  }, []);

  /* The idle heartbeat under the core, while nothing is selected. */
  useEffect(() => {
    if (!visible || seq) return;
    const id = setInterval(() => setIdle((i) => (i + 1) % c.idle.length), 2600);
    return () => clearInterval(id);
  }, [visible, seq]);

  /* ------------------------------------------------------- sequence engine */
  const clearTimer = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  }, []);

  const runStep = useCallback((kind: SeqKind, i: number) => {
    const steps = stepsOf(kind);
    const st = steps[i];
    if (!st) {
      timer.current = setTimeout(() => {
        setSeq(null);
        seqRef.current = { ids: new Set(), node: null };
        setActivity('idle');
      }, 2200);
      return;
    }
    setSeq({ kind, step: i });
    seqRef.current = { ids: new Set(steps.map((s) => s.n)), node: st.n };
    const prev = i > 0 ? steps[i - 1]!.n : null;
    burstRef.current?.(prev, st.n);
    setActivity(activityFor(st.n, i === steps.length - 1));
    if (st.n === 'person') emit('GATE.HOLD', 'revisione umana richiesta', 'amber');
    if (i === steps.length - 1) emit('ACT.DONE', 'azione eseguita · registro aggiornato', 'good');
    const dwell = st.n === 'person' ? 3000 : i === steps.length - 1 ? 2600 : 1900;
    timer.current = setTimeout(() => runStep(kind, i + 1), dwell);
  }, []);

  const start = useCallback((kind: SeqKind) => {
    clearTimer();
    setHover(null);
    hoverRef.current = null;
    if (kind === 'watch') emit('RUN.START', 'sequenza completa · esempio', 'accent');
    runStep(kind, 0);
  }, [clearTimer, runStep]);

  const stopSeq = useCallback(() => {
    clearTimer();
    setSeq(null);
    seqRef.current = { ids: new Set(), node: null };
    setActivity('idle');
  }, [clearTimer]);

  useEffect(() => () => { clearTimer(); setActivity('idle'); }, [clearTimer]);
  /* Leaving the section stops a running sequence rather than narrating to nobody. */
  useEffect(() => { if (!visible && seq) stopSeq(); }, [visible, seq, stopSeq]);

  const setHoverBoth = (id: string | null) => { setHover(id); hoverRef.current = id; };

  /* ------------------------------------------------------ the canvas layer */
  useEffect(() => {
    const el = canvas.current;
    const box = stage.current;
    if (!el || !box || !palette || reduce !== false) return;
    const pal = palette;
    const ctx = el.getContext('2d');
    if (!ctx) return;

    let w = 0; let h = 0;
    let core = { x: 0, y: 0 };
    let anchors: Anchor[] = [];
    let ramp = 0;
    let raf = 0; let running = false; let last = performance.now();
    let spawnClock = 0;

    interface Ambient { id: string; t: number; speed: number; dir: 1 | -1 }
    interface Burst { legs: { a: Anchor; b: Anchor }[]; t: number; speed: number; color: string }
    const ambient: Ambient[] = [];
    const bursts: Burst[] = [];

    const colorOf = (id: string) =>
      id.startsWith('ag-') ? pal.violet
      : id === 'person' ? pal.amber
      : id === 'memory' ? pal.steel
      : pal.accent;

    function layout() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      const r = box!.getBoundingClientRect();
      w = r.width; h = r.height;
      el!.width = Math.floor(w * dpr);
      el!.height = Math.floor(h * dpr);
      el!.style.width = `${w}px`;
      el!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const coreEl = nodeEls.current.get('core');
      if (coreEl) {
        const cr = coreEl.getBoundingClientRect();
        core = { x: cr.left - r.left + cr.width / 2, y: cr.top - r.top + cr.height / 2 };
      } else { core = { x: w / 2, y: h / 2 }; }

      anchors = [];
      nodeEls.current.forEach((node, id) => {
        if (id === 'core') return;
        const nr = node.getBoundingClientRect();
        // Anchor on the edge of the chip facing the core.
        const x = Math.min(Math.max(core.x, nr.left - r.left + 5), nr.right - r.left - 5);
        const y = Math.min(Math.max(core.y, nr.top - r.top + 5), nr.bottom - r.top - 5);
        anchors.push({ id, x, y });
      });
    }

    /** Cubic bend from a node edge to the core, bowing along the dominant axis. */
    function point(a: { x: number; y: number }, b: { x: number; y: number }, t: number) {
      const horizontal = Math.abs(b.x - a.x) >= Math.abs(b.y - a.y);
      const mx = (a.x + b.x) / 2; const my = (a.y + b.y) / 2;
      const c1 = horizontal ? { x: mx, y: a.y } : { x: a.x, y: my };
      const c2 = horizontal ? { x: mx, y: b.y } : { x: b.x, y: my };
      const u = 1 - t;
      return {
        x: u * u * u * a.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * b.x,
        y: u * u * u * a.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * b.y,
      };
    }

    /* The wrapper fires this on every sequence step: a pulse travels
       previous → core → current, visibly routed through the intelligence. */
    burstRef.current = (from, to) => {
      const A = from ? anchors.find((a) => a.id === from) : null;
      const B = anchors.find((a) => a.id === to);
      const C: Anchor = { id: 'core', x: core.x, y: core.y };
      const legs: { a: Anchor; b: Anchor }[] = [];
      if (to === 'core') { if (A) legs.push({ a: A, b: C }); }
      else if (!A || from === 'core') legs.push({ a: C, b: B! });
      else { legs.push({ a: A, b: C }, { a: C, b: B! }); }
      if (!legs.length || !B && to !== 'core') return;
      const color = colorOf(to === 'core' ? (from ?? 'sy-email') : to);
      for (let i = 0; i < 13; i++) {
        bursts.push({ legs, t: -i * 0.055, speed: 0.62 + (i % 4) * 0.05, color });
      }
    };

    function drawStream(a: Anchor, alpha: number, width: number) {
      ctx!.strokeStyle = colorOf(a.id);
      ctx!.beginPath();
      for (let s = 0; s <= 20; s++) {
        const p = point(a, core, s / 20);
        s === 0 ? ctx!.moveTo(p.x, p.y) : ctx!.lineTo(p.x, p.y);
      }
      // A soft luminous bed under a crisp line — the reference's light trails.
      ctx!.globalAlpha = alpha * 0.35;
      ctx!.lineWidth = width * 3.2;
      ctx!.stroke();
      ctx!.globalAlpha = alpha;
      ctx!.lineWidth = width;
      ctx!.stroke();
    }

    function draw(now: number) {
      const rawDt = (now - last) / 1000;
      last = now;
      // Wall-time ramp and spawning: a slow device drops frames, not light.
      ramp = Math.min(1, ramp + Math.min(0.25, rawDt) * 0.8);
      ctx!.clearRect(0, 0, w, h);
      const hovered = hoverRef.current;
      const S = seqRef.current;
      const inSeq = S.node !== null;
      const t = now / 1000;

      /* Streams: every node feeds the core. Focus isolates, it never deletes. */
      ctx!.save();
      for (const a of anchors) {
        const focus = hovered === a.id || S.node === a.id;
        const involved = inSeq && S.ids.has(a.id);
        const base = a.id === 'person' ? 0.24 : a.id === 'memory' ? 0.3 : 0.55;
        let alpha = base;
        if (hovered) alpha = focus ? 0.95 : 0.07;
        else if (inSeq) alpha = focus ? 0.95 : involved ? 0.35 : 0.07;
        drawStream(a, alpha * ramp, focus ? 1.5 : 1.1);
      }
      ctx!.restore();

      /* Ambient traffic: quiet, continuous, the company breathing. */
      spawnClock -= Math.min(0.25, rawDt);
      while (spawnClock <= 0 && ambient.length < 120) {
        spawnClock += 0.045;
        const pool = anchors.filter((a) => a.id !== 'person');
        const a = pool[Math.floor(Math.random() * pool.length)];
        if (a) ambient.push({
          id: a.id, t: Math.random() * 0.15,
          speed: 0.22 + Math.random() * 0.22,
          dir: a.id.startsWith('ag-') && Math.random() < 0.45 ? -1 : 1,
        });
      }
      ctx!.save();
      ctx!.globalCompositeOperation = 'lighter';
      const dtMove = Math.min(0.12, rawDt);
      for (let i = ambient.length - 1; i >= 0; i--) {
        const p = ambient[i]!;
        p.t += dtMove * p.speed;
        if (p.t >= 1) { ambient.splice(i, 1); continue; }
        const a = anchors.find((n) => n.id === p.id);
        if (!a) { ambient.splice(i, 1); continue; }
        const focus = hovered === p.id || S.node === p.id;
        const dim = (hovered && !focus) || (inSeq && !S.ids.has(p.id));
        if (dim) continue;
        const tt = p.dir === 1 ? p.t : 1 - p.t;
        const pt = point(a, core, tt);
        const col = colorOf(p.id);
        ctx!.globalAlpha = (focus ? 1 : 0.7) * ramp;
        ctx!.fillStyle = col;
        ctx!.beginPath(); ctx!.arc(pt.x, pt.y, 1.8, 0, Math.PI * 2); ctx!.fill();
        ctx!.globalAlpha = (focus ? 0.35 : 0.16) * ramp;
        ctx!.beginPath(); ctx!.arc(pt.x, pt.y, 5.5, 0, Math.PI * 2); ctx!.fill();
      }

      /* Sequence pulses: the bright convoy that walks the chosen process. */
      for (let i = bursts.length - 1; i >= 0; i--) {
        const b = bursts[i]!;
        b.t += dtMove * b.speed;
        if (b.t >= 1) { bursts.splice(i, 1); continue; }
        if (b.t < 0) continue;
        const nLegs = b.legs.length;
        const leg = Math.min(nLegs - 1, Math.floor(b.t * nLegs));
        const lt = b.t * nLegs - leg;
        const { a, b: bb } = b.legs[leg]!;
        const pt = point(a, bb, lt);
        const tail = point(a, bb, Math.max(0, lt - 0.05));
        ctx!.globalAlpha = 0.5 * ramp;
        ctx!.strokeStyle = b.color;
        ctx!.lineWidth = 1.2;
        ctx!.beginPath(); ctx!.moveTo(tail.x, tail.y); ctx!.lineTo(pt.x, pt.y); ctx!.stroke();
        ctx!.globalAlpha = 0.95 * ramp;
        ctx!.fillStyle = b.color;
        ctx!.beginPath(); ctx!.arc(pt.x, pt.y, 2.1, 0, Math.PI * 2); ctx!.fill();
        ctx!.globalAlpha = 0.2 * ramp;
        ctx!.beginPath(); ctx!.arc(pt.x, pt.y, 6.5, 0, Math.PI * 2); ctx!.fill();
      }
      ctx!.restore();

      /* The core: volumetric glow and three rotating rings, breathing harder
         while it is the active station. */
      const coreActive = S.node === 'core';
      // Sized past the core card, so the rings frame it instead of hiding.
      const R = Math.min(150, Math.min(w, h) * 0.27);
      const glow = ctx!.createRadialGradient(core.x, core.y, 0, core.x, core.y, R * 1.9);
      const g = coreActive ? 0.34 : 0.2 + Math.sin(t * 1.1) * 0.04;
      glow.addColorStop(0, pal.accent);
      glow.addColorStop(1, 'transparent');
      ctx!.save();
      ctx!.globalAlpha = g * ramp;
      ctx!.fillStyle = glow;
      ctx!.fillRect(core.x - R * 2, core.y - R * 2, R * 4, R * 4);
      ctx!.restore();

      ctx!.save();
      ctx!.strokeStyle = pal.accent;
      const rings: [number, number, number][] = [
        [R * 0.68, 0.7, Math.PI * 0.45],
        [R * 0.86, -0.45, Math.PI * 0.7],
        [R * 1.04, 0.28, Math.PI * 0.3],
      ];
      rings.forEach(([radius, speed, span], ri) => {
        const a0 = t * speed + ri * 2.1;
        ctx!.globalAlpha = (coreActive ? 1 : 0.85) * ramp;
        ctx!.lineWidth = ri === 1 ? 1.5 : 1.1;
        ctx!.beginPath(); ctx!.arc(core.x, core.y, radius, a0, a0 + span); ctx!.stroke();
        ctx!.globalAlpha = 0.2 * ramp;
        ctx!.beginPath(); ctx!.arc(core.x, core.y, radius, 0, Math.PI * 2); ctx!.stroke();
      });
      ctx!.setLineDash([2, 8]);
      ctx!.globalAlpha = 0.3 * ramp;
      ctx!.beginPath();
      ctx!.arc(core.x, core.y, R * 1.22 + Math.sin(t * 1.4) * 3, 0, Math.PI * 2);
      ctx!.stroke();
      ctx!.setLineDash([]);
      ctx!.restore();

      /* The human gate breathes amber while the world waits for a person. */
      if (S.node === 'person') {
        const pa = anchors.find((a) => a.id === 'person');
        if (pa) {
          ctx!.save();
          ctx!.strokeStyle = pal.amber;
          ctx!.globalAlpha = (0.5 + Math.sin(t * 3.2) * 0.25) * ramp;
          ctx!.lineWidth = 1.2;
          ctx!.beginPath();
          ctx!.arc(pa.x, pa.y, 14 + Math.sin(t * 3.2) * 3, 0, Math.PI * 2);
          ctx!.stroke();
          ctx!.restore();
        }
      }

      raf = requestAnimationFrame(draw);
    }

    function startLoop() { if (!running) { running = true; last = performance.now(); raf = requestAnimationFrame(draw); } }
    function stopLoop() { running = false; cancelAnimationFrame(raf); }

    layout();
    const io = new IntersectionObserver(([e]) => (e?.isIntersecting ? startLoop() : stopLoop()), { rootMargin: '80px' });
    io.observe(box);
    const ro = new ResizeObserver(layout);
    ro.observe(box);
    return () => { stopLoop(); io.disconnect(); ro.disconnect(); burstRef.current = null; };
  }, [palette, reduce]);

  /* ------------------------------------------------------------ rendering */
  const steps = seq ? stepsOf(seq.kind) : null;
  const cur = steps?.[seq!.step] ?? null;
  const activeId = cur?.n ?? null;
  const routeIds = steps ? new Set(steps.map((s) => s.n)) : null;
  const watching = seq?.kind === 'watch';

  const reg = (id: string) => (n: HTMLElement | null) => {
    if (n) nodeEls.current.set(id, n);
    else nodeEls.current.delete(id);
  };

  const nodeState = (id: string) => {
    if (activeId === id) return 'active';
    if (hover === id) return 'hover';
    if ((routeIds && !routeIds.has(id)) || (hover && hover !== id)) return 'dim';
    return 'idle';
  };

  const chip = (item: { id: string; k: string; d: string }, tone: 'violet' | 'accent') => {
    const st = nodeState(item.id);
    const toneText = tone === 'violet' ? 'text-violet' : 'text-accent';
    const toneBorder = tone === 'violet' ? 'border-violet/70' : 'border-accent/70';
    return (
      <li key={item.id}>
        <button
          type="button"
          ref={reg(item.id)}
          onMouseEnter={() => setHoverBoth(item.id)}
          onMouseLeave={() => setHoverBoth(null)}
          onFocus={() => setHoverBoth(item.id)}
          onBlur={() => setHoverBoth(null)}
          onClick={() => setHoverBoth(hover === item.id ? null : item.id)}
          aria-pressed={hover === item.id}
          className={`group w-full border bg-surface/85 px-3.5 py-2.5 text-left backdrop-blur-sm transition-all duration-[var(--duration-fast)] ${
            st === 'active' ? `${toneBorder} bg-raised/90`
            : st === 'hover' ? toneBorder
            : st === 'dim' ? 'border-rule opacity-40'
            : 'border-rule hover:border-rule-bright'
          }`}
        >
          <span className={`telemetry block transition-colors ${st === 'active' || st === 'hover' ? toneText : 'text-ink'}`}>
            {item.k}
          </span>
          <span className="mt-0.5 block text-[0.6875rem] leading-snug text-muted">{item.d}</span>
        </button>
      </li>
    );
  };

  const personSt = nodeState('person');
  const memorySt = nodeState('memory');

  return (
    <section
      ref={host}
      className="relative py-[var(--space-section)]"
      aria-labelledby="intelligence-heading"
      data-inspect="Intelligence · il livello operativo"
      data-spine="3"
    >
      <Container>
        <header className="max-w-[56ch]">
          <p className="chapter">
            <span className="tnum text-accent">{c.n}</span>
            <span>{c.label}</span>
          </p>
          <h2 id="intelligence-heading" className="headline mt-7 text-[length:var(--text-display-m)]">
            {c.headline}
          </h2>
          <div className="mt-8 h-px w-full max-w-[16rem] bg-gradient-to-r from-accent via-violet/60 to-transparent" />
          <p className="lead mt-7">{c.body}</p>
        </header>

        {/* Process selector + the guided run. */}
        <div className="mt-[var(--space-block)] flex flex-wrap items-center gap-2">
          <span className="telemetry mr-1 text-faint">{c.processesLabel}</span>
          {c.processes.map((p, i) => (
            <button
              key={p.k}
              type="button"
              onClick={() => (seq?.kind === i ? stopSeq() : start(i))}
              className={`border px-3 py-1.5 font-mono text-[0.6875rem] tracking-[0.16em] transition-colors duration-[var(--duration-fast)] ${
                seq?.kind === i
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-rule text-muted hover:border-rule-bright hover:text-ink'
              }`}
            >
              {p.k}
            </button>
          ))}
          <button
            type="button"
            onClick={() => (watching ? stopSeq() : start('watch'))}
            className={`ml-auto border px-4 py-2 font-mono text-[0.6875rem] tracking-[0.18em] transition-colors duration-[var(--duration-fast)] ${
              watching
                ? 'border-amber bg-amber-soft text-amber'
                : 'border-accent bg-accent/10 text-accent hover:bg-accent hover:text-ground'
            }`}
          >
            {watching ? c.watch.stop : `▸ ${c.watch.cta}`}
          </button>
        </div>

        {/* ------------------------------------------------- the living map */}
        <div ref={stage} className="relative mt-8">
          {/* A dark pool under the map so the streams read against the fixed
              3D backdrop instead of drowning in it. */}
          <div
            aria-hidden
            className="absolute inset-x-0 -inset-y-10 z-0 bg-[radial-gradient(ellipse_at_center,rgba(5,6,7,0.78),rgba(5,6,7,0.4)_58%,transparent_88%)] sm:-inset-x-6"
          />
          {reduce === false && (
            <canvas ref={canvas} aria-hidden className="pointer-events-none absolute inset-0 z-[1]" />
          )}

          <div className="relative z-10 grid gap-6 lg:grid-cols-[15rem_minmax(0,1fr)_15rem] lg:gap-8">
            {/* DOLMIR's agents — the specialised intelligences. */}
            <div className="order-2 lg:order-1">
              <p className="telemetry mb-3 text-violet/80">{c.agentsLabel}</p>
              <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1">
                {c.agents.map((a) => chip(a, 'violet'))}
              </ul>
            </div>

            {/* The spine: person above, core centre, memory beneath. */}
            <div className="order-1 flex flex-col items-center gap-6 lg:order-2 lg:gap-0">
              <button
                type="button"
                ref={reg('person')}
                onMouseEnter={() => setHoverBoth('person')}
                onMouseLeave={() => setHoverBoth(null)}
                onClick={() => setHoverBoth(hover === 'person' ? null : 'person')}
                className={`border px-4 py-2 backdrop-blur-sm transition-all duration-[var(--duration-fast)] ${
                  personSt === 'active' ? 'border-amber bg-amber-soft'
                  : personSt === 'hover' ? 'border-amber/70 bg-surface/85'
                  : personSt === 'dim' ? 'border-rule bg-surface/85 opacity-40'
                  : 'border-amber/40 bg-surface/85 hover:border-amber/70'
                }`}
              >
                <span className={`telemetry block ${personSt === 'active' ? 'text-amber' : 'text-ink'}`}>
                  ◆ {c.person.k}
                </span>
                <span className="mt-0.5 block text-[0.6875rem] text-muted">{c.person.d}</span>
              </button>

              <div className="flex min-h-[12rem] flex-1 items-center justify-center py-4 lg:min-h-[26rem]">
                <div ref={reg('core')} className="glass bracket relative px-8 py-6 text-center">
                  <p className="telemetry text-faint">{c.core.top}</p>
                  <p className="mt-1 font-mono text-[0.8125rem] tracking-[0.3em] text-ink">{c.core.sub}</p>
                  <p
                    key={cur ? `${String(seq?.kind)}-${seq?.step}` : `idle-${idle}`}
                    className={`settle mt-4 min-h-[1.4em] font-mono text-[0.71875rem] tracking-[0.18em] ${
                      cur?.n === 'person' ? 'text-amber' : 'text-accent'
                    }`}
                    aria-live="polite"
                  >
                    {cur ? cur.s : c.idle[idle]}
                  </p>
                </div>
              </div>

              <button
                type="button"
                ref={reg('memory')}
                onMouseEnter={() => setHoverBoth('memory')}
                onMouseLeave={() => setHoverBoth(null)}
                onClick={() => setHoverBoth(hover === 'memory' ? null : 'memory')}
                className={`w-full max-w-[26rem] border px-4 py-2.5 text-center backdrop-blur-sm transition-all duration-[var(--duration-fast)] ${
                  memorySt === 'active' ? 'border-steel-hi bg-raised/90'
                  : memorySt === 'hover' ? 'border-steel-hi bg-surface/85'
                  : memorySt === 'dim' ? 'border-rule bg-surface/85 opacity-40'
                  : 'border-rule bg-surface/85 hover:border-rule-bright'
                }`}
              >
                <span className={`telemetry block ${memorySt === 'active' || memorySt === 'hover' ? 'text-ink' : 'text-ink-2'}`}>
                  ▤ {c.memory.k}
                </span>
                <span className="mt-0.5 block text-[0.6875rem] text-muted">{c.memory.d}</span>
              </button>
            </div>

            {/* The company's own systems. DOLMIR connects; it replaces none. */}
            <div className="order-3">
              <p className="telemetry mb-3 text-accent/80 lg:text-right">{c.systemsLabel}</p>
              <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1">
                {c.systems.map((s) => chip(s, 'accent'))}
              </ul>
            </div>
          </div>
        </div>

        {/* The narration: one plain sentence per station. */}
        <div className="mt-6 flex min-h-[3.25rem] items-center border-t border-rule/60 pt-4">
          {cur ? (
            <div key={`${String(seq?.kind)}-${seq?.step}`} className="settle flex w-full flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className={`telemetry ${cur.n === 'person' ? 'text-amber' : 'text-accent'}`}>
                {watching ? `PASSO 0${seq!.step + 1}/0${steps!.length}` : c.processes[seq!.kind as number]!.k} · {cur.s}
              </span>
              <span className="text-[0.875rem] leading-snug text-ink-2">{cur.line}</span>
            </div>
          ) : (
            <p className="text-[0.8125rem] leading-snug text-muted">{c.hint}</p>
          )}
        </div>
        <p className="telemetry mt-3 text-faint">{c.disclaimer}</p>
      </Container>
    </section>
  );
}
