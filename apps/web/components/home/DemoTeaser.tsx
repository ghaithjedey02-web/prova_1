import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHead } from '@/components/ui/SectionHead';
import { rfqPreventivo } from '@dolmir/workflows';

/**
 * Entry to the live demonstration.
 * Deliberately shows the awkward cases in the preview list — a demo where
 * everything succeeds is not credible to someone who has watched software fail.
 */
export function DemoTeaser() {
  return (
    <section className="border-b border-rule bg-surface py-[var(--space-section)]">
      <Container wide>
        <div className="grid gap-[var(--space-block)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-end">
          <SectionHead num="04" label="Dimostrazione" headline="Provatelo su cinque email vere.">
            <p className="text-[var(--text-body)] leading-relaxed text-ink-2">
              La stessa logica che gira nei sistemi che consegniamo, con dati di esempio.
              Compreso il caso in cui il sistema si rifiuta di proporre un prezzo.
            </p>
            <div className="mt-8">
              <Button href="/dimostrazione" arrow>Apri la dimostrazione</Button>
            </div>
          </SectionHead>

          <Reveal delay={120}>
            <ul className="divide-y divide-rule border border-rule bg-ground">
              {rfqPreventivo.samples.map((s, i) => (
                <li key={s.id} className="flex items-baseline gap-4 px-5 py-4">
                  <span className="label tnum shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  <span className="min-w-0">
                    <span className="block truncate text-[var(--text-small)] text-ink">{s.label}</span>
                    <span className="mt-0.5 block text-[var(--text-micro)] text-muted">{s.note}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
