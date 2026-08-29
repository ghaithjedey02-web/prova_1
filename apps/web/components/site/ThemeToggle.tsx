'use client';

import { useEffect, useState } from 'react';

type Mode = 'light' | 'dark' | 'system';

const KEY = 'dolmir-theme';

export function ThemeToggle() {
  const [mode, setMode] = useState<Mode>('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(KEY);
      if (stored === 'dark' || stored === 'light') setMode(stored);
    } catch {
      /* storage can throw in private mode — the default is fine */
    }
  }, []);

  function apply(next: Mode) {
    setMode(next);
    const root = document.documentElement;
    if (next === 'system') {
      root.removeAttribute('data-theme');
      try { localStorage.removeItem(KEY); } catch { /* ignore */ }
    } else {
      root.setAttribute('data-theme', next);
      try { localStorage.setItem(KEY, next); } catch { /* ignore */ }
    }
  }

  // Rendered inert until mounted so server and client markup agree.
  const next: Mode = mode === 'dark' ? 'light' : 'dark';

  return (
    <button
      type="button"
      onClick={() => apply(next)}
      aria-label={next === 'dark' ? 'Passa al tema scuro' : 'Passa al tema chiaro'}
      className="grid size-9 place-items-center rounded-sm border border-rule text-muted transition-colors duration-[var(--duration-fast)] hover:border-rule-strong hover:text-ink"
    >
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
        {mounted && mode === 'dark' ? (
          <>
            <circle cx="7.5" cy="7.5" r="3" stroke="currentColor" strokeWidth="1.2" />
            <path
              d="M7.5 1v1.4M7.5 12.6V14M14 7.5h-1.4M2.4 7.5H1M12.1 2.9l-1 1M3.9 11.1l-1 1M12.1 12.1l-1-1M3.9 3.9l-1-1"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </>
        ) : (
          <path
            d="M12.8 9.4A5.7 5.7 0 0 1 5.6 2.2 5.7 5.7 0 1 0 12.8 9.4Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  );
}
