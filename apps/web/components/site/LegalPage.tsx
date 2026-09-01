import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { legalNote, site } from '@/content/site';

/**
 * Shared frame for the three legal documents.
 *
 * The pages are deliberately short and say plainly that the text is not yet
 * lawyer-reviewed. Publishing an auto-generated privacy notice on a site whose
 * entire argument is "we tell you what we do not know" would be the one
 * self-inflicted wound this project cannot afford.
 */
export function LegalPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden py-[clamp(3.5rem,8vw,6.5rem)]">
            <Container size="read" className="relative">
        <p className="chapter">Documento legale</p>
        <h1 className="display mt-8 max-w-[16ch] text-[length:var(--text-display-l)]">{title}</h1>

        <div className="mt-10 max-w-[64ch]">
          <p className="text-[length:var(--text-lead)] leading-relaxed text-ink-2">{intro}</p>
        </div>

        <div className="mt-10 flex max-w-[64ch] gap-4 border border-amber-line bg-amber-soft/50 p-6">
          <span aria-hidden className="mt-0.5 font-mono leading-none text-amber">△</span>
          <p className="text-[length:var(--text-small)] leading-relaxed text-ink-2">{legalNote}</p>
        </div>

        {children}

        <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-rule pt-8 font-mono text-[length:var(--text-label)] tracking-[0.12em] text-muted">
          <span>Titolare · {site.name}</span>
          <a href={`mailto:${site.email}`} className="transition-colors hover:text-accent">{site.email}</a>
          <Link href="/contatto" className="transition-colors hover:text-accent">Contatto</Link>
        </div>
      </Container>
    </section>
  );
}
