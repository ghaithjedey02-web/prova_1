import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Termini di utilizzo',
  robots: { index: false, follow: true },
  alternates: { canonical: '/legale/termini' },
};

export default function Page() {
  return (
    <section className="py-[clamp(3.5rem,8vw,6rem)]">
      <Container>
        <p className="label">Documento legale</p>
        <h1 className="display mt-6 text-[length:var(--text-display-m)]">Termini di utilizzo</h1>
        <div className="mt-8 max-w-[64ch] border-l-2 border-amber pl-5">
          <p className="text-[var(--text-body)] leading-relaxed text-ink-2">
            Condizioni di utilizzo del sito e limitazioni relative ai contenuti dimostrativi, che sono basati su dati di esempio e non costituiscono offerta contrattuale.
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
