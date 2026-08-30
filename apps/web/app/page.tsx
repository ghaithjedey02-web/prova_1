import { Hero } from '@/components/home/Hero';
import { Fragmentation } from '@/components/home/Fragmentation';
import { Layer } from '@/components/home/Layer';
import { Intelligence } from '@/components/home/Intelligence';
import { TheLine } from '@/components/line/TheLine';
import { Software } from '@/components/home/Software';
import { Integrations } from '@/components/home/Integrations';
import { HumanGate } from '@/components/home/HumanGate';
import { Proof } from '@/components/home/Proof';
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
 * The homepage is one continuous machine.
 *
 * There is no background image behind these sections: `SystemBackdrop` in the
 * layout renders a single fixed scene that changes state as the page scrolls,
 * and every section here sits on top of it with translucent surfaces so the
 * machine is visible through the content. The order of the sections is the
 * order of the system's states — that is why they read as one sequence rather
 * than as a stack of blocks.
 */
export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero />
      <Fragmentation />
      <Layer />
      <Intelligence />
      <TheLine />
      <Software />
      <Integrations />
      <HumanGate />
      <Proof />
      <Closing />
    </>
  );
}
