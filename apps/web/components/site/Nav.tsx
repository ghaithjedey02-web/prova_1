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
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  // Prevent background scroll while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-[background-color,border-color] duration-[var(--duration-base)] ease-[var(--ease-mech)] ${
        scrolled ? 'border-rule bg-ground/85 backdrop-blur-md' : 'border-transparent bg-transparent'
      }`}
    >
      <Container wide>
        <div className="flex h-[var(--nav-h)] items-center justify-between gap-6">
          <Link
            href="/"
            className="font-mono text-[0.8125rem] font-medium tracking-[0.22em] text-ink transition-colors hover:text-accent"
            aria-label={`${site.name} — home`}
          >
            {site.name}
          </Link>

          <nav aria-label="Principale" className="hidden items-center gap-8 md:flex">
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
                  {active && (
                    <span aria-hidden className="absolute -bottom-0.5 left-0 h-px w-full bg-accent" />
                  )}
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
              className="grid size-9 place-items-center rounded-sm border border-rule text-ink md:hidden"
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
        <div id="mobile-nav" className="border-t border-rule bg-ground md:hidden">
          <Container>
            <nav aria-label="Principale mobile" className="flex flex-col py-2">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="border-b border-rule py-4 font-display text-[1.5rem] text-ink last:border-0"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href={cta.primary.href}
                className="mt-5 mb-4 rounded-sm bg-accent px-5 py-3.5 text-center text-[var(--text-small)] font-medium text-accent-ink"
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
