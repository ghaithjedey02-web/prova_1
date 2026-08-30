import { Chapter } from '@/components/ui/Chapter';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { chapters } from '@/content/site';

const c = chapters.noise;

/**
 * Chapter 01. Twelve doors into one person.
 *
 * The channel tiles are laid out on a hard grid with hairline gaps so they read
 * as a distribution board rather than as feature cards — the difference between
 * "here are our services" and "here is your inbox".
 */
export function Noise() {
  return (
    <section className="relative border-b border-rule py-[var(--space-section)]">
      <Container>
        <Chapter n={c.n} label={c.label} headline={c.headline} lead={c.body} />

        <div className="mt-[var(--space-block)] grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
          {c.channels.map((ch, i) => (
            <Reveal key={ch.k} delay={i * 55} className="bg-surface">
              <div className="group relative h-full overflow-hidden p-7">
                <div
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-[var(--duration-base)] ease-[var(--ease-mech)] group-hover:scale-x-100"
                />
                <p className="font-mono text-[var(--text-label)] uppercase tracking-[0.18em] text-accent">{ch.k}</p>
                <p className="mt-3.5 text-[var(--text-small)] leading-relaxed text-muted">{ch.d}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <p className="mt-10 max-w-[62ch] border-l-2 border-accent pl-6 text-[length:var(--text-display-s)] leading-snug text-ink-2">
            {c.kicker}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
