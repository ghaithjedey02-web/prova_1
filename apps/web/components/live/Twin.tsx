'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Chapter } from '@/components/ui/Chapter';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { usePalette } from '@/lib/palette';

/**
 * The digital twin of a company.
 *
 * Twelve systems that exist in every business, drawn as a live graph. Before the
 * section is reached they drift, unconnected — which is the honest picture of
 * most companies. As it enters view the DOLMIR core comes online and the edges
 * are drawn one at a time.
 *
 * The interaction is the argument: hovering a node traces its actual path
 * through the system and dims everything else, so the visitor discovers what
 * DOLMIR would do with *their* email, *their* ERP, one at a time, instead of
 * reading a list of capabilities. The panel text is the answer to "and what
 * would you do with that?" — the question every one of these conversations
 * eventually arrives at.
 */

interface Node {
  k: string;
  label: string;
  does: string;
  flow: string[];
  /** Unit circle position; the layout scales it to the canvas. */
  a: number;
  r: number;
}

const NODES: Node[] = [
  { k: 'email',     label: 'Email',        does: 'Legge la casella condivisa, riconosce di cosa si tratta e instrada. Non risponde mai da sola.', flow: ['Email', 'Classificazione', 'Estrazione', 'Gestionale', 'Approvazione'], a: -90, r: 1 },
  { k: 'documenti', label: 'Documenti',    does: 'Estrae i dati dagli allegati con l’evidenza esatta e li collega alla commessa giusta.', flow: ['Documenti', 'Estrazione', 'Verifica', 'Archivio', 'Ricerca'], a: -60, r: 1 },
  { k: 'ordini',    label: 'Ordini',       does: 'Trasforma una conferma d’ordine in righe scritte nel gestionale, con le eccezioni segnalate.', flow: ['Ordini', 'Estrazione righe', 'Anagrafiche', 'Gestionale', 'Conferma'], a: -30, r: 1 },
  { k: 'preventivi',label: 'Preventivi',   does: 'Prepara la bozza confrontando lo storico. Quando non ha basi, non propone un prezzo.', flow: ['Preventivi', 'Confidenza', 'Storico', 'Bozza', 'Approvazione'], a: 0, r: 1 },
  { k: 'clienti',   label: 'Clienti',      does: 'Tiene allineate le anagrafiche fra i sistemi, senza inserimenti doppi.', flow: ['Clienti', 'Riconciliazione', 'CRM', 'Gestionale'], a: 30, r: 1 },
  { k: 'fornitori', label: 'Fornitori',    does: 'Confronta le offerte in entrata e mette in evidenza le differenze che contano.', flow: ['Fornitori', 'Confronto', 'Acquisti', 'Approvazione'], a: 60, r: 1 },
  { k: 'magazzino', label: 'Magazzino',    does: 'Collega le giacenze alle richieste in corso, così una promessa di consegna è verificata.', flow: ['Magazzino', 'Disponibilità', 'Preventivi', 'Consegna'], a: 90, r: 1 },
  { k: 'erp',       label: 'Gestionale',   does: 'Resta dov’è. Ci innestiamo sopra: leggiamo e scriviamo, non sostituiamo.', flow: ['Gestionale', 'Sincronizzazione', 'Flussi', 'Indicatori'], a: 120, r: 1 },
  { k: 'crm',       label: 'CRM',          does: 'Riceve dal flusso quello che oggi qualcuno ricopia dopo una telefonata.', flow: ['CRM', 'Attività', 'Flussi', 'Indicatori'], a: 150, r: 1 },
  { k: 'file',      label: 'File',         does: 'Rende cercabile per contenuto quello che oggi è cercabile solo per nome.', flow: ['File', 'Indicizzazione', 'Ricerca', 'Documenti'], a: 180, r: 1 },
  { k: 'sito',      label: 'Sito',         does: 'Diventa una porta d’ingresso strutturata invece di un modulo con tre campi.', flow: ['Sito', 'Ingresso richieste', 'Classificazione', 'Preventivi'], a: 210, r: 1 },
  { k: 'persone',   label: 'Persone',      does: 'Restano al centro: ogni flusso si ferma davanti a chi deve decidere.', flow: ['Persone', 'Approvazione', 'Registro'], a: 240, r: 1 },
];

/** Node ring radii as a fraction of the panel, shared by the canvas and the DOM. */
const RX = 0.36;
const RY = 0.34;

export function Twin() {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const palette = usePalette();
  const [hover, setHover] = useState<Node | null>(null);
  const [touched, setTouched] = useState(false);
  const hoverRef = useRef<string | null>(null);

  useEffect(() => { hoverRef.current = hover?.k ?? null; }, [hover]);

  /**
   * A guided tour, until someone takes the wheel.
   *
   * A graph that only reveals itself on hover is a graph most visitors never
   * see. So it walks itself — one node every three seconds — and stops the
   * instant the visitor points at anything, handing over rather than competing.
   */
  const take = useCallback((n: Node | null) => { setTouched(true); setHover(n); }, []);

  useEffect(() => {
    if (touched) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let i = 0;
    const id = setInterval(() => {
      i = (i + 1) % NODES.length;
      setHover(NODES[i]!);
    }, 3000);
    return () => clearInterval(id);
  }, [touched]);

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
    let connect = reduce ? 1 : 0;
    const t0 = performance.now();
    const pts = NODES.map((n) => ({ ...n, x: 0, y: 0, seed: Math.random() * 9 }));

    function layout() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = box!.clientWidth;
      h = box!.clientHeight;
      el!.width = Math.floor(w * dpr);
      el!.height = Math.floor(h * dpr);
      el!.style.width = `${w}px`;
      el!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Exactly the fractions the labels use below, so a label always sits on
      // its own node however the panel is resized.
      pts.forEach((p) => {
        const rad = (p.a * Math.PI) / 180;
        p.x = w / 2 + Math.cos(rad) * w * RX;
        p.y = h / 2 + Math.sin(rad) * h * RY;
      });
    }

    function draw(now: number) {
      const time = (now - t0) / 1000;
      if (!reduce) connect = Math.min(1, connect + 0.014);
      ctx!.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;
      const active = hoverRef.current;

      pts.forEach((p, i) => {
        // Before the system comes online the nodes drift: unconnected systems
        // do not sit still in a company either.
        const drift = reduce ? 0 : (1 - connect) * Math.sin(time * 0.6 + p.seed) * 14;
        const px = p.x + drift;
        const py = p.y + drift * 0.6;
        const isActive = active === p.k;
        const dimmed = active !== null && !isActive;

        const appear = Math.min(1, Math.max(0, connect * NODES.length - i));
        if (appear > 0) {
          ctx!.save();
          ctx!.globalAlpha = (dimmed ? 0.09 : isActive ? 0.9 : 0.34) * appear;
          ctx!.strokeStyle = palette!.accent;
          ctx!.lineWidth = isActive ? 1.8 : 1.1;
          ctx!.beginPath();
          ctx!.moveTo(px, py);
          const mx = (px + cx) / 2;
          ctx!.bezierCurveTo(mx, py, mx, cy, cx, cy);
          ctx!.stroke();

          // A packet travelling the edge. The traced one is bright and
          // continuous; the others carry a slower, dimmer pulse so the system
          // reads as running even before anyone interacts with it.
          if (!reduce && (isActive || !dimmed)) {
            const tt = ((time * (isActive ? 0.7 : 0.16) + i * 0.37) % 1);
            const mt = 1 - tt;
            const bx = mt * mt * mt * px + 3 * mt * mt * tt * mx + 3 * mt * tt * tt * mx + tt * tt * tt * cx;
            const by = mt * mt * mt * py + 3 * mt * mt * tt * py + 3 * mt * tt * tt * cy + tt * tt * tt * cy;
            ctx!.globalAlpha = isActive ? 1 : 0.5 * appear;
            ctx!.fillStyle = palette!.accent;
            ctx!.fillRect(bx - 2.5, by - 1.5, isActive ? 5 : 3.5, isActive ? 3 : 2);
          }
          ctx!.restore();
        }

        ctx!.save();
        ctx!.globalAlpha = dimmed ? 0.22 : 1;
        ctx!.fillStyle = isActive ? palette!.accent : palette!.muted;
        ctx!.fillRect(px - 3, py - 3, 6, 6);
        if (isActive) {
          ctx!.strokeStyle = palette!.accent;
          ctx!.lineWidth = 1;
          ctx!.strokeRect(px - 8, py - 8, 16, 16);
        }
        ctx!.restore();
      });

      // core
      const pulse = reduce ? 0.6 : 0.6 + Math.sin(time * 1.5) * 0.2;
      const g = ctx!.createRadialGradient(cx, cy, 0, cx, cy, 72);
      g.addColorStop(0, withAlpha(palette!.accent, (0.16 + 0.14 * pulse) * connect));
      g.addColorStop(1, withAlpha(palette!.accent, 0));
      ctx!.fillStyle = g;
      ctx!.fillRect(cx - 74, cy - 74, 148, 148);

      ctx!.strokeStyle = withAlpha(palette!.accent, 0.35 + connect * 0.4);
      ctx!.lineWidth = 1.2;
      ctx!.beginPath();
      for (let i = 0; i <= 6; i++) {
        const a = (i / 6) * Math.PI * 2 - Math.PI / 2 + (reduce ? 0 : time * 0.1);
        const x = cx + Math.cos(a) * 26;
        const y = cy + Math.sin(a) * 26;
        i === 0 ? ctx!.moveTo(x, y) : ctx!.lineTo(x, y);
      }
      ctx!.closePath();
      ctx!.stroke();

      raf = requestAnimationFrame(draw);
    }

    function start() { if (!running) { running = true; raf = requestAnimationFrame(draw); } }
    function stop() { running = false; cancelAnimationFrame(raf); }

    layout();
    const io = new IntersectionObserver(([e]) => (e?.isIntersecting ? start() : stop()), { rootMargin: '120px' });
    io.observe(box);
    const ro = new ResizeObserver(layout);
    ro.observe(box);
    return () => { stop(); io.disconnect(); ro.disconnect(); };
  }, [palette]);

  return (
    <section className="relative py-[var(--space-section)]" data-inspect="Twin · grafo dei sistemi">
      <Container>
        <Chapter
          n="02"
          label="Gemello digitale"
          headline="Una vista del sistema, prima e dopo."
          lead="Dodici sistemi che esistono in ogni azienda. All’inizio sono scollegati e alla deriva — è la fotografia onesta della maggior parte delle imprese. Passate il cursore su uno per seguire il percorso che quel dato farebbe."
        />

        <Reveal delay={140}>
          <div className="glass-solid mt-[var(--space-block)] grid lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)]">
            <div ref={host} className="relative h-[22rem] overflow-hidden border-b border-rule sm:h-[32rem] lg:border-b-0 lg:border-r">
              <canvas ref={canvas} className="absolute inset-0" aria-hidden />

              {/* Nodes are real buttons: keyboard reachable, screen-reader
                  readable, and the canvas is only the picture of them. */}
              {NODES.map((n) => {
                const rad = (n.a * Math.PI) / 180;
                return (
                  <button
                    key={n.k}
                    type="button"
                    onPointerEnter={() => take(n)}
                    onFocus={() => take(n)}
                    onPointerLeave={() => take(null)}
                    onBlur={() => take(null)}
                    className={`absolute hidden whitespace-nowrap px-2 py-1 telemetry transition-colors duration-[var(--duration-fast)] sm:block ${
                      hover?.k === n.k ? 'text-accent' : hover ? 'text-faint' : 'text-muted hover:text-ink'
                    }`}
                    style={{
                      left: `${50 + Math.cos(rad) * RX * 100}%`,
                      top: `${50 + Math.sin(rad) * RY * 100}%`,
                      // Labels sit outside their node, on the side facing away
                      // from the core, so they never cover the edge they belong to.
                      transform: `translate(${Math.cos(rad) < -0.3 ? '-100%' : Math.cos(rad) > 0.3 ? '0%' : '-50%'}, ${
                        Math.sin(rad) < 0 ? '-140%' : '40%'
                      })`,
                    }}
                  >
                    {n.label}
                  </button>
                );
              })}

              <p className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-8 telemetry text-ink">
                DOLMIR CORE
              </p>
            </div>

            {/* On a phone the ring becomes a list: real touch targets, and
                nothing positioned absolutely that could widen the page. */}
            <ul className="flex flex-wrap gap-px border-b border-rule bg-rule/70 sm:hidden">
              {NODES.map((n) => (
                <li key={n.k} className="flex-1 bg-surface/92">
                  <button
                    type="button"
                    onClick={() => take(hover?.k === n.k ? null : n)}
                    aria-pressed={hover?.k === n.k}
                    className={`w-full whitespace-nowrap px-3 py-3 telemetry transition-colors ${
                      hover?.k === n.k ? 'bg-accent-soft text-accent' : 'text-muted'
                    }`}
                  >
                    {n.label}
                  </button>
                </li>
              ))}
            </ul>

            {/* ------------------------------------------------- inspector */}
            <div className="flex min-h-[16rem] flex-col p-6 sm:p-8">
              {hover ? (
                <div className="settle" key={hover.k}>
                  <p className="telemetry text-accent">{hover.label}</p>
                  <p className="mt-5 text-[var(--text-body)] leading-relaxed text-ink-2">{hover.does}</p>
                  <ol className="mt-8 flex flex-col gap-2.5 border-t border-rule pt-6">
                    {hover.flow.map((f, i) => (
                      <li key={f} className="flex items-center gap-3 telemetry text-muted">
                        <span className="text-faint">{String(i + 1).padStart(2, '0')}</span>
                        <span className={i === hover.flow.length - 1 ? 'text-accent' : ''}>{f}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              ) : (
                <div className="my-auto">
                  <p className="telemetry text-faint">Nessun nodo selezionato</p>
                  <p className="mt-5 max-w-[32ch] text-[var(--text-small)] leading-relaxed text-muted">
                    Passate il cursore su un sistema — o raggiungetelo da tastiera — per vedere cosa
                    DOLMIR ne farebbe e che percorso seguirebbe il dato.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
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
