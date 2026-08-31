import { Chapter } from '@/components/ui/Chapter';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { problema as c } from '@/content/site';

/**
 * Chapter 01 — the problem, in words a company owner uses.
 *
 * Deliberately the quietest section on the page: after the cinematic opening,
 * the visitor needs one editorial breath that says exactly what is wrong and
 * exactly what DOLMIR is, before the site goes back inside the technology.
 * No canvas, no telemetry — the eight fragments, the turn, and the two
 * "we do not replace" statements that close the objection every first
 * conversation opens with.
 */
export function Problema() {
  return (
    <section
      className="relative py-[var(--space-section)]"
      aria-labelledby="problema-heading"
      data-inspect="Problema · il lavoro frammentato"
      data-spine="0"
    >
      <Container>
        <Chapter n={c.n} label={c.label} headline={c.headline} lead={c.body} />

        {/* The fragments: where the work actually lives. Offset like things
            left where they happened to land, because that is the point. */}
        <Reveal delay={120}>
          <ul className="mt-[var(--space-block)] flex flex-wrap items-start gap-x-3 gap-y-4">
            {c.fragments.map((f, i) => (
              <li
                key={f}
                className="border border-rule bg-surface/60 px-4 py-2.5 font-mono text-[0.8125rem] text-muted sm:px-5 sm:py-3"
                style={{ transform: `translateY(${(i % 3) * 8 - 8}px) rotate(${((i % 5) - 2) * 0.6}deg)` }}
              >
                {f}
              </li>
            ))}
            <li className="flex w-full items-center gap-3 pt-5 text-[var(--text-small)] text-muted">
              <span aria-hidden className="block h-px w-8 bg-rule-bright" />
              e in mezzo, una persona che ricopia
            </li>
          </ul>
        </Reveal>

        {/* The turn. */}
        <Reveal delay={160}>
          <p className="chapter mt-20">
            <span className="text-accent">{c.turn}</span>
          </p>
        </Reveal>
        <Reveal delay={200}>
          <p className="mt-7 max-w-[26ch] font-display text-[length:var(--text-display-m)] font-semibold leading-[1.12] text-ink">
            {c.what}
          </p>
        </Reveal>

        {/* The two objections, closed before they are raised. */}
        <div className="mt-12 grid gap-px border border-rule bg-rule/70 sm:grid-cols-2">
          {c.nots.map((n, i) => (
            <Reveal key={n.t} delay={240 + i * 70} className="bg-surface/80">
              <div className="h-full p-6 sm:p-8">
                <p className="text-[var(--text-body)] font-medium text-ink">{n.t}</p>
                <p className="mt-3 text-[var(--text-small)] leading-relaxed text-muted">{n.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
