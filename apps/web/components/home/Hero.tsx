import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { cta, hero, scenario } from '@/content/site';
import { HeroStage } from './HeroStage';

/**
 * The first screen: one sentence, then the product, full width.
 *
 * The composition the strongest product sites share — headline across the
 * measure, a short lead, two actions, and the interface itself right
 * underneath, as wide as the page — translated for DOLMIR: the interface is
 * the three surfaces of the operational layer, and the thing moving through
 * them is a request from the demo company.
 *
 * Server component: the words are in the HTML and painted before any
 * JavaScript arrives; only the story inside the stage needs a client.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden pt-[calc(var(--nav-h)+clamp(2rem,5vw,4.5rem))] pb-[clamp(3rem,6vw,5rem)]">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 pool opacity-70" />
      <Container>
        <div className="enter grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:items-end lg:gap-12">
          <div>
            <p className="mb-5 text-[length:var(--text-small)] font-medium text-accent">{hero.eyebrow}</p>
            <h1 className="display max-w-[15ch] text-[length:var(--text-display-xl)] text-ink">{hero.headline}</h1>
          </div>
          <div className="lg:pb-2">
            <p className="lead max-w-[44ch]">{hero.lead}</p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button href={cta.primary.href} size="lg" arrow>{cta.primary.label}</Button>
              <Button href={cta.secondary.href} variant="secondary" size="lg">{cta.secondary.label}</Button>
            </div>
          </div>
        </div>

        <div className="enter-2 mt-10 sm:mt-12 lg:mt-14">
          <HeroStage />
          <p className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[length:var(--text-micro)] text-faint">
            {hero.ribbon.map((v, i) => (
              <span key={v} className="flex items-baseline gap-x-3">
                {i > 0 && <span aria-hidden>·</span>}
                <span className={i === hero.ribbon.length - 1 ? 'text-amber' : ''}>{v}</span>
              </span>
            ))}
            <span aria-hidden className="hidden sm:inline">·</span>
            <span>{scenario.disclaimer}</span>
          </p>
        </div>
      </Container>
    </section>
  );
}
