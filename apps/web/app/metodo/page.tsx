import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { metodo } from '@/content/site';

export const metadata: Metadata = {
  title: 'Metodo',
  description:
    'Come lavoriamo: capire, mappare, misurare, progettare, validare, implementare, ottimizzare. Si comincia da un Audit di Processo a prezzo fisso.',
  alternates: { canonical: '/metodo' },
};

export default function MetodoPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-rule">
        <div aria-hidden className="sheet pointer-events-none absolute inset-0" />
        <Container wide className="relative py-[clamp(3.5rem,8vw,7rem)]">
          <Reveal><p className="label">Metodo</p></Reveal>
          <Reveal delay={80}>
            <h1 className="display mt-7 max-w-[20ch] text-[length:var(--text-display-l)]">{metodo.headline}</h1>
          </Reveal>
          <Reveal delay={150}><p className="lead mt-10">{metodo.lead}</p></Reveal>
        </Container>
      </section>

      <section className="border-b border-rule py-[var(--space-section)]">
        <Container wide>
          <ol className="grid gap-px bg-rule md:grid-cols-2 lg:grid-cols-3">
            {metodo.phases.map((p, i) => (
              <Reveal as="li" key={p.k} delay={(i % 3) * 70} className="flex flex-col bg-surface p-8">
                <p className="label tnum text-accent">{p.k}</p>
                <h2 className="mt-4 font-display text-[length:var(--text-display-s)] leading-tight text-ink">{p.t}</h2>
                <p className="mt-3.5 flex-1 text-[var(--text-small)] leading-relaxed text-muted">{p.d}</p>
                <p className="mt-5 border-t border-rule pt-4 text-[var(--text-micro)] text-ink-2">
                  <span className="label mr-2">Esito</span>{p.out}
                </p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      <section className="py-[var(--space-section)]">
        <Container wide>
          <div className="grid gap-[var(--space-block)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
            <div>
              <Reveal><p className="label">{metodo.engagement.label}</p></Reveal>
              <Reveal delay={70}>
                <h2 className="headline mt-6 text-[length:var(--text-display-m)]">{metodo.engagement.headline}</h2>
              </Reveal>
            </div>
            <Reveal delay={130}>
              <div className="border-t border-rule-strong pt-7">
                <p className="text-[var(--text-body)] leading-relaxed text-ink-2">{metodo.engagement.body}</p>
                <p className="mt-5 text-[var(--text-small)] leading-relaxed text-muted">{metodo.engagement.note}</p>
                <div className="mt-9">
                  <Button href="/contatto" arrow>Mostrateci un processo</Button>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
