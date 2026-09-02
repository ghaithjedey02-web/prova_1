import { Hero } from '@/components/home/Hero';
import { Problema } from '@/components/home/Problema';
import { Context } from '@/components/home/Context';
import { Workflow } from '@/components/home/Workflow';
import { Parla } from '@/components/live/Parla';
import { CaseStudy } from '@/components/home/CaseStudy';
import { Control } from '@/components/home/Control';
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
  serviceType: 'Sistemi software intelligenti, automazione AI e integrazioni per imprese',
};

/**
 * The homepage as one story, eight chapters, each answering one question.
 *
 *   01 Hero       — what is DOLMIR? One sentence, then the product, full width.
 *   02 Problema   — why operational work fragments: the desk, drawn.
 *   03 Il contesto — the records around one request, and how they relate.
 *   04 Il flusso  — the eight-step loop, filled with the visitor's process.
 *   05 Parla      — the real model, with tools, live.
 *   06 Il caso    — one request followed from email to quotation.
 *   07 Controllo  — the five states, the refusal constant, the guarantees.
 *   08 Il passo   — one action, and what to bring to it.
 */
export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero />
      <Problema />
      <Context />
      <Workflow />
      <Parla />
      <CaseStudy />
      <Control />
      <Closing />
    </>
  );
}
