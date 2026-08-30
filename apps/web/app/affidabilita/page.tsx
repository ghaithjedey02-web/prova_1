import type { Metadata } from 'next';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { affidabilita as a, cta } from '@/content/site';

export const metadata: Metadata = {
  title: a.title,
  description:
    'Cosa succede quando il sistema non sa: la catena non so → ferma → persona → decide, i limiti dichiarati prima di firmare e i principi sui dati.',
  alternates: { canonical: '/affidabilita' },
};

export default function AffidabilitaPage() {
  return (
    <>
      {/* ------------------------------------------------------------ hero */}
      <section className="relative overflow-hidden border-b border-rule bg-void">
                <Container className="relative py-[clamp(3rem,6.5vw,5.5rem)]">
          <Reveal><p className="chapter">{a.title}</p></Reveal>
          <Reveal delay={70}>
            <h1 className="display mt-8 max-w-[15ch] text-[length:var(--text-display-xl)]">{a.headline}</h1>
          </Reveal>
          <Reveal delay={110}>
            <div className="mt-9 h-px w-full max-w-[20rem] bg-gradient-to-r from-accent to-transparent" />
          </Reveal>
          <Reveal delay={160}><p className="lead mt-8 max-w-[60ch]">{a.lead}</p></Reveal>
        </Container>
      </section>

      {/* ----------------------------------------------------------- chain */}
      <section className="border-b border-rule py-[var(--space-section)]">
        <Container>
          <ol className="grid gap-px border border-rule bg-rule/70 lg:grid-cols-4">
            {a.chain.map((step, i) => (
              <Reveal key={step.k} as="li" delay={i * 90} className="bg-surface/92 backdrop-blur-md">
                <div className="relative flex h-full flex-col p-8">
                  {/* the connector: on wide screens the chain reads left to right */}
                  <span
                    aria-hidden
                    className="absolute right-0 top-1/2 hidden h-px w-8 translate-x-1/2 bg-amber lg:block"
                    style={{ opacity: i === a.chain.length - 1 ? 0 : 1 }}
                  />
                  <p className="font-mono text-[length:var(--text-display-s)] font-medium tracking-[0.02em] text-amber">
                    {step.k}
                  </p>
                  <h2 className="mt-6 text-[var(--text-body)] font-medium text-ink">{step.t}</h2>
                  <p className="mt-3 text-[var(--text-small)] leading-relaxed text-muted">{step.d}</p>
                  <span className="mt-auto pt-8 font-mono text-[var(--text-label)] tnum text-faint">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={160}>
            <div className="mt-[var(--space-block)] grid gap-[var(--space-block)] lg:grid-cols-[1fr_1fr] lg:items-start">
              <h2 className="headline max-w-[18ch] text-[length:var(--text-display-m)]">{a.principle.headline}</h2>
              <p className="text-[var(--text-lead)] leading-relaxed text-ink-2">{a.principle.body}</p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ------------------------------------------------------ what we don't */}
      <section className="border-b border-rule py-[var(--space-section)]">
        <Container>
          <header className="max-w-[52ch]">
            <Reveal><p className="chapter">{a.guarantees.label}</p></Reveal>
            <Reveal delay={70}>
              <h2 className="headline mt-7 text-[length:var(--text-display-m)]">{a.guarantees.headline}</h2>
            </Reveal>
            <Reveal delay={140}><p className="lead mt-7">{a.guarantees.body}</p></Reveal>
          </header>

          <ul className="mt-[var(--space-block)] grid gap-px border border-rule bg-rule/70 md:grid-cols-2">
            {a.guarantees.items.map((item, i) => (
              <Reveal key={item.t} as="li" delay={i * 45} className="bg-surface/92 backdrop-blur-md">
                <div className="flex h-full gap-4 p-7">
                  <span aria-hidden className="mt-1 font-mono text-[var(--text-body)] leading-none text-bad">×</span>
                  <div>
                    <h3 className="text-[var(--text-body)] font-medium text-ink">{item.t}</h3>
                    <p className="mt-2.5 text-[var(--text-small)] leading-relaxed text-muted">{item.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* -------------------------------------------------------- data terms */}
      <section className="py-[var(--space-section)]">
        <Container>
          <div className="grid gap-[var(--space-block)] lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <header>
              <Reveal><p className="chapter">{a.security.label}</p></Reveal>
              <Reveal delay={70}>
                <h2 className="headline mt-7 text-[length:var(--text-display-m)]">{a.security.headline}</h2>
              </Reveal>
              <Reveal delay={140}><p className="lead mt-7">{a.security.body}</p></Reveal>
              <Reveal delay={210}>
                <div className="mt-10"><Button href={cta.primary.href} arrow>{cta.primary.label}</Button></div>
              </Reveal>
            </header>

            <ol className="stack-rules border-y border-rule">
              {a.security.items.map((item, i) => (
                <Reveal key={item.t} as="li" delay={i * 45}>
                  <div className="grid gap-2 py-6 sm:grid-cols-[13rem_1fr] sm:gap-8">
                    <h3 className="text-[var(--text-small)] font-medium text-ink">{item.t}</h3>
                    <p className="text-[var(--text-small)] leading-relaxed text-muted">{item.d}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </Container>
      </section>
    </>
  );
}
