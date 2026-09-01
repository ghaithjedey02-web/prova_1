import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { fiducia as c } from '@/content/site';

/**
 * The trust band — six guarantees, placed right before the close, because
 * this is the moment a visitor decides whether to write to us.
 *
 * Each line is architecture, not a promise: migration-free by design,
 * source-checked data, declared confidence, a written register, a person in
 * the loop, and no autonomous action where judgement is required. Nothing
 * here is a certification, a customer count or a partnership we do not have
 * — those stay off the site until they exist.
 */
export function TrustBand() {
  return (
    <section className="relative border-y border-rule bg-surface/40 py-[clamp(3rem,5vw,4.5rem)]" aria-label={c.label}>
      <Container>
        <Reveal>
          <p className="label text-ink-2">{c.label}</p>
        </Reveal>
        <div className="mt-7 grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
          {c.items.map((item, i) => (
            <Reveal key={item.t} delay={60 + i * 50}>
              <div className="flex gap-4">
                <span aria-hidden className="mt-[0.5rem] block h-px w-6 flex-none bg-accent" />
                <div>
                  <p className="text-[length:var(--text-body)] font-medium text-ink">{item.t}</p>
                  <p className="mt-1.5 max-w-[38ch] text-[length:var(--text-small)] leading-snug text-ink-2">{item.d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
