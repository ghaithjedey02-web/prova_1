import { ImageResponse } from 'next/og';
import { site } from '@/content/site';

/**
 * The social card, generated at build time in the house tokens — no asset
 * pipeline, no stock image, and it can never drift from the brand because
 * the colours are the same literals the design system documents.
 */
export const alt = `${site.name} — il lavoro della vostra azienda, finalmente connesso`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#08090B',
          padding: 72,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ width: 14, height: 14, background: '#45C7DE' }} />
          <div style={{ color: '#F2F4F5', fontSize: 34, letterSpacing: 14, fontWeight: 700 }}>
            DOLMIR
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ color: '#F2F4F5', fontSize: 74, fontWeight: 700, lineHeight: 1.08, letterSpacing: -2 }}>
            Il lavoro della vostra
          </div>
          <div style={{ color: '#F2F4F5', fontSize: 74, fontWeight: 700, lineHeight: 1.08, letterSpacing: -2 }}>
            azienda, finalmente
          </div>
          <div style={{ color: '#45C7DE', fontSize: 74, fontWeight: 700, lineHeight: 1.08, letterSpacing: -2 }}>
            connesso.
          </div>
          <div style={{ color: '#AEB6BA', fontSize: 28, lineHeight: 1.35, marginTop: 28, maxWidth: 900 }}>
            Email, documenti e gestionali letti, verificati e trasformati in azioni. Quando serve un giudizio, decide una persona.
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', color: '#8D969B', fontSize: 20, letterSpacing: 4 }}>
            <span>LEGGE</span><span style={{ color: '#3B434A' }}>·</span><span>VERIFICA</span><span style={{ color: '#3B434A' }}>·</span><span>PREPARA</span><span style={{ color: '#3B434A' }}>·</span><span style={{ color: '#E3A551' }}>SI FERMA QUANDO SERVE UNA PERSONA</span>
          </div>
          <div style={{ color: '#7B858A', fontSize: 24 }}>dolmir.com</div>
        </div>
      </div>
    ),
    size,
  );
}
