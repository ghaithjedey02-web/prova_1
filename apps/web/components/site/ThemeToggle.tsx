'use client';

import { useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

/**
 * Dark is the identity, not a preference: the site is built as a lit workshop
 * at night, so it opens dark for everyone and this switches to the daylight
 * skin for people who want it. The choice persists; the inline script in the
 * layout applies it before first paint so there is no flash.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const stored = localStorage.getItem('dolmir-theme');
    setTheme(stored === 'light' ? 'light' : 'dark');
  }, []);

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('dolmir-theme', next);
    } catch {
      /* private mode — the choice simply does not persist */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Passa al tema chiaro' : 'Passa al tema scuro'}
      className="grid size-9 place-items-center rounded-sm border border-rule text-muted transition-colors duration-[var(--duration-fast)] hover:border-rule-strong hover:text-ink"
    >
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
        {theme === 'dark' ? (
          <>
            <circle cx="7.5" cy="7.5" r="3" stroke="currentColor" strokeWidth="1.2" />
            <path d="M7.5 1v1.6M7.5 12.4V14M14 7.5h-1.6M2.6 7.5H1M12.1 2.9l-1.1 1.1M4 11l-1.1 1.1M12.1 12.1L11 11M4 4L2.9 2.9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </>
        ) : (
          <path d="M12.8 9.4A5.7 5.7 0 0 1 5.6 2.2 5.7 5.7 0 1 0 12.8 9.4Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        )}
      </svg>
    </button>
  );
}
