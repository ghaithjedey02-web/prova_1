import { existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * The slot for the DOLMIR introduction film.
 *
 * Server component: at build time it checks whether the final MP4 exists at
 * `public/film/dolmir-intro.mp4`. Until it does, the slot renders nothing —
 * no placeholder, no dead player, no broken poster. The day the film lands
 * (produced per docs/video/DOLMIR-FILM.md), dropping the file in makes this
 * appear: lazy-loaded, poster-first, native accessible controls, never
 * autoplaying with audio, and costing the initial page load nothing.
 */
export function FilmSlot() {
  const base = join(process.cwd(), 'public', 'film');
  const has = existsSync(join(base, 'dolmir-intro.mp4'));
  if (!has) return null;
  const poster = existsSync(join(base, 'dolmir-intro-poster.jpg'))
    ? '/film/dolmir-intro-poster.jpg'
    : undefined;

  return (
    <div className="mt-[var(--space-block)]">
      <p className="telemetry mb-3 text-faint">IL FILM · 60 SECONDI</p>
      <div className="bracket overflow-hidden border border-rule bg-void">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption -- subtitles are burned in per the production spec */}
        <video
          controls
          preload="none"
          poster={poster}
          playsInline
          className="block aspect-video w-full"
          src="/film/dolmir-intro.mp4"
        />
      </div>
    </div>
  );
}
