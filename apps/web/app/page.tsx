import { Hero } from '@/components/home/Hero';
import { Problema } from '@/components/home/Problema';
import { Intelligence } from '@/components/live/Intelligence';
import { Materia } from '@/components/live/Materia';
import { FlowDemo } from '@/components/live/FlowDemo';
import { Simulator } from '@/components/live/Simulator';
import { Parla } from '@/components/live/Parla';
import { HumanGate } from '@/components/home/HumanGate';
import { Closing } from '@/components/home/Closing';
import { Spine } from '@/components/system/Spine';
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
 * The narrative, in order:
 *
 *   Hero          — the system wakes up; the claim is concrete: email, PDF,
 *                   gestionali → un sistema.
 *   Problema      — the quiet editorial chapter: where work actually lives,
 *                   what DOLMIR is in one sentence, what we do NOT replace.
 *   Intelligence  — inside the technology: channels in, core, actions out, live.
 *   Twin          — the transformation, in the visitor's hand: chaos → system.
 *   Capabilities  — the six families of systems DOLMIR builds, as instruments.
 *   Materia       — ONE real case, labelled as such: a machined part becomes a
 *                   record (the only place 3D is the content, not the ground).
 *   FlowDemo      — the same case running on the real RfqPipeline, refusals included.
 *   TheLine       — the journey of one request end to end.
 *   Simulator     — the visitor runs it: six sectors, telemetry exposed,
 *                   approve/reject in their hand, before/after animated.
 *   Software      — the interfaces; HumanGate — why it stops; Closing.
 *
 * Sections that ARE the product rather than describing it drive the fixed
 * machine in the background through the system bus, so the core visibly reacts
 * to being used. Manufacturing is deliberately one chapter, not the identity.
 */
export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Spine />
      <Hero />
      <Problema />
      <Simulator />
      <Parla />
      <Intelligence />
      <Materia />
      <FlowDemo />
      <HumanGate />
      <Closing />
    </>
  );
}
