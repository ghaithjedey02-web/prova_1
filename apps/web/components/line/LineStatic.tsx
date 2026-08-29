import { stations } from './stations';

/**
 * Tier 3 — a static annotated diagram.
 *
 * Served to anyone who asked for reduced motion, and to any browser where the
 * other tiers cannot run. It carries the identical five-station argument, so
 * nothing about the proposition depends on being able to render animation.
 */
export function LineStatic() {
  return (
    <figure className="w-full">
      <svg
        viewBox="0 0 900 220"
        className="w-full"
        role="img"
        aria-label="Il percorso di una richiesta: arrivo non strutturato, estrazione dei dati, validazione con segnalazione delle incertezze, controllo umano che ferma il processo, risultato strutturato."
      >
        <line x1="60" y1="110" x2="840" y2="110" stroke="var(--c-rule-strong)" strokeWidth="1" />

        {stations.map((s, i) => {
          const x = 60 + (780 * i) / 4;
          const isGate = s.kind === 'gate';
          return (
            <g key={s.k}>
              <line x1={x} y1="98" x2={x} y2="122" stroke="var(--c-rule-strong)" strokeWidth="1" />
              {isGate ? (
                <>
                  <line x1={x} y1="52" x2={x} y2="88" stroke="var(--c-accent)" strokeWidth="2.5" />
                  <line x1={x} y1="132" x2={x} y2="168" stroke="var(--c-accent)" strokeWidth="2.5" />
                  <rect x={x - 5} y="105" width="10" height="10" fill="var(--c-accent)" />
                </>
              ) : (
                <circle cx={x} cy="110" r="4" fill={s.kind === 'flag' ? 'var(--c-amber)' : 'var(--c-muted)'} />
              )}
              <text
                x={x}
                y="34"
                textAnchor="middle"
                fill="var(--c-muted)"
                fontFamily="var(--font-mono)"
                fontSize="11"
                letterSpacing="1.4"
              >
                {s.k}
              </text>
              <text
                x={x}
                y="196"
                textAnchor="middle"
                fill="var(--c-ink)"
                fontFamily="var(--font-sans)"
                fontSize="14"
              >
                {s.t}
              </text>
            </g>
          );
        })}
      </svg>

      <figcaption className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
        {stations.map((s) => (
          <div key={s.k}>
            <p className="label tnum">{s.k} · {s.t}</p>
            <p className="mt-2 text-[var(--text-small)] leading-relaxed text-muted">{s.d}</p>
          </div>
        ))}
      </figcaption>
    </figure>
  );
}
