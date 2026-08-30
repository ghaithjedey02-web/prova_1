import { Chapter } from '@/components/ui/Chapter';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { chapters } from '@/content/site';

const c = chapters.decision;

const tones = {
  good: { dot: 'bg-good', text: 'text-good', border: 'border-good/35' },
  amber: { dot: 'bg-amber', text: 'text-amber', border: 'border-amber-line' },
  bad: { dot: 'bg-bad', text: 'text-bad', border: 'border-bad/35' },
} as const;

/**
 * Chapter 05. The four verdicts, and the line of source that produces the
 * important one. Showing the literal constant is the point: this behaviour is
 * in the code, not in the copy.
 */
export function Decision() {
  return (
    <section className="relative border-b border-rule py-[var(--space-section)]">
      <Container>
        <Chapter n={c.n} label={c.label} headline={c.headline} lead={c.body} />

        <div className="mt-[var(--space-block)] grid gap-px border border-rule bg-rule sm:grid-cols-2">
          {c.verdicts.map((v, i) => {
            const t = tones[v.tone as keyof typeof tones];
            return (
              <Reveal key={v.code} delay={i * 60} className="bg-surface">
                <div className="flex h-full flex-col p-8">
                  <div className="flex items-center gap-3">
                    <span aria-hidden className={`block size-1.5 ${t.dot}`} />
                    <span className={`font-mono text-[var(--text-label)] uppercase tracking-[0.2em] ${t.text}`}>
                      {v.code}
                    </span>
                  </div>
                  <h3 className="subhead mt-5 text-[length:var(--text-display-s)] text-ink">{v.t}</h3>
                  <p className="mt-3.5 text-[var(--text-small)] leading-relaxed text-muted">{v.d}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* ------------------------------------------------- the actual line */}
        <Reveal delay={140}>
          <figure className="mt-[var(--space-block)] border border-amber-line bg-amber-soft/60">
            <div className="flex items-center gap-3 border-b border-amber-line px-6 py-3">
              <span aria-hidden className="block size-1.5 bg-amber pulse" />
              <figcaption className="font-mono text-[var(--text-label)] uppercase tracking-[0.2em] text-amber">
                packages/rfq-engine/src/stages/draft.ts
              </figcaption>
            </div>
            <div className="px-6 py-8 sm:px-10 sm:py-10">
              <code className="block font-mono text-[clamp(1.05rem,3.1vw,1.9rem)] leading-tight tracking-[-0.01em] text-amber">
                priceBasis: <span className="text-ink">&apos;{c.quote}&apos;</span>
              </code>
              <p className="mt-6 max-w-[58ch] text-[var(--text-small)] leading-relaxed text-ink-2">{c.quoteNote}</p>
            </div>
          </figure>
        </Reveal>
      </Container>
    </section>
  );
}
