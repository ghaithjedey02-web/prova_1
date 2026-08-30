import { Forge } from '@/components/forge/Forge';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { cta, hero } from '@/content/site';

/**
 * The opening frame.
 *
 * The object on the right is not decoration and not a stock render: it is
 * FL-2280, the flange that arrives in the first sample email of the live
 * demonstration further down the site. A visitor who reaches /dimostrazione
 * meets the same part again, this time as an incoming request. The hero is the
 * first frame of the story, not a picture placed above it.
 *
 * The readout runs as a strip along the bottom rather than floating over the
 * part: an instrument panel under the specimen, which is also what stops the
 * viewport from ending in dead space.
 */
export function Hero() {
  return (
    <section className="relative grain overflow-hidden border-b border-rule">
      <div aria-hidden className="pointer-events-none absolute inset-0 sheet" />
      <div aria-hidden className="pointer-events-none absolute inset-0 pool" />

      <Container className="relative flex min-h-[calc(100svh-var(--nav-h))] flex-col">
        <div className="grid flex-1 items-center gap-x-12 gap-y-8 pt-[clamp(2.5rem,6vh,4.5rem)] pb-[clamp(2rem,5vh,3.5rem)] lg:grid-cols-[1.12fr_0.88fr]">
          {/* ---------------------------------------------------------- copy */}
          <div className="relative z-10">
            <Reveal>
              <p className="label">{hero.eyebrow}</p>
            </Reveal>

            <h1 className="display mt-6 text-[length:var(--text-hero)]">
              <Reveal delay={60}>
                <span className="block text-ink">{hero.line1}</span>
              </Reveal>
              <Reveal delay={130}>
                <span className="block text-muted">{hero.line2}</span>
              </Reveal>
              <Reveal delay={200}>
                <span className="block text-ink">{hero.line3}</span>
              </Reveal>
            </h1>

            <Reveal delay={280}>
              <div className="mt-8 h-px w-full max-w-[22rem] bg-gradient-to-r from-accent to-transparent" />
            </Reveal>

            <Reveal delay={330}>
              <p className="lead mt-7 max-w-[50ch]">{hero.lead}</p>
            </Reveal>

            <Reveal delay={410}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Button href={cta.primary.href} size="lg" arrow>
                  {cta.primary.label}
                </Button>
                <Button href={cta.secondary.href} variant="secondary" size="lg">
                  {cta.secondary.label}
                </Button>
              </div>
            </Reveal>
          </div>

          {/* ------------------------------------------------------- the part */}
          <div className="relative">
            <Forge className="mx-auto aspect-square w-full max-w-[17rem] sm:max-w-[24rem] lg:max-w-[30rem]" />
          </div>
        </div>

        {/* ------------------------------------------------------- instrument */}
        <Reveal delay={500}>
          <dl className="grid grid-cols-2 gap-px border-t border-rule bg-rule sm:grid-cols-4">
            {hero.specimen.lines.map(([k, v]) => (
              <div key={k} className="bg-ground px-1 py-5 sm:px-0">
                <dt className="font-mono text-[var(--text-label)] uppercase tracking-[0.16em] text-muted">{k}</dt>
                <dd className="mt-2 font-mono text-[var(--text-micro)] leading-snug text-ink-2">{v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <div className="flex items-center justify-between gap-4 border-t border-rule py-4">
          <p className="label text-faint">{hero.specimen.label}</p>
          <p className="label hidden items-center gap-3 text-faint sm:flex">
            {hero.scroll}
            <span aria-hidden className="block h-px w-10 bg-gradient-to-r from-rule-bright to-transparent" />
          </p>
        </div>
      </Container>
    </section>
  );
}
