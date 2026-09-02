import type { Metadata } from 'next';
import { Actions, Chip, Decision, Field, Frame, Mail } from '@/components/product/primitives';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { cta, soluzioni as s } from '@/content/site';

export const metadata: Metadata = {
  title: s.title,
  description:
    'Sette processi aziendali, una sola forma: preventivi, posta in arrivo, documenti tecnici, ordini e flussi, visibilità, integrazioni, presenza digitale. Ognuno con la sua interfaccia.',
  alternates: { canonical: '/soluzioni' },
};

/**
 * Solutions as the product, seven times.
 *
 * Each process is one row: the words on the left, and on the right the
 * frame that process actually produces — input, three read fields with their
 * state, the decision when there is one, the action. Same primitives as the
 * homepage, same demo company, declared as simulated.
 */
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
          <Reveal delay={160}><p className="lead mt-8 max-w-[64ch]">{s.lead}</p></Reveal>
        </Container>
      </section>

      <section>
        <ol className="stack-rules border-b border-rule">
          {s.items.map((item, i) => (
            <Reveal key={item.t} as="li" delay={40} className={i % 2 === 1 ? 'band' : ''}>
              <Container>
                <div className="grid gap-8 py-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-14 lg:py-16">
                  <div className="max-w-[52ch]">
                    <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-faint">{String(i + 1).padStart(2, '0')}</p>
                    <h2 className="headline mt-3 text-[length:var(--text-display-m)] text-ink">{item.t}</h2>
                    <p className="mt-3 text-[length:var(--text-body)] text-accent">{item.lead}</p>
                    <p className="mt-5 text-[length:var(--text-body)] leading-relaxed text-ink-2">{item.d}</p>
                    <p className="mt-5 border-t border-rule pt-4 text-[length:var(--text-small)] leading-relaxed text-muted">
                      <span className="mr-2 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-faint">Consegna</span>
                      {item.out}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <Frame title={item.frame.title} status={<Chip tone={item.frame.status.tone}>{item.frame.status.k}</Chip>} bodyClassName="p-3">
                      <Mail from={item.frame.input.from} subject={item.frame.input.subject} time={item.frame.input.time} active />
                      <div className="mt-2 px-1">
                        {item.frame.fields.map((f) => (
                          <Field key={f.label} label={f.label} value={f.value} source={f.source} state={f.state} />
                        ))}
                      </div>
                      {item.frame.decision && (
                        <div className="mt-3">
                          <Decision question={item.frame.decision} compact />
                        </div>
                      )}
                      <div className="mt-3 px-1">
                        <p className="mb-1 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-faint">{item.frame.decision ? 'Dopo il sì' : 'Azioni'}</p>
                        <Actions items={item.frame.actions} done={item.frame.decision ? 1 : item.frame.actions.length} />
                      </div>
                    </Frame>
                    <p className="mt-2 text-[length:var(--text-micro)] text-faint">{s.disclaimer}</p>
                  </div>
                </div>
              </Container>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="py-[var(--space-section)]">
        <Container>
          <div className="frame flex flex-col items-start gap-8 p-8 sm:p-12">
            <p className="max-w-[46ch] font-display text-[length:var(--text-display-s)] font-semibold leading-snug tracking-[-0.02em] text-ink">
              {s.note}
            </p>
            <Button href={cta.contact.href} size="lg" arrow>Portateci un processo</Button>
          </div>
        </Container>
      </section>
    </>
  );
}
