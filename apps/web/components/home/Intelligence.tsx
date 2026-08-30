import { Chapter } from '@/components/ui/Chapter';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { intelligence as g } from '@/content/site';

/**
 * Chapter 10. The numbers that only exist once the work runs through a process.
 *
 * The chart is drawn as an SVG area from the same array the panels read, so
 * there is no risk of the picture and the figures drifting apart. All values are
 * illustrative and the panel says so twice — once in the caption, once in the
 * footer of the frame.
 */
export function Intelligence() {
  const max = Math.max(...g.series);
  const pts = g.series.map((v, i) => {
    const x = (i / (g.series.length - 1)) * 100;
    const y = 100 - (v / max) * 88;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });

  return (
    <section className="border-b border-rule py-[var(--space-section)]">
      <Container>
        <Chapter n={g.n} label={g.label} headline={g.headline} lead={g.body} />

        <div className="mt-[var(--space-block)] grid gap-px border border-rule bg-rule lg:grid-cols-[1.1fr_0.9fr]">
          {/* ------------------------------------------------------- panels */}
          <div className="grid gap-px bg-rule sm:grid-cols-2">
            {g.panels.map((p, i) => (
              <Reveal key={p.k} delay={i * 60} className="bg-surface">
                <div className="p-7">
                  <p className="label">{p.k}</p>
                  <p className="mt-5 font-display text-[length:var(--text-display-m)] font-semibold tnum text-ink">{p.v}</p>
                  <p className="mt-1.5 text-[var(--text-micro)] text-muted">{p.sub}</p>
                  <div aria-hidden className="mt-5 h-0.5 w-full bg-rule">
                    <div className="h-full bg-accent" style={{ width: `${p.bar * 100}%` }} />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* -------------------------------------------------------- chart */}
          <Reveal delay={140} className="bg-void">
            <figure className="flex h-full flex-col p-7">
              <figcaption className="label">Richieste per mese · dati di esempio</figcaption>
              <div className="relative mt-6 flex-1">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full min-h-[11rem] w-full" aria-hidden>
                  <defs>
                    <linearGradient id="dolmir-area" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--c-accent)" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="var(--c-accent)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {[25, 50, 75].map((y) => (
                    <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="var(--c-rule)" strokeWidth="0.4" vectorEffect="non-scaling-stroke" />
                  ))}
                  <polygon points={`0,100 ${pts.join(' ')} 100,100`} fill="url(#dolmir-area)" />
                  <polyline
                    points={pts.join(' ')}
                    fill="none"
                    stroke="var(--c-accent)"
                    strokeWidth="1.4"
                    vectorEffect="non-scaling-stroke"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="mt-6 border-t border-rule pt-4 font-mono text-[var(--text-label)] tracking-[0.1em] text-muted">
                {g.disclaimer}
              </p>
            </figure>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
