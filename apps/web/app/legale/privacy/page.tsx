import type { Metadata } from 'next';
import { LegalPage } from '@/components/site/LegalPage';

export const metadata: Metadata = {
  title: 'Informativa privacy',
  robots: { index: false, follow: true },
  alternates: { canonical: '/legale/privacy' },
};

export default function Page() {
  return (
    <LegalPage
      title="Informativa privacy"
      intro="Informativa ai sensi degli articoli 13 e 14 del Regolamento (UE) 2016/679, relativa ai dati raccolti tramite il modulo di contatto e la navigazione del sito."
    >
      <dl className="mt-12 max-w-[64ch] stack-rules border-y border-rule">
        {[
          ['Dati trattati', 'Azienda, nome, email, telefono facoltativo e il testo che scrivete nel modulo di contatto.'],
          ['Finalità', 'Esclusivamente rispondere alla richiesta. Nessuna newsletter, nessuna profilazione, nessuna cessione a terzi.'],
          ['Base giuridica', 'Consenso prestato al momento dell’invio del modulo.'],
          ['Conservazione', 'Per il tempo necessario a gestire la conversazione e gli eventuali obblighi contrattuali che ne derivano.'],
          ['Diritti', 'Accesso, rettifica, cancellazione, limitazione, portabilità e opposizione, scrivendo all’indirizzo indicato in fondo.'],
        ].map(([k, v]) => (
          <div key={k} className="grid gap-2 py-6 sm:grid-cols-[12rem_1fr] sm:gap-8">
            <dt className="text-[length:var(--text-small)] font-medium text-ink">{k}</dt>
            <dd className="text-[length:var(--text-small)] leading-relaxed text-muted">{v}</dd>
          </div>
        ))}
      </dl>
    </LegalPage>
  );
}
