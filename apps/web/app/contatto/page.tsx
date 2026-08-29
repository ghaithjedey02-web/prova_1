import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { ContactForm } from '@/components/site/ContactForm';
import { contatto, site } from '@/content/site';

export const metadata: Metadata = {
  title: 'Contatto',
  description:
    'Una conversazione diagnostica di venticinque minuti sul vostro processo di preventivazione. Nessuna presentazione commerciale.',
  alternates: { canonical: '/contatto' },
};

export default function ContattoPage() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="sheet pointer-events-none absolute inset-0" />
      <Container wide className="relative py-[clamp(3.5rem,8vw,6.5rem)]">
        <div className="grid gap-[var(--space-block)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
          <div>
            <Reveal><p className="label">{contatto.title}</p></Reveal>
            <Reveal delay={80}>
              <h1 className="display mt-7 max-w-[14ch] text-[length:var(--text-display-l)]">{contatto.headline}</h1>
            </Reveal>
            <Reveal delay={150}><p className="lead mt-10">{contatto.lead}</p></Reveal>

            <Reveal delay={220}>
              <div className="mt-11 border-t border-rule-strong pt-7">
                <p className="label mb-5">Di cosa parliamo</p>
                <ul className="flex flex-col gap-3">
                  {contatto.what.map((w, i) => (
                    <li key={w} className="flex gap-4 text-[var(--text-small)] text-ink-2">
                      <span className="label tnum shrink-0 pt-0.5">{String(i + 1).padStart(2, '0')}</span>
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={290}>
              <p className="mt-9 text-[var(--text-small)] text-muted">
                Oppure scrivete direttamente a{' '}
                <a href={`mailto:${site.email}`} className="text-accent underline underline-offset-4">
                  {site.email}
                </a>
              </p>
            </Reveal>
          </div>

          <Reveal delay={180}>
            <ContactForm />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
