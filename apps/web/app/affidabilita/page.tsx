import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { security } from '@/content/site';

export const metadata: Metadata = {
  title: 'Dati e sicurezza',
  description:
    'Come DOLMIR tratta i dati dei clienti: minimizzazione, isolamento, fornitori dichiarati, supervisione umana. Principi, non certificazioni che non possediamo.',
  alternates: { canonical: '/affidabilita' },
};

export default function AffidabilitaPage() {
  return (
    <section className="py-[clamp(3.5rem,8vw,6.5rem)]">
      <Container wide>
        <Reveal><p className="label">{security.label}</p></Reveal>
        <Reveal delay={80}>
          <h1 className="display mt-7 max-w-[18ch] text-[length:var(--text-display-l)]">{security.headline}</h1>
        </Reveal>
        <Reveal delay={150}><p className="lead mt-10">{security.body}</p></Reveal>

        <ul className="mt-[var(--space-block)] grid gap-x-10 gap-y-9 md:grid-cols-2 lg:grid-cols-3">
          {security.items.map((i, idx) => (
            <Reveal as="li" key={i.t} delay={(idx % 3) * 70} className="border-t border-rule-strong pt-5">
              <h2 className="text-[var(--text-body)] font-medium text-ink">{i.t}</h2>
              <p className="mt-2.5 text-[var(--text-small)] leading-relaxed text-muted">{i.d}</p>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={200}>
          <p className="mt-[var(--space-block)] max-w-[64ch] border-l-2 border-amber pl-5 text-[var(--text-small)] leading-relaxed text-muted">
            DOLMIR non dichiara certificazioni ISO, SOC 2 o equivalenti perché non ne
            possiede. Se una vostra procedura di fornitura le richiede, ditecelo subito:
            è un’informazione utile a entrambi prima di investire tempo in una trattativa.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
