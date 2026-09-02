import { Chip, type Tone } from '@/components/product/primitives';
import { Chapter } from '@/components/ui/Chapter';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { controllo as c, fiducia } from '@/content/site';

/**
 * Chapter 07 — control, as part of the product.
 *
 * Five states the interface shows at all times, each with the line of data
 * it would appear on; the engine's own refusal constant set as a specimen;
 * and the six guarantees that are architecture rather than promises. The
 * only chapter allowed to be mostly amber, because amber here means the
 * system stopped for a person.
 */
export function Control() {
  return (
    <section className="band relative py-[var(--space-section)]" aria-labelledby="controllo-heading">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-1/3 -z-10 h-[50vh] bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgb(227_165_81/0.08)_0%,transparent_70%)]" />
      <Container>
        <Chapter n={c.n} label={c.label} headline={c.headline} lead={c.body} id="controllo-heading" />

        <ol className="mt-[var(--space-block)] grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {c.states.map((st, i) => (
            <Reveal key={st.k} as="li" delay={i * 70} className="flex">
              <div className="frame flex w-full flex-col p-4">
                <Chip tone={st.tone as Tone}>{st.k}</Chip>
                <p className="mt-3 text-[0.9375rem] leading-snug text-ink">{st.t}</p>
                <p className="mt-auto pt-4 font-mono text-[0.6875rem] leading-relaxed text-faint">{st.ex}</p>
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={140}>
          <figure className="mt-10 overflow-hidden rounded-[var(--radius-frame)] border border-amber-line bg-amber-soft/40">
            <div className="flex items-center gap-3 border-b border-amber-line px-5 py-2.5">
              <span aria-hidden className="block size-1.5 bg-amber pulse" />
              <figcaption className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-amber">packages/rfq-engine/src/stages/draft.ts</figcaption>
            </div>
            <div className="px-5 py-7 sm:px-8 sm:py-9">
              <code className="block font-mono text-[clamp(1rem,2.6vw,1.6rem)] leading-tight tracking-[-0.01em] text-amber">
                priceBasis: <span className="text-ink">&apos;{c.quote}&apos;</span>
              </code>
              <p className="mt-5 max-w-[58ch] text-[length:var(--text-small)] leading-relaxed text-ink-2">{c.quoteNote}</p>
            </div>
          </figure>
        </Reveal>

        <div className="mt-12">
          <Reveal><p className="label text-ink-2">{fiducia.label}</p></Reveal>
          <div className="mt-6 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {fiducia.items.map((item, i) => (
              <Reveal key={item.t} delay={60 + i * 50}>
                <div className="flex gap-4">
                  <span aria-hidden className="mt-[0.55rem] block h-px w-6 flex-none bg-accent" />
                  <div>
                    <p className="text-[length:var(--text-body)] font-medium text-ink">{item.t}</p>
                    <p className="mt-1.5 max-w-[38ch] text-[length:var(--text-small)] leading-snug text-ink-2">{item.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
