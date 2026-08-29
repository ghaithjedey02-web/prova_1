# Deployment — dolmir.com

**Nothing in this document has been executed.** DNS changes are deliberately
left to a human: a wrong record here takes the company's email down, not just
the website.

---

## 1. Vercel project

| Setting | Value |
|---|---|
| Framework preset | Next.js |
| Root Directory | **repository root** (not `apps/web`) |
| Build Command | `npm run build:web` |
| Output Directory | `apps/web/.next` |
| Install Command | `npm install` (default — resolves the workspace) |
| Node version | 22.x |

Root Directory stays at the repo root because the site imports the workspace
packages (`@dolmir/rfq-engine` and friends). `npm run build:web` compiles those
first, then builds the app.

## 2. Environment variables

| Variable | Scope | Needed for | Status |
|---|---|---|---|
| `RESEND_API_KEY` | Server | Contact form delivery | **Not yet set — form returns 501 by design** |
| `ANTHROPIC_API_KEY` | Server | Future "paste your own RFQ" mode | Not needed for v1 |

Nothing in the site requires a `NEXT_PUBLIC_` secret. If one ever appears in a
diff, that is a bug.

## 3. DNS — what to configure, and in what order

**Do not copy DNS values from a tutorial or from memory, including from this
document.** Vercel displays the exact records when you add the domain in the
project's Domains tab. Those displayed values are the source of truth, and they
have changed historically.

The shape of the work:

1. **Export the current DNS zone before touching anything.** This is the undo button.
2. Deploy to the `*.vercel.app` URL first and verify the whole site there. Never
   point a live domain at an unverified deployment.
3. Add `dolmir.com` in Vercel → Domains. Vercel will show either an `A` record
   for the apex or an `ALIAS`/`ANAME` target. Prefer `ALIAS`/`ANAME` if the
   registrar supports it — it survives IP changes.
4. Add `www.dolmir.com` as a `CNAME` to the target Vercel shows.
5. Choose one canonical host and 301 the other. **Recommendation: apex
   canonical** (`dolmir.com`), `www` redirecting to it — it matches the
   `metadataBase` already set in `app/layout.tsx`.
6. **Leave MX records untouched.** Replacing a zone and taking email down with
   it is the single most common way this goes wrong.
7. Wait for the certificate to issue before announcing anything.

## 4. Email — keep it off the root domain

Phase 1 plans cold outreach from this domain. Sending cold email from the same
root domain that serves the site puts the site's domain reputation at risk.

- Send from a dedicated subdomain (for example `mail.dolmir.com`).
- Configure SPF, DKIM and DMARC **on that subdomain**.
- Warm it for two weeks at low volume before any campaign.

This costs nothing to do now and is expensive to undo later.

## 5. Before the site is used commercially

Blocking items, tracked here because they are legal rather than technical:

- [ ] **P.IVA and REA in the footer.** Currently a visible placeholder. An
      Italian commercial website is required to display these, and a prospect's
      accountant may well check.
- [ ] **Privacy, cookie and terms pages written by a professional.** They
      currently carry an honest placeholder rather than auto-generated text —
      a generated legal document is worse than none.
- [ ] **Contact form connected** (`app/api/contatto/route.ts`), with rate
      limiting and a spam check.
- [ ] Decide and document form-data retention, then state it in the privacy page.

## 6. Analytics

Not installed. When it is, use a **cookieless, EU-hosted** tool (Plausible or
Umami) so no consent banner is needed. A cookie wall on first paint costs trust
in the forty seconds this site actually gets, and that is a worse trade than the
data is worth.

The application is structured so events can be added later without refactoring:
CTAs are `Button`/`Link` components, and the demonstration's state transitions
are already discrete and named.
