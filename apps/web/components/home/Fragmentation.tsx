import { Chapter } from '@/components/ui/Chapter';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { chapters } from '@/content/site';

const c = chapters.fragmentation;

/**
 * Chapter 01.
 *
 * The eight tools are placed on a hard grid with hairline gaps and *no*
 * connections between them — the layout is the argument. A reader who only
 * looks at the shapes has already understood that nothing here talks to
 * anything else.
 */
export function Fragmentation() {
  return (
    <section className="relative py-[var(--space-section)]">
      <Container>
        <Chapter n={c.n} label={c.label} headline={c.headline} lead={c.body} />

        <ul className="mt-[var(--space-block)] grid gap-px border border-rule bg-rule/70 sm:grid-cols-2 lg:grid-cols-4">
          {c.nodes.map((n, i) => (
            <Reveal key={n.k} delay={i * 45} className="bg-surface/92 backdrop-blur-md">
              <div className="group relative h-full overflow-hidden p-6">
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-[var(--duration-base)] ease-[var(--ease-mech)] group-hover:scale-x-100"
                />
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-mono text-[var(--text-micro)] uppercase tracking-[0.18em] text-ink">{n.k}</p>
                  <span className="telemetry text-faint">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <p className="mt-3 text-[var(--text-small)] leading-relaxed text-muted">{n.d}</p>
                {/* A severed connector: the wire leaves the tile and stops. */}
                <span aria-hidden className="mt-6 block h-px w-8 bg-rule-bright transition-all duration-[var(--duration-base)] group-hover:w-16 group-hover:bg-accent" />
              </div>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={120}>
          <p className="mt-10 max-w-[62ch] border-l-2 border-accent pl-6 text-[length:var(--text-display-s)] leading-snug text-ink-2">
            {c.kicker}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
