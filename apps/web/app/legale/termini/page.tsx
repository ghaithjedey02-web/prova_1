import type { Metadata } from 'next';
import { LegalPage } from '@/components/site/LegalPage';

export const metadata: Metadata = {
  title: 'Termini di utilizzo',
  robots: { index: false, follow: true },
  alternates: { canonical: '/legale/termini' },
};

export default function Page() {
  return (
    <LegalPage
      title="Termini di utilizzo"
      intro="Condizioni d’uso del sito e natura dei contenuti pubblicati. Le condizioni contrattuali di un incarico sono un documento separato, concordato prima dell’inizio del lavoro."
    >
      <dl className="mt-12 max-w-[64ch] stack-rules border-y border-rule">
        {[
          ['Natura dei contenuti', 'Le pagine descrivono un metodo di lavoro. Non costituiscono offerta contrattuale né consulenza tecnica o legale.'],
          ['Dimostrazione', 'La pagina Dimostrazione esegue software reale su dati inventati. Aziende, documenti e prezzi non sono reali e sono etichettati come tali.'],
          ['Assenza di referenze', 'Non pubblichiamo loghi di clienti, testimonianze o casi studio. Se un giorno compariranno, saranno verificabili.'],
          ['Proprietà intellettuale', 'Testi, codice e materiali grafici del sito appartengono a DOLMIR salvo dove diversamente indicato.'],
        ].map(([k, v]) => (
          <div key={k} className="grid gap-2 py-6 sm:grid-cols-[12rem_1fr] sm:gap-8">
            <dt className="text-[var(--text-small)] font-medium text-ink">{k}</dt>
            <dd className="text-[var(--text-small)] leading-relaxed text-muted">{v}</dd>
          </div>
        ))}
      </dl>
    </LegalPage>
  );
}
