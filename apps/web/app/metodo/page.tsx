import type { Metadata } from 'next';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { cta, metodo as m } from '@/content/site';

export const metadata: Metadata = {
  title: m.title,
  description:
    'Osservare, mappare, misurare, progettare, validare, implementare, migliorare. Il metodo con cui DOLMIR porta un processo in produzione.',
  alternates: { canonical: '/metodo' },
};

export default function MetodoPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-rule">
        <div aria-hidden className="pointer-events-none absolute inset-0 sheet" />
        <Container className="relative py-[clamp(3rem,6.5vw,5.5rem)]">
          <Reveal><p className="chapter">{m.title}</p></Reveal>
          <Reveal delay={70}>
            <h1 className="display mt-8 max-w-[17ch] text-[length:var(--text-display-xl)]">{m.headline}</h1>
          </Reveal>
          <Reveal delay={110}>
            <div className="mt-9 h-px w-full max-w-[20rem] bg-gradient-to-r from-accent to-transparent" />
          </Reveal>
          <Reveal delay={160}><p className="lead mt-8 max-w-[60ch]">{m.lead}</p></Reveal>
        </Container>
      </section>

      {/* The seven phases as a vertical rail — a process, not a card grid. */}
      <section className="border-b border-rule py-[var(--space-section)]">
        <Container>
          <ol className="relative">
            <span aria-hidden className="absolute left-[0.3rem] top-2 bottom-2 hidden w-px bg-rule md:block" />
            {m.phases.map((p, i) => (
              <Reveal key={p.k} as="li" delay={i * 50}>
                <div className="relative grid gap-4 py-9 md:grid-cols-[auto_10rem_1fr_1fr] md:items-baseline md:gap-10 md:pl-0">
                  <span aria-hidden className="hidden size-[0.65rem] shrink-0 translate-y-2 bg-accent md:block" />
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-[var(--text-label)] tnum text-faint">{p.k}</span>
                    <h2 className="headline text-[length:var(--text-display-s)] text-ink">{p.t}</h2>
                  </div>
                  <p className="text-[var(--text-small)] leading-relaxed text-ink-2">{p.d}</p>
                  <p className="text-[var(--text-micro)] leading-relaxed text-muted">
                    <span className="label mr-2">Esito</span>
                    {p.out}
                  </p>
                </div>
                {i < m.phases.length - 1 && <span className="block h-px w-full bg-rule" />}
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* -------------------------------------------------------- engagement */}
      <section className="border-b border-rule py-[var(--space-section)]">
        <Container>
          <div className="grid gap-[var(--space-block)] lg:grid-cols-[1fr_1fr] lg:items-start">
            <div>
              <Reveal><p className="chapter">{m.engagement.label}</p></Reveal>
              <Reveal delay={70}>
                <h2 className="headline mt-7 max-w-[16ch] text-[length:var(--text-display-m)]">
                  {m.engagement.headline}
                </h2>
              </Reveal>
            </div>
            <Reveal delay={130}>
              <div className="border-t border-rule-strong pt-8">
                <p className="text-[var(--text-lead)] leading-relaxed text-ink-2">{m.engagement.body}</p>
                <p className="mt-6 text-[var(--text-small)] leading-relaxed text-muted">{m.engagement.note}</p>
                <div className="mt-10"><Button href={cta.primary.href} arrow>{cta.primary.label}</Button></div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ---------------------------------------------------------- handover */}
      <section className="py-[var(--space-section)]">
        <Container>
          <header className="max-w-[46ch]">
            <Reveal><p className="chapter">{m.handover.label}</p></Reveal>
            <Reveal delay={70}>
              <h2 className="headline mt-7 text-[length:var(--text-display-m)]">{m.handover.headline}</h2>
            </Reveal>
          </header>
          <ul className="mt-[var(--space-block)] grid gap-px border border-rule bg-rule md:grid-cols-3">
            {m.handover.items.map((item, i) => (
              <Reveal key={item.t} as="li" delay={i * 70} className="bg-surface">
                <div className="h-full p-8">
                  <h3 className="text-[var(--text-body)] font-medium text-ink">{item.t}</h3>
                  <p className="mt-3 text-[var(--text-small)] leading-relaxed text-muted">{item.d}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
