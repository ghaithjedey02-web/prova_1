import { Chapter } from '@/components/ui/Chapter';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { presence as p } from '@/content/site';

/**
 * Chapter 08. The asymmetry between what a shop is and what it publishes.
 *
 * The layout carries the argument on its own: the left panel is dense and lit,
 * the right is mostly empty with three grey lines in it. A reader who only
 * looks at the shapes has already understood the section.
 */
export function Presence() {
  return (
    <section className="relative overflow-hidden border-b border-rule py-[var(--space-section)]">
      <Container>
        <Chapter n={p.n} label={p.label} headline={p.headline} lead={p.body} />

        <div className="mt-[var(--space-block)] grid gap-px border border-rule bg-rule lg:grid-cols-2">
          {/* ------------------------------------------------------- reality */}
          <Reveal className="bg-surface">
            <div className="relative h-full p-8 sm:p-10">
              <div aria-hidden className="absolute inset-y-0 left-0 w-px bg-accent" />
              <p className="label text-accent">{p.real.label}</p>
              <ul className="mt-8 flex flex-col gap-5">
                {p.real.items.map((i) => (
                  <li key={i} className="flex gap-4 text-[var(--text-body)] leading-snug text-ink">
                    <span aria-hidden className="mt-2.5 block size-1 shrink-0 bg-accent" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* --------------------------------------------------------- online */}
          <Reveal delay={120} className="bg-void">
            <div className="relative flex h-full flex-col p-8 sm:p-10">
              <p className="label">{p.shown.label}</p>
              <ul className="mt-8 flex flex-col gap-5">
                {p.shown.items.map((i, idx) => (
                  <li
                    key={i}
                    className="flex gap-4 text-[var(--text-body)] leading-snug text-faint"
                    style={{ opacity: 1 - idx * 0.13 }}
                  >
                    <span aria-hidden className="mt-2.5 block size-1 shrink-0 bg-rule-strong" />
                    {i}
                  </li>
                ))}
              </ul>
              <div aria-hidden className="mt-10 flex flex-1 flex-col justify-end gap-3 pt-10">
                <span className="block h-px w-2/3 bg-rule" />
                <span className="block h-px w-1/2 bg-rule" />
                <span className="block h-px w-1/3 bg-rule" />
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={160}>
          <p className="mt-10 max-w-[68ch] text-[length:var(--text-display-s)] leading-snug text-ink-2">
            {p.kicker}
          </p>
        </Reveal>

        {/* ---------------------------------------------------- what we build */}
        <div className="mt-[var(--space-section)] grid gap-[var(--space-block)] lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <Chapter label={p.build.label} headline={p.build.headline} lead={p.build.body} />

          <ol className="stack-rules border-y border-rule lg:mt-4">
            {p.build.items.map((item, i) => (
              <Reveal key={item.t} as="li" delay={i * 60}>
                <div className="grid gap-2 py-7 sm:grid-cols-[1fr_1.25fr] sm:gap-8">
                  <h3 className="text-[var(--text-body)] font-medium text-ink">{item.t}</h3>
                  <p className="text-[var(--text-small)] leading-relaxed text-muted">{item.d}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
