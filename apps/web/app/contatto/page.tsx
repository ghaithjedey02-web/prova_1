import type { Metadata } from 'next';
import { ContactForm } from '@/components/site/ContactForm';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { contatto as c, site } from '@/content/site';

export const metadata: Metadata = {
  title: c.title,
  description:
    'Una conversazione diagnostica di venticinque minuti sul processo che vi costa di più. Non commerciale, e se non ha senso lo diciamo.',
  alternates: { canonical: '/contatto' },
};

export default function ContattoPage() {
  return (
    <section className="relative overflow-hidden">
            <Container className="relative py-[clamp(3.5rem,8vw,6.5rem)]">
        <div className="grid gap-[var(--space-block)] lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <Reveal><p className="chapter">{c.title}</p></Reveal>
            <Reveal delay={70}>
              <h1 className="display mt-8 max-w-[13ch] text-[length:var(--text-display-l)]">{c.headline}</h1>
            </Reveal>
            <Reveal delay={110}>
              <div className="mt-9 h-px w-full max-w-[18rem] bg-gradient-to-r from-accent to-transparent" />
            </Reveal>
            <Reveal delay={160}><p className="lead mt-8">{c.lead}</p></Reveal>

            <Reveal delay={210}>
              <div className="mt-12">
                <p className="label">Di cosa parliamo, in sintesi</p>
                <ul className="mt-6 flex flex-col">
                  {c.what.map((w, i) => (
                    <li key={w} className="flex gap-4 border-t border-rule py-4 first:border-t-0 first:pt-0">
                      <span className="font-mono text-[length:var(--text-label)] tnum text-accent">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-[length:var(--text-small)] leading-snug text-ink-2">{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={280}>
              <p className="mt-10 text-[length:var(--text-small)] leading-relaxed text-muted">
                Preferite scrivere direttamente?{' '}
                <a
                  href={`mailto:${site.email}`}
                  className="text-ink underline decoration-rule-strong underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
                >
                  {site.email}
                </a>
              </p>
            </Reveal>
          </div>

          <Reveal delay={160}>
            <ContactForm />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
