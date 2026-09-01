import { Hero } from '@/components/home/Hero';
import { Problema } from '@/components/home/Problema';
import { Parla } from '@/components/live/Parla';
import { Simulator } from '@/components/live/Simulator';
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
 * The homepage, as a first-time visitor walks it:
 *
 *   Hero      — what DOLMIR is, in one sentence and seven words.
 *   Problema  — the work is not in the gestionale: where it actually lives,
 *               and what we do NOT replace.
 *   Parla     — the product, live: the film explains the idea in twenty
 *               seconds, then the visitor talks to the system themselves.
 *   Simulator — their turn: hand it a problem, watch it stop at the gate.
 *   HumanGate — why it stops, which is the reason to trust it.
 *   Closing   — one action.
 *
 * Six sections, deliberately. It used to run to nine, four of which were
 * variations on "watch the technology work" — the operating-layer map, the
 * 3D case, and the pipeline demo all argued the same point the console and
 * the simulator already make, at the cost of about three viewport-heights of
 * scrolling. They are not deleted: the map and the case live on their own
 * routes, where a visitor who wants that depth goes looking for it. A
 * homepage is not an index of everything we built.
 */
export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero />
      <Problema />
      <Parla />
      <Simulator />
      <HumanGate />
      <Closing />
    </>
  );
}
