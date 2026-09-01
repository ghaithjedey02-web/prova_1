import { Hero } from '@/components/home/Hero';
import { Problema } from '@/components/home/Problema';
import { Parla } from '@/components/live/Parla';
import { CasoOperativo } from '@/components/home/CasoOperativo';
import { Processi } from '@/components/home/Processi';
import { Simulator } from '@/components/live/Simulator';
import { HumanGate } from '@/components/home/HumanGate';
import { TrustBand } from '@/components/home/TrustBand';
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
 * The homepage as a B2B landing: understand → recognise → try → picture it →
 * trust → act.
 *
 *   Hero          — what DOLMIR is, in one sentence and seven words.
 *   Problema (01) — "il lavoro non è nel gestionale", and the three things
 *                   we do NOT replace or change.
 *   Parla    (02) — the product, live: the explainer tells the story, then
 *                   the visitor talks to the system themselves.
 *   Caso     (03) — the same order twice: seven manual hops today, one human
 *                   decision with DOLMIR. Illustrative and declared.
 *   Processi (04) — "adesso immaginate il vostro": eight processes, one
 *                   shape, the visitor's own bottleneck drawn onto it.
 *   Simulator(05) — their hands on it: run the case, hit the gate, decide.
 *   HumanGate(06) — why it stops. The trust thesis, in the engine's words.
 *   TrustBand     — six architectural guarantees, right before the ask.
 *   Closing       — one concrete action, with what to bring to it.
 *
 * The technology showcases (operating-layer map, 3D case, pipeline demo)
 * keep their own routes; the homepage's job is the visitor's own process.
 */
export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero />
      <Problema />
      <Parla />
      <CasoOperativo />
      <Processi />
      <Simulator />
      <HumanGate />
      <TrustBand />
      <Closing />
    </>
  );
}
