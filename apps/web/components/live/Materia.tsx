'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Container } from '@/components/ui/Container';
import { ForgeStatic } from '@/components/forge/ForgeStatic';
import { detectTier, type Tier } from '@/lib/capability';
import { usePalette } from '@/lib/palette';
import { emit, setActivity, type Activity } from '@/lib/system-bus';

const MateriaScene = dynamic(() => import('./MateriaScene'), { ssr: false });

/**
 * MATERIA — the one cinematic sequence on the site.
 *
 * A machined part is scanned, loses its material, becomes geometry, becomes
 * four thousand points, takes a structure, and ends as a single row inside a
 * system. It is the entire DOLMIR argument made with an object instead of a
 * paragraph, and it is the reason the flange is still here: not as a hero
 * render, but as a digital twin whose readout decodes while you scroll.
 *
 * Scroll drives everything. The section is pinned for its own height and the
 * local 0..1 is written to a ref once per frame — the WebGL sequence reads that
 * ref inside its render loop and never re-renders React, while the readout
 * re-renders six times over the whole passage. Same scalar, two consumers.
 */

interface Act {
  code: string;
  title: string;
  line: string;
  activity: Activity;
  event: [string, string];
}

/** Six beats: matter → reading → geometry → data → structure → system. */
const ACTS: readonly Act[] = [
  {
    code: 'MATERIA',
    title: 'Un pezzo esiste.',
    line: 'Acciaio tornito, sei fori, una tolleranza. Fuori dal sistema è soltanto un oggetto su un bancale, e tutto quello che si sa di lui è scritto su un foglio.',
    activity: 'idle',
    event: ['OBJ.PRESENT', 'FL-2280 · nessun record collegato'],
  },
  {
    code: 'LETTURA',
    title: 'Il sistema lo legge.',
    line: 'Un disegno allegato a una email. Il primo passaggio non è capire: è guardare, e sapere esattamente da quale punto del documento arriva ogni valore.',
    activity: 'listening',
    event: ['DOC.READ', 'allegato 1 · PDF, 1 pagina'],
  },
  {
    code: 'GEOMETRIA',
    title: 'Il materiale non serve più.',
    line: 'Quello che conta sono le quote e le relazioni fra loro. La superficie era il modo di guardare il pezzo, non il pezzo.',
    activity: 'analyzing',
    event: ['GEOM.EXTRACT', '5 quote · 1 circonferenza fori'],
  },
  {
    code: 'DATO',
    title: 'Adesso è misurabile.',
    line: 'Quattromiladuecento punti al posto di una superficie continua. Da qui in poi questo pezzo si può confrontare con tutti gli altri che sono già passati.',
    activity: 'understanding',
    event: ['PTS.SAMPLE', '4.200 punti dalla superficie'],
  },
  {
    code: 'STRUTTURA',
    title: 'I dati prendono una forma.',
    line: 'Campi, tipi, unità di misura. Non un testo da rileggere ogni volta: una struttura su cui un sistema può ragionare, e su cui una persona può controllare.',
    activity: 'processing',
    event: ['SCHEMA.BIND', 'campi tipizzati · unità dichiarate'],
  },
  {
    code: 'RECORD',
    title: 'Una riga dentro un sistema.',
    line: 'Da qui parte un preventivo, un ordine, una commessa. Il pezzo è entrato in azienda, e da adesso esiste anche quando nessuno lo sta guardando.',
    activity: 'ready',
    event: ['REC.WRITE', 'RIC-4471 · collegato a FL-2280'],
  },
];

/**
 * The digital twin.
 *
 * Same six fields for the whole sequence; only the values change, from the way
 * a person describes a part to the way a system stores one. Nothing here is a
 * client, a result or a number about DOLMIR: it is one example component.
 */
const FIELDS: readonly { k: string; v: readonly string[] }[] = [
  {
    k: 'ID',
    v: ['FL-2280', 'FL-2280', 'FL-2280', 'FL-2280', 'FL-2280', 'RIC-4471 · FL-2280'],
  },
  {
    k: 'Materiale',
    v: ['Acciaio C40', 'Acciaio C40', 'C40 / EN 10083-2', 'C40 / EN 10083-2', 'mat: C40 · norma: EN 10083-2', 'mat: C40 · norma: EN 10083-2'],
  },
  {
    k: 'Revisione',
    v: ['C', 'C', 'REV C', 'REV C', 'rev: C · agg. 11-03-2026', 'rev: C · agg. 11-03-2026'],
  },
  {
    k: 'Quote',
    v: [
      'Ø180 · Ø62 · 18 mm',
      'Ø180 · Ø62 · 18 mm',
      'Ø180 h9 · Ø62 H7 · 18 ±0,05',
      '6 × Ø13 su Ø138 BCD',
      'od:180 id:62 sp:18 bcd:138 n:6',
      'od:180 id:62 sp:18 bcd:138 n:6',
    ],
  },
  {
    k: 'Stato',
    v: ['Fisico', 'In lettura', 'Geometria estratta', 'Punti: 4.200', 'Strutturato', 'In sistema'],
  },
  {
    k: 'Origine',
    v: [
      'Bancale, reparto tornitura',
      'Disegno allegato (PDF)',
      'PDF p.1 · vista in pianta',
      'PDF p.1 · tabella quote',
      'Estrazione automatica',
      'RIC-4471 / allegato 1',
    ],
  },
];

export function Materia() {
  const host = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const seen = useRef(new Set<number>());
  const [act, setAct] = useState(0);
  const [tier, setTier] = useState<Tier | null>(null);
  const [live, setLive] = useState(false);
  const palette = usePalette();

  useEffect(() => { setTier(detectTier()); }, []);

  /* One rAF-throttled listener writes the ref for the render loop and, six
     times in the whole passage, moves the readout on. */
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let ticking = false;

    function update() {
      ticking = false;
      const node = host.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      const p = span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 0;
      progress.current = p;
      setLive(rect.top < window.innerHeight && rect.bottom > 0);
      const next = Math.min(ACTS.length - 1, Math.floor(p * ACTS.length));
      setAct((prev) => (prev === next ? prev : next));
    }
    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  /* The sequence drives the intelligence core in the background: reading the
     object is a real state of the machine, not a caption. */
  useEffect(() => {
    if (!live) return;
    const a = ACTS[act]!;
    setActivity(a.activity);
    if (!seen.current.has(act)) {
      seen.current.add(act);
      emit(a.event[0], a.event[1], act === ACTS.length - 1 ? 'good' : 'accent');
    }
  }, [act, live]);

  useEffect(() => () => { setActivity('idle'); }, []);

  /** Rail ticks jump to their beat — nothing on this page is decorative. */
  const jump = useCallback((i: number) => {
    const node = host.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const span = rect.height - window.innerHeight;
    const target = window.scrollY + rect.top + span * ((i + 0.5) / ACTS.length);
    window.scrollTo({ top: target, behavior: 'smooth' });
  }, []);

  const current = ACTS[act]!;
  const showScene = tier === 'three' && palette !== null;

  return (
    <section
      ref={host}
      className="relative h-[260vh] md:h-[400vh]"
      aria-labelledby="materia-heading"
      data-inspect="Materia · sequenza fisico → sistema"
    >
      <div className="sticky top-0 flex h-screen w-full flex-col justify-end overflow-hidden pb-10 pt-[5.25rem] md:pb-20 lg:pt-0">
        {/* One scene at a time: the fixed machine behind the whole site steps
            back here so the sequence is the only thing moving. */}
        <div className="pointer-events-none absolute inset-0 bg-ground/90" aria-hidden />
        <div className="pool pointer-events-none absolute inset-x-0 top-0 h-1/2" aria-hidden />

        {/* The sequence itself.
            With WebGL it owns the whole frame and the writing sits on the floor
            of it. Without WebGL it becomes a flex row that takes exactly the
            space the writing does not need — measured by the layout rather than
            guessed at with a percentage, so it can never end up behind a panel
            on a short screen. */}
        {showScene ? (
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <MateriaScene progress={progress} palette={palette!} />
          </div>
        ) : (
          <div className="pointer-events-none relative min-h-[6.5rem] flex-1 pb-5" aria-hidden>
            <MateriaFallback act={act} />
          </div>
        )}

        {/* Ground under the writing, so the point cloud never crosses a line of
            text on its way past. */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-ground via-ground/92 to-transparent"
          aria-hidden
        />

        <Container className="relative">
          <div className="grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-8">
            {/* Narration. */}
            <div className="max-w-[44ch]">
              <p className="chapter">
                <span className="tnum text-accent">07</span>
                <span>Caso reale · manifattura</span>
              </p>
              <h2
                id="materia-heading"
                className="headline mt-4 text-[1.35rem] sm:text-[length:var(--text-display-s)] md:mt-5 md:text-[length:var(--text-display-m)]"
              >
                Da oggetto a sistema.
              </h2>

              <div key={act} className="settle mt-6 lg:mt-7">
                <p className="telemetry text-accent">{current.code}</p>
                <p className="mt-3 text-[length:var(--text-display-s)] leading-snug text-ink">
                  {current.title}
                </p>
                <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted sm:text-[var(--text-small)]">
                  {current.line}
                </p>
              </div>

              {/* Beat rail. */}
              <ol className="mt-6 flex items-center gap-2 lg:mt-8">
                {ACTS.map((a, i) => (
                  <li key={a.code}>
                    <button
                      type="button"
                      onClick={() => jump(i)}
                      aria-current={i === act ? 'step' : undefined}
                      className="group flex flex-col gap-2 py-2 pr-3 text-left"
                    >
                      <span
                        className={`block h-px transition-all duration-[var(--duration-base)] ease-[var(--ease-mech)] ${
                          i === act ? 'w-14 bg-accent' : 'w-8 bg-rule-bright group-hover:bg-muted'
                        }`}
                      />
                      <span
                        className={`telemetry text-[0.625rem] transition-colors ${
                          i === act ? 'text-ink' : 'text-faint group-hover:text-muted'
                        }`}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="sr-only">{a.code} — {a.title}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>

            {/* The twin. */}
            <div className="glass-solid bracket p-5 lg:p-6">
              <div className="flex items-baseline justify-between gap-3">
                <p className="telemetry text-ink">Gemello digitale</p>
                <p className="telemetry text-accent">{current.code}</p>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-x-5 gap-y-2.5 lg:mt-5 lg:block lg:space-y-3">
                {FIELDS.map((f) => (
                  <div
                    key={f.k}
                    className="border-t border-rule pt-3 lg:grid lg:grid-cols-[6rem_minmax(0,1fr)] lg:items-baseline lg:gap-3"
                  >
                    <dt className="telemetry text-[0.625rem] text-faint">{f.k}</dt>
                    <dd
                      key={f.v[act]}
                      className={`settle mt-1 font-mono text-[0.75rem] leading-snug [word-break:break-word] lg:mt-0 ${
                        act === ACTS.length - 1 && f.k === 'ID' ? 'text-accent' : 'text-ink-2'
                      }`}
                    >
                      {f.v[act]}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 border-t border-rule pt-3 text-[0.625rem] leading-relaxed text-muted lg:mt-5 lg:pt-3.5 lg:text-[0.6875rem]">
                Dimostrazione. FL-2280 è un particolare di esempio: valori tecnici plausibili,
                nessun dato di un cliente reale.
              </p>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}

/**
 * The sequence without WebGL — phones, weak GPUs, reduced motion.
 *
 * Same six beats told with the drawing tier: the technical drawing gives way to
 * a field of points, which compacts into bands. Drawn as SVG rather than as DOM
 * boxes so it scales to whatever height the layout can spare, down to a strip
 * on a short phone, without ever overflowing or being cropped.
 */
function MateriaFallback({ act }: { act: number }) {
  const compact = act >= 4;
  const cols = compact ? 28 : 14;
  const rows = Math.ceil(168 / cols);
  const sx = compact ? 7.2 : 8.4;
  const sy = compact ? 7 : 8.4;

  return (
    <div className="relative h-full w-full">
      <div
        className="absolute inset-0 transition-opacity duration-[var(--duration-slow)] ease-[var(--ease-mech)]"
        style={{ opacity: act <= 1 ? 0.9 : act === 2 ? 0.55 : 0.12 }}
      >
        <ForgeStatic className="h-full w-full" />
      </div>
      <svg
        viewBox="0 0 240 160"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 h-full w-full transition-opacity duration-[var(--duration-slow)]"
        style={{ opacity: act >= 3 ? 1 : 0 }}
        aria-hidden
      >
        {Array.from({ length: 168 }, (_, i) => (
          <circle
            key={i}
            cx={120 + ((i % cols) - (cols - 1) / 2) * sx}
            cy={80 + (Math.floor(i / cols) - (rows - 1) / 2) * sy}
            r={1.15}
            fill="var(--c-accent)"
            opacity={0.75}
          />
        ))}
      </svg>
    </div>
  );
}
