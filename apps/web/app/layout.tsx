import type { Metadata, Viewport } from 'next';
import { Archivo, IBM_Plex_Mono, Instrument_Sans } from 'next/font/google';
import { Nav } from '@/components/site/Nav';
import { SystemBackdrop, SystemReadout } from '@/components/system/SystemBackdrop';
import { Reticle } from '@/components/ui/Reticle';
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
    { media: '(prefers-color-scheme: light)', color: '#08090B' },
    { media: '(prefers-color-scheme: dark)', color: '#08090B' },
  ],
};

/**
 * Applies the stored theme before first paint. The site is dark by default —
 * that is the identity, not a system preference — so this only ever has to
 * switch someone into the daylight skin.
 */
const themeScript = `(function(){try{var t=localStorage.getItem('dolmir-theme');document.documentElement.setAttribute('data-theme',t==='light'?'light':'dark')}catch(e){document.documentElement.setAttribute('data-theme','dark')}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="it"
      data-theme="dark"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
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
      </body>
    </html>
  );
}
