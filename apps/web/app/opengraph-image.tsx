import { ImageResponse } from 'next/og';
import { site } from '@/content/site';

/**
 * The social card, generated at build time in the house tokens — no asset
 * pipeline, no stock image, and it can never drift from the brand because
 * the colours are the same literals the design system documents.
 */
export const alt = `${site.name} — sistemi software intelligenti per le aziende`;
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
          <div style={{ color: '#F2F4F5', fontSize: 76, fontWeight: 700, lineHeight: 1.08 }}>
            Email, PDF, gestionali:
          </div>
          <div style={{ color: '#7B858A', fontSize: 76, fontWeight: 700, lineHeight: 1.08 }}>
            il lavoro si disperde.
          </div>
          <div style={{ color: '#F2F4F5', fontSize: 76, fontWeight: 700, lineHeight: 1.08 }}>
            DOLMIR lo ricompone.
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ color: '#45C7DE', fontSize: 24, letterSpacing: 6 }}>
            SISTEMA · VERIFICA · PERSONA · AZIONE
          </div>
          <div style={{ color: '#7B858A', fontSize: 24 }}>dolmir.com</div>
        </div>
      </div>
    ),
    size,
  );
}
