'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Container } from '@/components/ui/Container';
import { ThemeToggle } from './ThemeToggle';
import { cta, nav, site } from '@/content/site';

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-[var(--duration-base)] ease-[var(--ease-mech)] ${
        scrolled || open ? 'border-rule bg-ground/80 backdrop-blur-xl' : 'border-transparent bg-transparent'
      }`}
    >
      <Container>
        <div className="flex h-[var(--nav-h)] items-center justify-between gap-6">
          <Link href="/" className="group flex items-center gap-3" aria-label={`${site.name} — home`}>
            <Mark />
            <span className="font-display text-[0.95rem] font-semibold tracking-[0.3em] text-ink transition-colors group-hover:text-accent">
              {site.name}
            </span>
          </Link>

          <nav aria-label="Principale" className="hidden items-center gap-7 lg:flex">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`relative py-1 text-[var(--text-small)] transition-colors duration-[var(--duration-fast)] ${
                    active ? 'text-ink' : 'text-muted hover:text-ink'
                  }`}
                >
                  {item.label}
                  {active && <span aria-hidden className="absolute -bottom-0.5 left-0 h-px w-full bg-accent" />}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <Link
              href={cta.primary.href}
              className="hidden rounded-sm bg-accent px-5 py-2.5 text-[var(--text-micro)] font-medium text-accent-ink transition-colors duration-[var(--duration-fast)] hover:bg-accent-hover sm:inline-flex"
            >
              {cta.primary.label}
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? 'Chiudi menu' : 'Apri menu'}
              className="grid size-9 place-items-center rounded-sm border border-rule text-ink lg:hidden"
            >
              <svg width="15" height="15" viewBox="0 0 15 15" aria-hidden>
                {open ? (
                  <path d="M3 3l9 9M12 3l-9 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                ) : (
                  <path d="M2 4.5h11M2 10.5h11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </Container>

      {open && (
        <div id="mobile-nav" className="border-t border-rule bg-ground lg:hidden">
          <Container>
            <nav aria-label="Principale mobile" className="flex flex-col py-3">
              {nav.map((item, i) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-baseline gap-4 border-b border-rule py-4 last:border-0"
                >
                  <span className="font-mono text-[var(--text-label)] tnum text-accent">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="headline text-[1.65rem] text-ink">{item.label}</span>
                </Link>
              ))}
              <Link
                href={cta.primary.href}
                className="mt-5 mb-4 rounded-sm bg-accent px-5 py-4 text-center text-[var(--text-small)] font-medium text-accent-ink"
              >
                {cta.primary.label}
              </Link>
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}

/** The mark: a section line interrupted by a gate. The product, in 16 pixels. */
function Mark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden className="shrink-0">
      <line x1="1" y1="9" x2="17" y2="9" stroke="var(--c-rule-bright)" strokeWidth="1.2" />
      <rect x="4.5" y="6.5" width="5" height="5" fill="var(--c-accent)" />
      <line x1="12.5" y1="2.5" x2="12.5" y2="6" stroke="var(--c-accent)" strokeWidth="1.6" />
      <line x1="12.5" y1="12" x2="12.5" y2="15.5" stroke="var(--c-accent)" strokeWidth="1.6" />
    </svg>
  );
}
