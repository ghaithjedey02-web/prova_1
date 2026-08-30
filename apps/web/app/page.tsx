import { Hero } from '@/components/home/Hero';
import { Fragmentation } from '@/components/home/Fragmentation';
import { Twin } from '@/components/live/Twin';
import { FlowDemo } from '@/components/live/FlowDemo';
import { FrictionScan } from '@/components/live/FrictionScan';
import { TheLine } from '@/components/line/TheLine';
import { Software } from '@/components/home/Software';
import { HumanGate } from '@/components/home/HumanGate';
import { Closing } from '@/components/home/Closing';
import { site } from '@/content/site';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: site.name,
  url: site.url,
  description: site.description,
  areaServed: { '@type': 'AdministrativeArea', name: 'Lombardia, Italia' },
  knowsLanguage: ['it'],
  serviceType: 'Sistemi digitali, automazione AI e integrazioni per imprese',
};

/**
 * Nine experiences, not thirty sections.
 *
 * Three of them are the product rather than a description of it: the twin is a
 * live graph the visitor inspects, the flow demo instantiates the real
 * `RfqPipeline`, and the friction scan runs an analysis on whatever the visitor
 * says hurts. Each drives the intelligence core in the background through the
 * system bus, so the machine visibly reacts to being used.
 *
 * `SystemBackdrop` in the layout renders the one fixed scene behind all of it;
 * these sections sit on translucent surfaces so the machine reads through
 * without ever competing with the words.
 */
export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero />
      <Fragmentation />
      <Twin />
      <FlowDemo />
      <FrictionScan />
      <TheLine />
      <Software />
      <HumanGate />
      <Closing />
    </>
  );
}
