import { Hero } from '@/components/home/Hero';
import { Noise } from '@/components/home/Noise';
import { Cost } from '@/components/home/Cost';
import { Layer } from '@/components/home/Layer';
import { TheLine } from '@/components/line/TheLine';
import { Decision } from '@/components/home/Decision';
import { Human } from '@/components/home/Human';
import { Result } from '@/components/home/Result';
import { Presence } from '@/components/home/Presence';
import { Office } from '@/components/home/Office';
import { Intelligence } from '@/components/home/Intelligence';
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
  serviceType: 'Infrastruttura digitale e AI per aziende manifatturiere',
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero />
      <Noise />
      <Cost />
      <Layer />
      <TheLine />
      <Decision />
      <Human />
      <Result />
      <Presence />
      <Office />
      <Intelligence />
      <Closing />
    </>
  );
}
