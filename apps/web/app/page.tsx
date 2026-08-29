import { Hero } from '@/components/home/Hero';
import { Problem } from '@/components/home/Problem';
import { Approach } from '@/components/home/Approach';
import { TheLine } from '@/components/line/TheLine';
import { DemoTeaser } from '@/components/home/DemoTeaser';
import { Control } from '@/components/home/Control';
import { Outcome } from '@/components/home/Outcome';
import { Trust } from '@/components/home/Trust';
import { Closing } from '@/components/home/Closing';
import { site } from '@/content/site';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: site.name,
  url: site.url,
  description: site.description,
  areaServed: { '@type': 'AdministrativeArea', name: 'Lombardia, Italia' },
  knowsLanguage: ['it', 'en'],
  serviceType: 'Ingegneria di processi con intelligenza artificiale',
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <Problem />
      <Approach />
      <TheLine />
      <DemoTeaser />
      <Control />
      <Outcome />
      <Trust />
      <Closing />
    </>
  );
}
