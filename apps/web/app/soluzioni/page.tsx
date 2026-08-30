import type { Metadata } from 'next';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { cta, soluzioni as s } from '@/content/site';

export const metadata: Metadata = {
  title: s.title,
  description:
    'Sette processi aziendali che oggi costano ore in una PMI industriale: presenza digitale, preventivi, ufficio AI, documenti, flussi, visibilità, integrazioni.',
  alternates: { canonical: '/soluzioni' },
};

export default function SoluzioniPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-rule">
                <Container className="relative py-[clamp(3rem,6.5vw,5.5rem)]">
          <Reveal><p className="chapter">{s.title}</p></Reveal>
          <Reveal delay={70}>
            <h1 className="display mt-8 max-w-[16ch] text-[length:var(--text-display-xl)]">{s.headline}</h1>
          </Reveal>
          <Reveal delay={110}>
            <div className="mt-9 h-px w-full max-w-[20rem] bg-gradient-to-r from-accent to-transparent" />
          </Reveal>
          <Reveal delay={160}><p className="lead mt-8 max-w-[62ch]">{s.lead}</p></Reveal>
        </Container>
      </section>

      <section>
        <ol className="stack-rules border-b border-rule">
          {s.items.map((item, i) => (
            <Reveal key={item.k} as="li" delay={i * 40}>
              <Container>
                <div className="group grid gap-6 py-12 lg:grid-cols-[5rem_1fr_1.15fr] lg:gap-10 lg:py-16">
                  <span className="font-mono text-[var(--text-label)] tnum text-faint transition-colors group-hover:text-accent">
                    {item.k}
                  </span>

                  <div>
                    <h2 className="headline text-[length:var(--text-display-s)] text-ink">{item.t}</h2>
                    <p className="mt-3 text-[var(--text-small)] leading-relaxed text-accent">{item.lead}</p>
                  </div>

                  <div>
                    <p className="text-[var(--text-body)] leading-relaxed text-ink-2">{item.d}</p>
                    <p className="mt-5 border-t border-rule pt-4 text-[var(--text-micro)] leading-relaxed text-muted">
                      <span className="label mr-2">Consegna</span>
                      {item.out}
                    </p>
                  </div>
                </div>
              </Container>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="py-[var(--space-section)]">
        <Container>
          <div className="plate flex flex-col items-start gap-8 p-10 sm:p-14">
            <p className="max-w-[46ch] font-display text-[length:var(--text-display-s)] font-semibold leading-snug tracking-[-0.02em] text-ink">
              {s.note}
            </p>
            <Button href={cta.primary.href} size="lg" arrow>{cta.primary.label}</Button>
          </div>
        </Container>
      </section>
    </>
  );
}
