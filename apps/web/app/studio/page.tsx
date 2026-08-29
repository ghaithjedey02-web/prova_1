import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { studio } from '@/content/site';

export const metadata: Metadata = {
  title: 'Studio',
  description:
    'Perché DOLMIR esiste, come lavoriamo e dove. Nessun cliente inventato, nessuna testimonianza costruita.',
  alternates: { canonical: '/studio' },
};

export default function StudioPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-rule">
        <div aria-hidden className="sheet pointer-events-none absolute inset-0" />
        <Container wide className="relative py-[clamp(3.5rem,8vw,7rem)]">
          <Reveal><p className="label">Studio</p></Reveal>
          <Reveal delay={80}>
            <h1 className="display mt-7 max-w-[16ch] text-[length:var(--text-display-l)]">{studio.headline}</h1>
          </Reveal>
          <Reveal delay={150}><p className="lead mt-10">{studio.lead}</p></Reveal>
        </Container>
      </section>

      <section className="py-[var(--space-section)]">
        <Container wide>
          <div className="flex flex-col">
            {studio.sections.map((s, i) => (
              <Reveal
                key={s.t}
                delay={i * 60}
                className="grid gap-6 border-t border-rule-strong py-10 md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] md:gap-12"
              >
                <h2 className="font-display text-[length:var(--text-display-s)] leading-tight text-ink">{s.t}</h2>
                <div className="flex max-w-[62ch] flex-col gap-4">
                  {s.body.map((p) => (
                    <p key={p.slice(0, 28)} className="text-[var(--text-body)] leading-relaxed text-ink-2">{p}</p>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <aside className="mt-[var(--space-block)] border-l-2 border-accent bg-surface p-8 md:p-10">
              <h2 className="font-display text-[length:var(--text-display-s)] leading-tight text-ink">
                {studio.honesty.t}
              </h2>
              <p className="mt-4 max-w-[62ch] text-[var(--text-body)] leading-relaxed text-ink-2">
                {studio.honesty.body}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="/dimostrazione" variant="secondary">Vedi la dimostrazione</Button>
                <Button href="/contatto" arrow>Parliamone</Button>
              </div>
            </aside>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
