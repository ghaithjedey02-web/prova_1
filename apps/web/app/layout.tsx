import type { Metadata, Viewport } from 'next';
import { Archivo, IBM_Plex_Mono, Instrument_Sans } from 'next/font/google';
import { Nav } from '@/components/site/Nav';
import { SystemBackdrop, SystemReadout } from '@/components/system/SystemBackdrop';
import { Reticle } from '@/components/ui/Reticle';
import { Inspect } from '@/components/system/Inspect';
import { Footer } from '@/components/site/Footer';
import { site } from '@/content/site';
import './globals.css';

/** Archivo carries the voice: the grotesque of machine plates and catalogues. */
const display = Archivo({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-archivo',
  display: 'swap',
});

const sans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument-sans',
  display: 'swap',
});

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name }],
  keywords: [
    'AI per PMI industriali',
    'automazione processi aziendali',
    'preventivi industriali',
    'automazione richieste di offerta',
    'digitalizzazione PMI manifatturiere',
    'ufficio tecnico metalmeccanica',
    'infrastruttura AI industriale',
    'Lombardia',
  ],
  openGraph: {
    type: 'website',
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
};

export const viewport: Viewport = {
  themeColor: [
    { color: '#08090B' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="it"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body>
        {/* Who we are, for machines: no reviews, no invented facts. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: site.name,
              url: site.url,
              logo: `${site.url}/apple-icon.png`,
              email: site.email,
              description: site.description,
            }),
          }}
        />
        <a href="#main" className="skip">Vai al contenuto</a>
        {/* The machine the whole site sits on. Fixed, behind everything, driven
            by one scroll scalar. */}
        <SystemBackdrop />
        <Reticle />
        <div className="relative z-10">
          <Nav />
          <main id="main">{children}</main>
          <Footer />
        </div>
        <SystemReadout />
        <Inspect />
      </body>
    </html>
  );
}
