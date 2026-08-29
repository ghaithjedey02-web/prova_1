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
    <footer className="mt-[var(--space-section)] border-t border-rule bg-surface">
      <Container wide>
        <div className="grid gap-10 py-14 md:grid-cols-[1.6fr_1fr_1fr]">
          <div className="max-w-[36ch]">
            <p className="font-mono text-[0.8125rem] font-medium tracking-[0.22em] text-ink">{site.name}</p>
            <p className="mt-4 text-[var(--text-small)] leading-relaxed text-muted">
              Ingegneria di processi con AI per aziende manifatturiere in Lombardia.
              Misuriamo, riprogettiamo, consegniamo — con il controllo umano al centro.
            </p>
          </div>

          <nav aria-label="Pagine">
            <p className="label mb-4">Pagine</p>
            <ul className="flex flex-col gap-2.5">
              {nav.map((i) => (
                <li key={i.href}>
                  <Link href={i.href} className="text-[var(--text-small)] text-ink-2 transition-colors hover:text-accent">
                    {i.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Informazioni">
            <p className="label mb-4">Informazioni</p>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link href="/affidabilita" className="text-[var(--text-small)] text-ink-2 transition-colors hover:text-accent">
                  Dati e sicurezza
                </Link>
              </li>
              {legal.map((i) => (
                <li key={i.href}>
                  <Link href={i.href} className="text-[var(--text-small)] text-ink-2 transition-colors hover:text-accent">
                    {i.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-3 border-t border-rule py-7 text-[var(--text-micro)] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {site.name}</p>
          {/* Italian law requires P.IVA / REA here. Placeholder until the entity is registered —
              this must be filled before the site is used commercially. */}
          <p className="font-mono">P.IVA — da inserire · {site.domain}</p>
        </div>
      </Container>
    </footer>
  );
}
