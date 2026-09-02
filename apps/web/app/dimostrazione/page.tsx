import type { Metadata } from 'next';
import { rfqPreventivo } from '@dolmir/workflows';
import { WorkflowPlayer } from '@/components/demo/WorkflowPlayer';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { cta, demoCopy } from '@/content/site';

export const metadata: Metadata = {
  title: demoCopy.title,
  description:
    'Lo stesso motore che consegniamo ai clienti, eseguito nel browser su cinque casi di esempio — compreso quello in cui il sistema si rifiuta di proporre un prezzo.',
  alternates: { canonical: '/dimostrazione' },
};

export default function DemoPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-rule">
                <Container className="relative py-[clamp(3rem,6vw,5rem)]">
          <Reveal>
            <p className="chapter">{demoCopy.title}</p>
          </Reveal>
          <Reveal delay={70}>
            <h1 className="display mt-8 max-w-[20ch] text-[length:var(--text-display-xl)]">{demoCopy.headline}</h1>
          </Reveal>
          <Reveal delay={110}>
            <div className="mt-9 h-px w-full max-w-[20rem] bg-gradient-to-r from-accent to-transparent" />
          </Reveal>
          <Reveal delay={160}>
            <p className="lead mt-8 max-w-[62ch]">{demoCopy.lead}</p>
          </Reveal>
          <Reveal delay={210}>
            <p className="mt-8 inline-flex max-w-[52ch] items-start gap-3 rounded-[4px] border border-amber-line bg-amber-soft/60 px-4 py-3 text-[length:var(--text-micro)] leading-snug text-amber">
              <span aria-hidden>△</span>
              {demoCopy.disclaimer}
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="py-[clamp(2rem,4vw,3.5rem)]">
        <Container>
          <h2 className="sr-only">Esecuzione del processo su un caso di esempio</h2>
          <WorkflowPlayer workflow={rfqPreventivo} />
        </Container>
      </section>

      <section className="border-t border-rule py-[var(--space-section)]">
        <Container>
          <div className="grid gap-[var(--space-block)] lg:grid-cols-[1fr_1fr] lg:items-start">
            <div className="max-w-[54ch]">
              <p className="chapter">Nota tecnica</p>
              <h2 className="headline mt-7 text-[length:var(--text-display-m)]">{demoCopy.technical.headline}</h2>
              <p className="mt-7 text-[length:var(--text-body)] leading-relaxed text-ink-2">{demoCopy.technical.body}</p>
            </div>

            <div className="frame p-7 sm:p-8">
              <p className="label">Il passo successivo</p>
              <p className="mt-5 text-[length:var(--text-body)] leading-relaxed text-ink-2">
                Questa pagina gira su dati inventati. Il modo utile di valutarci è vederla girare su cinque
                richieste vere ricevute da voi nelle ultime due settimane — comprese quelle su cui sbaglia.
              </p>
              <div className="mt-8">
                <Button href={cta.primary.href} arrow>{cta.primary.label}</Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
