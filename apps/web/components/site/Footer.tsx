import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { footerNav, legalNav, site } from '@/content/site';

/**
 * The footer of a company, not of a prototype.
 *
 * Four columns: who we are and how to reach us, what we do, the company's own
 * pages, and the legal set. Everything the top bar leaves out lives here,
 * which is what lets the navigation stay at four items.
 *
 * The company data block is deliberately explicit about what is missing. P.IVA
 * and the registered address are real legal identifiers: inventing them to
 * make a footer look finished would be a lie printed on every page, and in
 * Italy an actionable one. They are marked as pending and listed in
 * docs/DA-COMPLETARE.md until the real values exist.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-rule-strong bg-void">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-line to-transparent"
      />
      <Container>
        <div className="grid gap-x-10 gap-y-12 py-16 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] md:py-20">
          {/* identity + the one way to reach a person */}
          <div className="max-w-[40ch]">
            <p className="font-display text-[1rem] font-semibold tracking-[0.3em] text-ink">{site.name}</p>
            <p className="mt-5 text-[length:var(--text-small)] leading-relaxed text-ink-2">{site.description}</p>

            <div className="mt-7 flex flex-col gap-2">
              <a
                href={`mailto:${site.email}`}
                className="-my-2 inline-block self-start py-2 text-[length:var(--text-small)] text-ink underline decoration-rule-bright underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
              >
                {site.email}
              </a>
              <p className="text-[length:var(--text-micro)] text-muted">{site.region}, Italia</p>
            </div>
          </div>

          <nav aria-label="Cosa facciamo">
            <p className="label mb-5 text-ink-2">Cosa facciamo</p>
            <ul className="flex flex-col gap-3">
              {footerNav.map((item) => (
                <li key={item.href}>
                  <Link
                    className="-my-2 inline-block py-2 text-[length:var(--text-small)] text-ink-2 transition-colors hover:text-accent"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Azienda">
            <p className="label mb-5 text-ink-2">Azienda</p>
            <ul className="flex flex-col gap-3">
              <li>
                <Link className="-my-2 inline-block py-2 text-[length:var(--text-small)] text-ink-2 transition-colors hover:text-accent" href="/studio">
                  Chi siamo
                </Link>
              </li>
              <li>
                <Link className="-my-2 inline-block py-2 text-[length:var(--text-small)] text-ink-2 transition-colors hover:text-accent" href="/metodo">
                  Come lavoriamo
                </Link>
              </li>
              <li>
                <Link
                  className="-my-2 inline-block py-2 text-[length:var(--text-small)] text-ink-2 transition-colors hover:text-accent"
                  href="/affidabilita"
                >
                  Affidabilità
                </Link>
              </li>
              <li>
                <Link
                  className="-my-2 inline-block py-2 text-[length:var(--text-small)] text-ink-2 transition-colors hover:text-accent"
                  href="/contatto"
                >
                  Contatti
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Note legali">
            <p className="label mb-5 text-ink-2">Note legali</p>
            <ul className="flex flex-col gap-3">
              {legalNav.map((item) => (
                <li key={item.href}>
                  <Link
                    className="-my-2 inline-block py-2 text-[length:var(--text-small)] text-ink-2 transition-colors hover:text-accent"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Company data. What is not yet known says so. */}
        <div className="flex flex-col gap-4 border-t border-rule py-8 text-[length:var(--text-micro)] text-muted lg:flex-row lg:items-center lg:justify-between">
          <p>
            © {year} {site.name} — {site.legalName}
          </p>
          <p className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span>
              P. IVA: <span className="tnum text-ink-2">{site.vat}</span>
            </span>
            <span>{site.domain}</span>
          </p>
        </div>
      </Container>
    </footer>
  );
}
