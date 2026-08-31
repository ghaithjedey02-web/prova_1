'use client';

import { useEffect, useState } from 'react';
import { Chapter } from '@/components/ui/Chapter';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { setActivity, type Activity } from '@/lib/system-bus';
import { capabilities } from '@/content/site';

/**
 * What DOLMIR builds — as an instrument, not a card grid.
 *
 * Six families on a selector rail; choosing one draws that family's schematic
 * and lists the concrete systems it contains. The schematics are six real
 * little diagrams (a gated chain, a document fanning into fields, sources
 * merging, a board, an application frame, a layer over existing blocks) —
 * drawn inline so each one states its family's argument in shapes before the
 * words do. Selection also drives the intelligence core in the background,
 * because choosing "AI" should make the machine think.
 */

const FAMILY_ACTIVITY: Record<string, Activity> = {
  automazione: 'processing',
  ai: 'understanding',
  dati: 'analyzing',
  operazioni: 'verifying',
  software: 'ready',
  intelligenza: 'understanding',
};

export function Capabilities() {
  const [active, setActive] = useState(0);
  const item = capabilities.items[active]!;

  useEffect(() => {
    setActivity(FAMILY_ACTIVITY[item.k] ?? 'idle');
    return () => setActivity('idle');
  }, [item.k]);

  return (
    <section
      className="relative py-[var(--space-section)]"
      aria-labelledby="capabilities-heading"
      data-inspect="Capabilities · sei famiglie di sistemi"
    >
      <Container>
        <Chapter
          n={capabilities.n}
          label={capabilities.label}
          headline={capabilities.headline}
          lead={capabilities.body}
        />

        <Reveal delay={120}>
          <div className="glass-solid mt-[var(--space-block)] grid lg:grid-cols-[15rem_minmax(0,1fr)]">
            {/* Selector rail. */}
            <div
              role="tablist"
              aria-label="Famiglie di sistemi"
              className="flex overflow-x-auto border-b border-rule lg:flex-col lg:overflow-visible lg:border-b-0 lg:border-r"
            >
              {capabilities.items.map((it, i) => (
                <button
                  key={it.k}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  className={`group relative flex-none px-5 py-4 text-left transition-colors duration-[var(--duration-fast)] lg:border-b lg:border-rule ${
                    i === active ? 'text-ink' : 'text-muted hover:text-ink-2'
                  }`}
                >
                  <span
                    aria-hidden
                    className={`absolute inset-y-0 left-0 w-0.5 bg-accent transition-transform duration-[var(--duration-base)] ease-[var(--ease-mech)] ${
                      i === active ? 'scale-y-100' : 'scale-y-0'
                    }`}
                  />
                  <span className="telemetry block">
                    <span className={`mr-2 ${i === active ? 'text-accent' : 'text-faint'}`}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {it.label}
                  </span>
                </button>
              ))}
            </div>

            {/* The family, stated in shapes and then in words. */}
            <div key={item.k} className="settle grid gap-0 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              <div className="relative flex min-h-[15rem] items-center justify-center border-b border-rule p-6 md:border-b-0 md:border-r">
                <div aria-hidden className="sheet-fine absolute inset-0 opacity-60" />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_45%,color-mix(in_oklab,var(--c-accent)_7%,transparent)_0%,transparent_70%)]"
                />
                <p className="telemetry absolute left-5 top-4 text-faint">
                  SCHEMA · {item.label.toUpperCase()}
                </p>
                <Schematic kind={item.diagram} />
              </div>
              <div className="flex flex-col justify-center p-6 sm:p-8">
                <p className="telemetry text-faint">OGGI</p>
                <p className="mt-1.5 text-[var(--text-small)] leading-relaxed text-muted">{item.problem}</p>
                <p className="telemetry mt-4 text-accent">CON DOLMIR</p>
                <p className="mt-1.5 text-[var(--text-body)] leading-relaxed text-ink-2">{item.claim}</p>
                <p className="telemetry mt-4 text-good">RISULTATO</p>
                <p className="mt-1.5 text-[var(--text-small)] leading-relaxed text-ink-2">{item.result}</p>
                <ul className="mt-7 space-y-2.5 border-t border-rule pt-6">
                  {item.builds.map((b, i) => (
                    <li key={b} className="flex items-baseline gap-3">
                      <span className="telemetry text-faint">{String(i + 1).padStart(2, '0')}</span>
                      <span className="font-mono text-[0.8125rem] text-muted">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------- schematics ---*/

/**
 * One diagram per family. Shared vocabulary: boxes are systems, hairlines are
 * flows, the filled square is DOLMIR, the ring is the human gate. All strokes
 * use tokens, so the diagrams live in the same palette as everything else.
 */
function Schematic({ kind }: { kind: string }) {
  const stroke = 'var(--c-rule-bright)';
  const accent = 'var(--c-accent)';
  const amber = 'var(--c-amber)';
  const common = { fill: 'none', strokeWidth: 1.2 } as const;

  return (
    <svg viewBox="0 0 240 130" className="scan h-auto w-full max-w-[19rem]" aria-hidden>
      {kind === 'chain' && (
        <g {...common}>
          {[0, 1, 2].map((i) => (
            <rect key={i} x={10 + i * 58} y={54} width={34} height={22} stroke={stroke} />
          ))}
          <rect x={188} y={54} width={34} height={22} stroke={accent} />
          {[0, 1, 2].map((i) => (
            <line key={i} x1={44 + i * 58} y1={65} x2={68 + i * 58 - 10} y2={65} stroke={accent} opacity={0.6} />
          ))}
          {/* the human gate on the last hop */}
          <circle cx={178} cy={65} r={7} stroke={amber} />
          <line x1={178} y1={38} x2={178} y2={58} stroke={amber} opacity={0.7} />
          <text x={178} y={32} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="7" fill={amber} letterSpacing="0.12em" stroke="none">PERSONA</text>
        </g>
      )}
      {kind === 'extract' && (
        <g {...common}>
          <rect x={16} y={30} width={52} height={70} stroke={stroke} />
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1={24} y1={44 + i * 14} x2={60 - (i % 2) * 12} y2={44 + i * 14} stroke={stroke} opacity={0.7} />
          ))}
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <path d={`M 68 65 C 110 65 110 ${38 + i * 27} 152 ${38 + i * 27}`} stroke={accent} opacity={0.55} />
              <rect x={152} y={28 + i * 27} width={72} height={18} stroke={accent} opacity={0.8} />
              <text x={158} y={40 + i * 27} fontFamily="var(--font-mono)" fontSize="7" fill={accent} stroke="none" letterSpacing="0.1em">
                {['CAMPO · 0.97', 'CAMPO · 0.91', 'CAMPO · 0.64'][i]}
              </text>
            </g>
          ))}
        </g>
      )}
      {kind === 'merge' && (
        <g {...common}>
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <rect x={12} y={12 + i * 28} width={44} height={18} stroke={stroke} />
              <path d={`M 56 ${21 + i * 28} C 110 ${21 + i * 28} 110 65 156 65`} stroke={accent} opacity={0.45} />
            </g>
          ))}
          <rect x={156} y={48} width={68} height={34} stroke={accent} />
          <text x={190} y={68} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="7.5" fill={accent} stroke="none" letterSpacing="0.14em">UNA FONTE</text>
        </g>
      )}
      {kind === 'board' && (
        <g {...common}>
          {[0, 1, 2].map((c) => (
            <g key={c}>
              <rect x={20 + c * 70} y={18} width={56} height={96} stroke={stroke} />
              <line x1={26 + c * 70} y1={32} x2={60 + c * 70} y2={32} stroke={stroke} />
              {[0, 1, 2].map((r) => (
                <rect
                  key={r}
                  x={26 + c * 70}
                  y={42 + r * 22}
                  width={44}
                  height={14}
                  stroke={c === 1 && r === 0 ? accent : stroke}
                  opacity={c === 2 && r === 2 ? 0 : 0.85}
                />
              ))}
            </g>
          ))}
          <line x1={76} y1={49} x2={90} y2={49} stroke={accent} opacity={0.7} />
        </g>
      )}
      {kind === 'app' && (
        <g {...common}>
          <rect x={26} y={16} width={188} height={100} stroke={stroke} />
          <line x1={26} y1={34} x2={214} y2={34} stroke={stroke} />
          <circle cx={38} cy={25} r={2.5} stroke={accent} />
          <line x1={26} y1={34} x2={26} y2={116} stroke={stroke} />
          <rect x={26} y={34} width={52} height={82} stroke={stroke} />
          {[0, 1, 2].map((i) => (
            <line key={i} x1={34} y1={50 + i * 16} x2={68} y2={50 + i * 16} stroke={i === 0 ? accent : stroke} opacity={0.8} />
          ))}
          {[0, 1, 2].map((i) => (
            <line key={i} x1={90} y1={54 + i * 20} x2={200} y2={54 + i * 20} stroke={stroke} opacity={0.7} />
          ))}
          <rect x={90} y={44} width={44} height={6} fill={accent} stroke="none" opacity={0.8} />
        </g>
      )}
      {kind === 'layer' && (
        <g {...common}>
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={18 + i * 54} y={84} width={42} height={28} stroke={stroke} />
          ))}
          <rect x={40} y={26} width={160} height={24} stroke={accent} />
          <text x={120} y={41} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="7.5" fill={accent} stroke="none" letterSpacing="0.16em">INTELLIGENZA</text>
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1={39 + i * 54} y1={84} x2={70 + i * 34} y2={50} stroke={accent} opacity={0.4} />
          ))}
        </g>
      )}
    </svg>
  );
}
