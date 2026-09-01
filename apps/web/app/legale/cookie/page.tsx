import type { Metadata } from 'next';
import { LegalPage } from '@/components/site/LegalPage';

export const metadata: Metadata = {
  title: 'Cookie policy',
  robots: { index: false, follow: true },
  alternates: { canonical: '/legale/cookie' },
};

export default function Page() {
  return (
    <LegalPage
      title="Cookie policy"
      intro="Questo sito non usa cookie di profilazione, non integra pixel pubblicitari e non carica strumenti di analisi di terze parti."
    >
      <dl className="mt-12 max-w-[64ch] stack-rules border-y border-rule">
        {[
          ['Cookie tecnici', 'Nessuno strettamente necessario oltre a quelli eventualmente impostati dall’infrastruttura di hosting.'],
          ['Memoria locale', 'Non utilizziamo la memoria locale del browser per nessuna finalità.'],
          ['Terze parti', 'I caratteri tipografici sono serviti insieme al sito. Nessun servizio di analisi, nessun social plugin, nessuna pubblicità.'],
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
