import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHead } from '@/components/ui/SectionHead';
import { trust } from '@/content/site';

/**
 * Stating limits plainly is the fastest available route to being believed about
 * everything else — and it is the one thing a prospect has never been told by
 * the three vendors who called them before us.
 */
export function Trust() {
  return (
    <section className="border-b border-rule py-[var(--space-section)]">
      <Container wide>
        <SectionHead num="07" label={trust.label} headline={trust.headline}>
          <p className="text-[var(--text-body)] leading-relaxed text-ink-2">{trust.body}</p>
        </SectionHead>

        <ul className="mt-[var(--space-block)] grid gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
          {trust.items.map((item, i) => (
            <Reveal as="li" key={item.t} delay={(i % 3) * 70} className="border-t border-rule-strong pt-5">
              <h3 className="flex gap-2.5 text-[var(--text-body)] font-medium text-ink">
                <span aria-hidden className="font-mono text-muted">—</span>
                {item.t}
              </h3>
              <p className="mt-2.5 pl-6 text-[var(--text-small)] leading-relaxed text-muted">{item.d}</p>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
