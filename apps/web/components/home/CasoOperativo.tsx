import { Chapter } from '@/components/ui/Chapter';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { caso as c } from '@/content/site';

/**
 * The before/after — the moment a visitor recognises their own Tuesday.
 *
 * Left: today's version of the demo order, seven manual hops with the friction
 * written next to each one and the leak counted underneath. Right: the same
 * order through DOLMIR, where the person appears exactly once — at the
 * decision, in amber, because that is what amber means on this site.
 *
 * Every number is illustrative and says so: the argument this section makes
 * is the SHAPE of the process, not a ROI figure we have not measured. The
 * link at the bottom goes to the real engine for whoever wants proof instead
 * of a diagram.
 */
export function CasoOperativo() {
  return (
    <section className="relative py-[var(--space-section)]" aria-labelledby="caso-heading">
      <Container>
        <Chapter n={c.n} label={c.label} headline={c.headline} lead={c.body} id="caso-heading" />

        <div className="mt-[var(--space-block)] grid gap-6 lg:grid-cols-2 lg:gap-8">
          {/* ------------------------------------------------------- today */}
          <Reveal delay={100}>
            <div className="flex h-full flex-col border border-rule-strong bg-surface/70">
              <p className="label border-b border-rule px-5 py-3.5 text-muted">{c.primaTitle}</p>
              <ol className="flex-1 px-5 py-5">
                {c.primaSteps.map((s, i) => (
                  <li key={s.t} className="flex gap-4 py-2.5">
                    <span className="tnum mt-0.5 font-mono text-[length:var(--text-label)] text-faint">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="min-w-0 border-l border-rule pl-4">
                      <p className="text-[length:var(--text-small)] leading-snug text-ink-2">{s.t}</p>
                      <p className="mt-0.5 text-[length:var(--text-micro)] text-muted">{s.note}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <dl className="grid grid-cols-2 gap-px border-t border-rule bg-rule sm:grid-cols-5">
                {c.primaStats.map(([k, v]) => (
                  <div key={k} className="bg-surface px-3 py-3.5 text-center sm:px-2">
                    <dt className="font-mono text-[length:var(--text-label)] tracking-[0.08em] text-muted">{k}</dt>
                    <dd className="tnum mt-1 font-display text-[1.15rem] font-semibold text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

          {/* -------------------------------------------------- with DOLMIR */}
          <Reveal delay={180}>
            <div className="flex h-full flex-col border border-accent-line bg-surface/70">
              <p className="label border-b border-rule px-5 py-3.5 text-accent">{c.dopoTitle}</p>
              <ol className="flex-1 px-5 py-5">
                {c.dopoSteps.map((s, i) => {
                  const tone = s.amber || s.person ? 'text-amber' : 'text-accent';
                  return (
                    <li key={s.t} className="flex gap-4 py-2.5">
                      <span
                        aria-hidden
                        className={`mt-[0.45rem] block size-1.5 flex-none ${s.amber || s.person ? 'bg-amber' : 'bg-accent'}`}
                      />
                      <div className={`min-w-0 border-l pl-4 ${s.amber || s.person ? 'border-amber-line' : 'border-accent-line'}`}>
                        <p className={`text-[length:var(--text-small)] leading-snug ${s.person ? 'font-medium text-ink' : 'text-ink-2'}`}>
                          {s.t}
                        </p>
                        {s.person && (
                          <p className={`mt-0.5 font-mono text-[length:var(--text-label)] tracking-[0.1em] ${tone}`}>
                            L’UNICO PASSAGGIO UMANO
                          </p>
                        )}
                        {i === 3 && !s.person && (
                          <p className="mt-0.5 font-mono text-[length:var(--text-label)] tracking-[0.1em] text-amber">
                            CONFLITTO RILEVATO
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
              <p className="border-t border-rule px-5 py-4 text-[length:var(--text-small)] leading-relaxed text-ink-2">
                {c.dopoNote}
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={240}>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="inline-flex max-w-[62ch] items-start gap-3 border border-amber-line bg-amber-soft/60 px-4 py-3 text-[length:var(--text-micro)] leading-snug text-amber">
              <span aria-hidden>△</span>
              {c.disclaimer}
            </p>
            <a
              href={c.cta.href}
              className="inline-block whitespace-nowrap border border-border-ui px-4 py-2.5 font-mono text-[length:var(--text-label)] tracking-[0.12em] text-ink transition-colors hover:border-accent hover:text-accent"
            >
              {c.cta.t}
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
