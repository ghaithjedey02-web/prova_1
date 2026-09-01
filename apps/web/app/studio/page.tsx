import type { Metadata } from 'next';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { cta, studio as s } from '@/content/site';

export const metadata: Metadata = {
  title: s.title,
  description:
    'Perché DOLMIR esiste, in cosa crede, come lavora e cosa rifiuta. Senza loghi di clienti, testimonianze o casi studio che non abbiamo.',
  alternates: { canonical: '/studio' },
};

export default function StudioPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-rule">
                <Container className="relative py-[clamp(3rem,6.5vw,5.5rem)]">
          <Reveal><p className="chapter">{s.title}</p></Reveal>
          <Reveal delay={70}>
            <h1 className="display mt-8 max-w-[14ch] text-[length:var(--text-display-xl)]">{s.headline}</h1>
          </Reveal>
          <Reveal delay={110}>
            <div className="mt-9 h-px w-full max-w-[20rem] bg-gradient-to-r from-accent to-transparent" />
          </Reveal>
          <Reveal delay={160}><p className="lead mt-8 max-w-[60ch]">{s.lead}</p></Reveal>
        </Container>
      </section>

      <section className="border-b border-rule">
        <ol className="stack-rules">
          {s.sections.map((sec, i) => (
            <Reveal key={sec.t} as="li" delay={i * 40}>
              <Container>
                <div className="grid gap-6 py-12 lg:grid-cols-[5rem_1fr_1.5fr] lg:gap-10 lg:py-16">
                  <span className="font-mono text-[length:var(--text-label)] tnum text-faint">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h2 className="headline text-[length:var(--text-display-s)] text-ink">{sec.t}</h2>
                  <div className="flex flex-col gap-5">
                    {sec.body.map((p) => (
                      <p key={p} className="text-[length:var(--text-body)] leading-relaxed text-ink-2">{p}</p>
                    ))}
                  </div>
                </div>
              </Container>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* ------------------------------------------------------------ refuse */}
      <section className="border-b border-rule bg-void/85 backdrop-blur-md py-[var(--space-section)]">
        <Container>
          <div className="grid gap-[var(--space-block)] lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <Reveal>
              <h2 className="headline max-w-[12ch] text-[length:var(--text-display-m)]">{s.refuse.label}</h2>
            </Reveal>
            <ul className="stack-rules border-y border-rule">
              {s.refuse.items.map((item, i) => (
                <Reveal key={item} as="li" delay={i * 55}>
                  <p className="flex gap-5 py-5 text-[length:var(--text-lead)] leading-snug text-ink-2">
                    <span aria-hidden className="font-mono leading-tight text-bad">×</span>
                    {item}
                  </p>
                </Reveal>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* ---------------------------------------------------------- honesty */}
      <section className="py-[var(--space-section)]">
        <Container>
          <Reveal>
            <div className="plate max-w-[68ch] p-10 sm:p-14">
              <p className="label">{s.honesty.t}</p>
              <p className="mt-7 text-[length:var(--text-display-s)] leading-snug text-ink">{s.honesty.body}</p>
              <div className="mt-10"><Button href={cta.primary.href} arrow>{cta.primary.label}</Button></div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
