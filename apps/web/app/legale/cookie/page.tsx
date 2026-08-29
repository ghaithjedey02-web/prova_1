import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Cookie policy',
  robots: { index: false, follow: true },
  alternates: { canonical: '/legale/cookie' },
};

export default function Page() {
  return (
    <section className="py-[clamp(3.5rem,8vw,6rem)]">
      <Container>
        <p className="label">Documento legale</p>
        <h1 className="display mt-6 text-[length:var(--text-display-m)]">Cookie policy</h1>
        <div className="mt-8 max-w-[64ch] border-l-2 border-amber pl-5">
          <p className="text-[var(--text-body)] leading-relaxed text-ink-2">
            Il sito non utilizza cookie di profilazione. L'analisi di traffico prevista è di tipo cookieless e non richiede consenso preventivo.
          </p>
          <p className="mt-4 text-[var(--text-small)] leading-relaxed text-muted">
            Questo testo deve essere redatto o rivisto da un professionista prima
            della pubblicazione commerciale del sito. Non pubblichiamo un documento
            legale generato automaticamente: sarebbe privo di valore e potenzialmente
            fuorviante.
          </p>
        </div>
      </Container>
    </section>
  );
}
