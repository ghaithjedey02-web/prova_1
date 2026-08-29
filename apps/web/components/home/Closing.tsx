import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { cta } from '@/content/site';

export function Closing() {
  return (
    <section className="relative overflow-hidden py-[var(--space-section)]">
      <div aria-hidden className="sheet pointer-events-none absolute inset-0 rotate-180" />
      <Container wide className="relative">
        <Reveal>
          <p className="label">Il primo passo</p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="display mt-7 max-w-[16ch] text-[length:var(--text-display-l)]">
            Parliamo del vostro processo.
          </h2>
        </Reveal>
        <Reveal delay={150}>
          <p className="lead mt-9">
            Venticinque minuti, sei domande, nessuna presentazione. Alla fine sapremo
            entrambi se ha senso continuare — e se non ha senso, lo diremo.
          </p>
        </Reveal>
        <Reveal delay={220}>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button href={cta.primary.href} arrow>{cta.primary.label}</Button>
            <Button href="/metodo" variant="secondary">Come lavoriamo</Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
