import { PART, holeAngles } from './part';

/**
 * The drawing tier.
 *
 * Reduced motion, or no JavaScript at all. A real orthographic drawing of the
 * same part with its dimensions — which for this audience is arguably the most
 * legible of the three tiers, so it is built to be seen, not tolerated.
 */
export function ForgeStatic({ className = '' }: { className?: string }) {
  const R = PART.outerDiameter / 2;
  const bore = PART.innerDiameter / 2;
  const bcd = PART.boltCircle / 2;
  const hole = PART.holeDiameter / 2;
  const hub = PART.hubDiameter / 2;
  const pad = 46;
  const size = PART.outerDiameter + pad * 2;

  return (
    <svg
      viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`}
      className={className}
      role="img"
      aria-label={`Disegno tecnico del particolare ${PART.code}: flangia tornita Ø${PART.outerDiameter} con ${PART.holeCount} fori Ø${PART.holeDiameter} su circonferenza Ø${PART.boltCircle}.`}
    >
      <g fill="none" strokeLinecap="round">
        <line x1={-R - 26} y1="0" x2={R + 26} y2="0" stroke="var(--c-rule-strong)" strokeWidth="0.7" strokeDasharray="10 5 2 5" />
        <line x1="0" y1={-R - 26} x2="0" y2={R + 26} stroke="var(--c-rule-strong)" strokeWidth="0.7" strokeDasharray="10 5 2 5" />

        <circle r={R} stroke="var(--c-ink)" strokeWidth="1.4" />
        <circle r={R - 2.5} stroke="var(--c-rule)" strokeWidth="0.8" />
        <circle r={hub} stroke="var(--c-muted)" strokeWidth="1" />
        <circle r={bore} stroke="var(--c-ink)" strokeWidth="1.4" />
        <circle r={bcd} stroke="var(--c-accent)" strokeWidth="0.8" strokeDasharray="4 4" />

        {holeAngles().map((a, i) => {
          const x = Math.cos(a - Math.PI / 2) * bcd;
          const y = Math.sin(a - Math.PI / 2) * bcd;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={hole} stroke="var(--c-ink)" strokeWidth="1.2" />
              <line x1={x - hole * 1.6} y1={y} x2={x + hole * 1.6} y2={y} stroke="var(--c-rule-strong)" strokeWidth="0.6" />
              <line x1={x} y1={y - hole * 1.6} x2={x} y2={y + hole * 1.6} stroke="var(--c-rule-strong)" strokeWidth="0.6" />
            </g>
          );
        })}

        <line x1={-R} y1={R + 20} x2={R} y2={R + 20} stroke="var(--c-rule-bright)" strokeWidth="0.7" />
        <line x1={-R} y1={R + 15} x2={-R} y2={R + 25} stroke="var(--c-rule-bright)" strokeWidth="0.7" />
        <line x1={R} y1={R + 15} x2={R} y2={R + 25} stroke="var(--c-rule-bright)" strokeWidth="0.7" />
      </g>

      <g fontFamily="var(--font-mono)" fontSize="8.5" fill="var(--c-muted)" letterSpacing="0.06em">
        <text x="0" y={R + 34} textAnchor="middle">Ø{PART.outerDiameter}</text>
        <text x={-size / 2 + 6} y={-size / 2 + 14}>{PART.code} · REV {PART.revision}</text>
        <text x={-size / 2 + 6} y={size / 2 - 6} fill="var(--c-accent)">{PART.holeCount} × Ø{PART.holeDiameter} su Ø{PART.boltCircle}</text>
      </g>
    </svg>
  );
}
