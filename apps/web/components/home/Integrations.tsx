import { Chapter } from '@/components/ui/Chapter';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { chapters } from '@/content/site';

const c = chapters.integrations;

/**
 * Chapter 06 — the infrastructure map.
 *
 * Deliberately not a logo wall: no third-party marks, because a logo grid
 * implies partnerships we do not have. Instead the four surfaces of a company's
 * digital estate are drawn as a bus with connectors coming off it, which is what
 * an integration actually is.
 */
export function Integrations() {
  return (
    <section className="relative py-[var(--space-section)]">
      <Container>
        <Chapter n={c.n} label={c.label} headline={c.headline} lead={c.body} />

        <Reveal delay={140}>
          <div className="mt-[var(--space-block)]">
            {/* the bus */}
            <div className="relative h-10">
              <span aria-hidden className="absolute left-0 right-0 top-1/2 h-px wire" />
              <span aria-hidden className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 bg-accent" />
              <span className="absolute left-1/2 top-0 -translate-x-1/2 telemetry text-accent">DOLMIR · BUS</span>
            </div>

            <div className="grid gap-px border border-rule bg-rule/70 md:grid-cols-2 lg:grid-cols-4">
              {c.groups.map((g, i) => (
                <Reveal key={g.k} delay={i * 60} className="bg-surface/92 backdrop-blur-md">
                  <div className="group relative h-full p-7">
                    {/* the connector dropping from the bus into this surface */}
                    <span aria-hidden className="absolute -top-10 left-7 h-10 w-px bg-rule-bright transition-colors duration-[var(--duration-base)] group-hover:bg-accent" />
                    <p className="telemetry text-accent">{g.k}</p>
                    <ul className="mt-5 flex flex-col gap-2.5">
                      {g.items.map((it) => (
                        <li key={it} className="flex items-center gap-3 text-[var(--text-small)] text-ink-2">
                          <span aria-hidden className="block size-1 shrink-0 bg-rule-bright transition-colors duration-[var(--duration-fast)] group-hover:bg-accent" />
                          {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={160}>
              <p className="mt-8 max-w-[62ch] border-l-2 border-rule-strong pl-6 text-[var(--text-small)] leading-relaxed text-muted">
                {c.caveat}
              </p>
            </Reveal>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
