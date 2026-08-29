import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { WorkflowPlayer } from '@/components/demo/WorkflowPlayer';
import { rfqPreventivo } from '@dolmir/workflows';
import { demoCopy } from '@/content/site';

export const metadata: Metadata = {
  title: 'Dimostrazione',
  description:
    'Cinque email arrivate in una mattina, elaborate dallo stesso motore che consegniamo ai clienti. Con dati di esempio.',
  alternates: { canonical: '/dimostrazione' },
};

export default function DemoPage() {
  return (
    <>
      <section className="border-b border-rule">
        <Container wide className="py-[clamp(3rem,7vw,5.5rem)]">
          <Reveal><p className="label">{demoCopy.title}</p></Reveal>
          <Reveal delay={70}>
            <h1 className="display mt-7 max-w-[18ch] text-[length:var(--text-display-l)]">{demoCopy.headline}</h1>
          </Reveal>
          <Reveal delay={140}><p className="lead mt-9">{demoCopy.lead}</p></Reveal>
          <Reveal delay={200}>
            <p className="mt-8 inline-flex items-center gap-2.5 border border-amber/40 bg-amber-soft px-4 py-2.5 text-[var(--text-micro)] text-amber">
              <span aria-hidden>△</span>
              {demoCopy.disclaimer}
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="py-[clamp(2.5rem,5vw,4rem)]">
        <Container wide>
          <h2 className="sr-only">Esecuzione del processo su un’email di esempio</h2>
          <WorkflowPlayer workflow={rfqPreventivo} />
        </Container>
      </section>

      <section className="border-t border-rule py-[var(--space-section)]">
        <Container wide>
          <div className="max-w-[62ch]">
            <p className="label">Nota tecnica</p>
            <h2 className="headline mt-5 text-[length:var(--text-display-s)]">
              Questo non è un video, ed è lo stesso codice.
            </h2>
            <p className="mt-5 text-[var(--text-body)] leading-relaxed text-ink-2">
              Classificazione, estrazione, soglie di confidenza, verifica di fattibilità,
              ricerca nello storico e generazione della bozza vengono eseguite qui nel
              browser dallo stesso motore che installiamo presso i clienti.
            </p>
            <p className="mt-4 text-[var(--text-small)] leading-relaxed text-muted">
              La cadenza dei passaggi è rallentata apposta perché sia leggibile: il
              motore completa l’elaborazione in millisecondi. In produzione l’estrazione
              usa un modello linguistico; qui gira una versione deterministica, così la
              dimostrazione funziona anche senza rete e senza costi.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
