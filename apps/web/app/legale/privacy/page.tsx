import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Informativa privacy',
  robots: { index: false, follow: true },
  alternates: { canonical: '/legale/privacy' },
};

export default function Page() {
  return (
    <section className="py-[clamp(3.5rem,8vw,6rem)]">
      <Container>
        <p className="label">Documento legale</p>
        <h1 className="display mt-6 text-[length:var(--text-display-m)]">Informativa privacy</h1>
        <div className="mt-8 max-w-[64ch] border-l-2 border-amber pl-5">
          <p className="text-[var(--text-body)] leading-relaxed text-ink-2">
            Informativa ai sensi degli articoli 13 e 14 del Regolamento (UE) 2016/679, relativa ai dati raccolti tramite il modulo di contatto e la navigazione del sito.
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
