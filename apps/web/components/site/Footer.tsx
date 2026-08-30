import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { nav, site } from '@/content/site';

const legal = [
  { href: '/legale/privacy', label: 'Privacy' },
  { href: '/legale/cookie', label: 'Cookie' },
  { href: '/legale/termini', label: 'Termini' },
];

export function Footer() {
  return (
    <footer className="relative mt-[var(--space-section)] border-t border-rule bg-void">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-line to-transparent" />
      <Container>
        <div className="grid gap-12 py-16 md:grid-cols-[1.7fr_1fr_1fr] md:py-20">
          <div className="max-w-[38ch]">
            <p className="font-display text-[0.95rem] font-semibold tracking-[0.3em] text-ink">{site.name}</p>
            <p className="mt-5 text-[var(--text-small)] leading-relaxed text-muted">{site.description}</p>
            <a
              href={`mailto:${site.email}`}
              className="mt-6 inline-block font-mono text-[var(--text-micro)] text-ink-2 underline decoration-rule-strong underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
            >
              {site.email}
            </a>
          </div>

          <nav aria-label="Pagine">
            <p className="label mb-5">Pagine</p>
            <ul className="flex flex-col gap-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link className="text-[var(--text-small)] text-ink-2 transition-colors hover:text-accent" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link className="text-[var(--text-small)] text-ink-2 transition-colors hover:text-accent" href="/contatto">
                  Contatto
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Informazioni">
            <p className="label mb-5">Informazioni</p>
            <ul className="flex flex-col gap-3">
              {legal.map((item) => (
                <li key={item.href}>
                  <Link className="text-[var(--text-small)] text-ink-2 transition-colors hover:text-accent" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-3 border-t border-rule py-8 font-mono text-[var(--text-label)] tracking-[0.12em] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {site.name} · {site.region}</p>
          <p>P.IVA — da inserire · {site.domain}</p>
        </div>
      </Container>
    </footer>
  );
}
