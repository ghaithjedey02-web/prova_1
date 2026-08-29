# Phase 2 — Website Architecture Proposal

**Status:** FOR REVIEW. No implementation started.
**Date:** 2026-08-29
**Decision required before Phase 2 begins.** Open questions are listed in §13.

---

## 1. What I'm optimising for

Not a beautiful site. A site that survives this specific test:

> A 52-year-old owner of a 30-person machining shop in Brescia gets our cold
> email at 08:40. He searches "dolmir" on his phone before replying. He gives us
> about 40 seconds.

Every decision below is scored against that moment. It is also why several
things in the brief get pushed back on: some of them optimise for a different
visitor than the one we actually have.

---

## 2. Contradictions and weaknesses in the brief

Ten findings. The first four are material — they change what we build.

### W1 — The retainer price is very likely unsellable 🔴

The brief proposes **€2,000–4,000/month** ongoing. That is €24k–48k per year,
on top of an €18–30k implementation. Phase 1 modelled €600–1,500/month.

For scale: a full-time *impiegato* in Italy costs an employer roughly €35–45k
per year all-in. We would be asking a 30-person shop to pay more than a salaried
person, every year, for software that assists one workflow. In a segment
Phase 1 scored **6/10 on ability to pay**, that is a very hard conversation.

**Recommendation:**
1. Keep the audit anchor (€2,900) on the site.
2. **Do not publish monthly pricing in v1 at all.** Publishing a number we later
   have to cut is worse than publishing none — and we have zero data on what
   this segment will actually accept.
3. Revisit the retainer after the first three audits, with real evidence.

The architecture supports this: pricing lives in one data file, so publishing a
number later is a content change.

### W2 — "Case Studies" contradicts "never fabricate case studies" 🔴

The proposed sitemap includes Case Studies. We have zero clients. That page can
only be empty or dishonest, and an empty case-studies page is a *negative* trust
signal — it draws attention to the absence.

**Recommendation:** ship **Demonstrations** instead. Build the
`/casi-studio/[slug]` route and its data shape now; keep it out of the
navigation and out of the sitemap.xml until a real one exists (planned week 13
of the 90-day plan).

### W3 — The demo is workflow-specific, but the workflow is explicitly not locked 🔴

This is the biggest engineering risk in the brief, and the brief itself creates
it: §1 says we are still validating the workflow, §13 says build the interactive
demonstration now. The demo is the most expensive asset on the site. Phase 1
also set explicit falsification triggers that could retire RFQ→preventivo after
20 discovery calls.

**Recommendation — and this is the single most important architectural decision
in the project:** the demo is not an RFQ demo. It is a **data-driven workflow
player**. A workflow is a configuration object — stages, field schema, sample
documents, copy, outcomes. RFQ→preventivo is the first configuration.

Switching to order-entry or document-chasing then costs *authoring a config
file*, not rebuilding the centrepiece. This also delivers §23 (future expansion)
for free.

### W4 — Cinematic spectacle may work against this specific buyer 🟠

Phase 1 established who we are selling to: an owner who has been cold-called by
three "digital transformation" vendors this year. For that person, heavy 3D and
cinematic video carry a real risk of reading as *"expensive agency that will
overcharge me and disappear"* — the exact objection we need to pre-empt.

**This is not an argument for a plain site.** It is an argument about where the
premium budget goes. My proposal: the site reads as **engineered, not
cinematic**. The sophistication shows in precision, restraint, typographic
control, and one perfectly-executed interactive moment — not in a showreel.

The 3D stays, because the brief is right that it needs a conceptual reason, and
I have one (§8). But it *explains the product* rather than decorating the page.

**Concrete hedge:** the hero is static-first with motion layered on top, so we
can dial spectacle up or down after the first ten prospect reactions without
touching structure.

### W5 — The real risk is polishing instead of calling 🟠

The decision to build the site now is correct, and I agree with it. The failure
mode is not building it — it is spending three weeks refining it instead of
picking up the phone. Phase 1 has the site live in week 3 with outreach starting
the same week.

**Recommendation:** hard-freeze after Phase 2 Day 4 and start outreach. After
that, only iterate on evidence from actual prospect reactions — not on taste.

### W6 — Language is never specified 🔴 (blocking)

The brief does not say whether the site is Italian or English. The buyer is
Italian and, in this segment, often not comfortable in English. This is an
architecture decision — it determines routing — and it must be made before any
code.

**Recommendation: Italian primary**, English secondary at `/en`, with `hreflang`.
Italian URLs (`/metodo`, `/dimostrazione`) because it helps Italian search and
signals we are local rather than a foreign vendor.

### W7 — Legal identity is unaddressed 🔴 (blocking)

An Italian commercial website is legally required to display P.IVA and REA
details. Is DOLMIR incorporated yet? Outbound sales will expose this
immediately — a prospect's *commercialista* may well check.

If there is no P.IVA yet, that is a launch blocker to resolve, not a footer
detail.

### W8 — Nothing specifies what happens after the CTA 🟠

The brief covers CTA wording but not the machinery: which booking tool, where
form submissions land, the GDPR consent copy, the autoresponder. A CTA that
leads to a dead form silently kills the outbound campaign — and we would not
find out for weeks.

### W9 — Website and cold-email share one domain 🟠

Phase 1 plans cold outreach from dolmir.com. Sending cold email from the same
root domain that serves the site puts the root domain's reputation at risk.

**Recommendation:** send from a dedicated subdomain with its own SPF/DKIM/DMARC,
warmed for two weeks. Insulates the root domain. Costs nothing to do now,
expensive to fix later.

### W10 — "Days of iteration" requires tokens-first, or it becomes find-and-replace 🟡

The brief wants repeated design iteration. That only stays cheap if **no colour,
spacing, radius, duration or type size is ever hard-coded in a component.**
Non-negotiable rule from Day 1.

---

## 3. Improvements to the business/website architecture

Beyond fixing the above:

1. **The demo runs the real engine.** See §9 — this is the strongest available
   answer to "it should not be a fake chat window."
2. **A "what we don't do" section.** Phase 1 identified this as the highest-trust
   element available to us. Stating limits plainly is the fastest route to being
   believed about everything else.
3. **A real human on the About page.** For an Italian SME buyer this matters more
   than any design decision on this list. A named person with a face and a
   background beats "a team of AI experts" — which reads as either offshore or
   fictional.
4. **Cookieless analytics.** A cookie banner on first paint costs trust in the
   40-second window. Plausible/Umami (EU-hosted, no consent required) removes
   the banner entirely. Real conversion benefit, not a compliance detail.
5. **Fewer nav items than the brief proposes.** See §5.

---

## 4. Proposed technology stack

Verified latest stable versions as of 2026-08-29.

| Layer | Choice | Version | Why this, specifically |
|---|---|---|---|
| Framework | **Next.js** App Router | 16.3.3 | Static-first output, image pipeline, metadata API, Vercel-native. Nothing else gets us SEO + performance + iteration speed together. |
| UI | **React** | 19.2.8 | Required by Next 16. |
| Language | **TypeScript** | 7.x — *verify Day 1* | TS 7 is the new native compiler and is very fast, but it is new. **Day 1 task: confirm Next 16 + ESLint plugins are clean on 7.x; fall back to 5.9 if anything lags.** Not a decision to make from memory. |
| Styling | **Tailwind CSS** | 4.3.3 | v4's CSS-first `@theme` means the design tokens *are* the utility layer — one artifact, not two that drift. This is why Tailwind rather than CSS Modules. |
| Animation | **Motion** | 13.1.1 | Component animation, layout transitions, scroll reveals, `prefers-reduced-motion` built in. |
| Scroll narrative | **GSAP + ScrollTrigger** | 3.15.0 | ⚠️ **Conditional.** Motion handles reveals fine. GSAP is materially better for *pinned, scrubbed, multi-step* timelines. Start with Motion only; adopt GSAP only if the pinned workflow section proves inadequate — a named trigger, not a default. |
| 3D | **three / R3F / drei** | 0.185.1 / 9.7.0 / 10.7.8 | One section only. Dynamically imported, never in the main bundle. |
| Content | **MDX** | — | Insights posts as files. No CMS: there is no non-technical editor yet, so a CMS is pure overhead. Revisit when someone other than us writes. |
| Forms | **Server Actions + Resend** | — | No client-side key exposure, no third-party form host holding prospect data. |
| Booking | **Cal.com** embed | — | EU data residency option, self-hostable later, cheaper than Calendly. |
| Analytics | **Plausible or Umami** + Vercel Analytics | — | Cookieless → no consent banner. See §3.4. |
| Testing | **Playwright** + Lighthouse CI | — | One E2E path (the demo) and a performance budget enforced in CI. |

### Deliberately rejected

| Rejected | Reason |
|---|---|
| **shadcn/ui** | We want a distinctive identity. shadcn is instantly recognisable and would make us look like every other 2026 startup. |
| **A CMS (Sanity/Contentful)** | Premature. No non-technical editor exists. |
| **Redux / Zustand** | No global state worth a library. Demo state is local. |
| **Storybook** | Real cost, no benefit for a one-developer project. |
| **A UI component library** | Would fight the design system rather than serve it. |
| **Webflow / Framer** | Cannot run the real engine in the demo. That alone disqualifies them. |

---

## 5. Proposed sitemap

**Critique of the proposed structure:** ten top-level sections for a company with
one workflow and zero clients dilutes rather than broadens. `SOLUTIONS` and
`INDUSTRIES` would each be a near-empty page — and a page that says "we serve
manufacturing" and little else makes us look *thin*, not established. Depth in
five places beats breadth across ten.

### Shipped in v1 — five nav items

| Route | Page | Job |
|---|---|---|
| `/` | Home | The narrative. Recognition → understanding → proof → contact |
| `/metodo` | Method | How we work: audit → implementation → ongoing. Absorbs what "Solutions" would have said |
| `/dimostrazione` | Demonstration | The interactive workflow player. The crown jewel |
| `/studio` | About | Who we actually are. A real person |
| `/contatto` | Contact | Booking + form |

### Shipped, footer only

`/affidabilita` (security & trust) · `/note` (insights — **only if 3 real pieces
exist at launch**; an empty blog dates the site instantly) · `/legale/privacy` ·
`/legale/cookie` · `/legale/termini`

### Routes built, not shipped

`/settori/[slug]` · `/casi-studio/[slug]` · `/soluzioni/[slug]`

The data shapes and route patterns exist so vertical #2 is a content file, not a
restructure. They stay out of nav and out of `sitemap.xml` until real.

**Pricing:** per W1, no `/prezzi` page in v1. The €2,900 audit anchor appears
inside `/metodo`.

---

## 6. Homepage narrative

Nine scenes. Each has one job; if a scene has two, it gets split.

| # | Scene | Job | Treatment |
|---|---|---|---|
| 1 | **Recognition** | He sees his own inbox | Headline names the problem in his words, not ours. Static-first, motion layered |
| 2 | **The hidden cost** | Make the invisible visible | A quiet, precise data moment: where the hours actually go. **Labelled illustrative** |
| 3 | **What we do** | Three beats | Find the workflow → engineer the system → hand it over measured |
| 4 | **The workflow, shown** | Understanding without reading | The scroll-driven 3D centrepiece (§8) |
| 5 | **Try it** | Proof | Inline entry to the live demo — not a link to a link |
| 6 | **What we don't do** | Trust | The highest-trust element we have. Plain list, no decoration |
| 7 | **The method** | Reduce risk | Audit → Implementation → Ongoing. Small commitment first |
| 8 | **Who we are** | Human | Real name, real face, real background |
| 9 | **One CTA** | Convert | Single action |

**On CTA wording** — analysed against the business model: *"Prenota una call"* is
generic and commits to nothing. *"Richiedi un audit"* asks for €2,900 too early.
The strongest is the one Phase 1 validated in the outreach templates: an
invitation to show us something.

**Primary CTA: "Mandaci un vostro processo"** (send us one of your workflows) —
low commitment, high signal, and it starts the conversation on their material
rather than our pitch. Secondary, in the header only: *"Parliamone — 15 minuti."*

---

## 7. Design direction

**North star: an engineering document, not a marketing site.**

Reference world — drawn from the buyer's own environment, not from other AI
companies: precision instrument catalogues, engineering drawings, measurement
tools, industrial control panels.

| Element | Direction |
|---|---|
| **Palette** | Cool graphite and steel neutrals; an off-white that reads as drafting paper; **one** steel-blue accent; oxide amber reserved strictly for attention/warning states, never decoration. Continuous with the Phase 1 founding brief, so our documents and our site look like one company. |
| **Explicitly avoided** | Purple/violet AI gradients · warm cream + terracotta · glassmorphism · dark-mode-with-one-neon-accent · Inter and Space Grotesk as defaults |
| **Type** | Two candidate systems — **your call, Day 1**. See below. |
| **Motion** | *Mechanical, not bouncy.* Machined ease curves, no spring overshoot, no playful bounce. Movement should feel like a linear actuator, not a beach ball. This one rule does more for the positioning than any colour choice. |
| **Grid** | A visible measurement system. Hairline rules as structure, echoing a drawing sheet. Generous whitespace. |
| **Imagery** | Higgsfield: cool north light, real industrial environments, no people in v1 (avoids the fake-stock-human problem), no glowing tech overlays. Modular — swapping assets must never require code changes. |
| **Dark mode** | Supported, designed — not an inverted afterthought. |

### Type — pick one on Day 1

**Option A — "Technical Editorial" (my recommendation).** A high-contrast
display serif for headlines against a neutral technical sans for body, plus a
mono for data and labels. Reads as *considered and documentary*. Rare in this
sector, which is the point.

**Option B — "Instrument".** A single wide grotesque across display and body at
different optical sizes, plus a mono. Reads as *precise and industrial*. Safer,
slightly more familiar.

Both avoid the flagged defaults. I'll bring specific families for each once you
pick a direction.

---

## 8. The 3D concept — "The Line"

**The conceptual reason:** it is literally the product's architecture. Phase 1
established the Document-to-Decision pipeline; the 3D *is* that pipeline, made
spatial.

A single continuous line — one request — travels through the system as the
visitor scrolls. The camera follows it through five stations:

| Station | What it looks like | What it says |
|---|---|---|
| 1. Arrival | Chaotic, paper-like unstructured geometry | "This is what lands in your inbox" |
| 2. Extraction | The chaos resolves into an ordered lattice of fields | "This is what we pull out of it" |
| 3. Validation | Some nodes glow amber and are pulled aside | "It knows what it isn't sure about" |
| 4. **Human approval** | **The line stops. A gate. It only continues after** | The whole positioning, in one beat |
| 5. Result | Clean, resolved, single form | "This is what comes out" |

Station 4 is the reason to build this at all. **Pausing the animation to wait for
a human is the most on-message thing 3D could possibly do on this site** — the
visitor physically feels that the system does not act alone.

### Fallback ladder — all three convey the same information

1. **Full 3D** — desktop, capable GPU, motion allowed
2. **Scroll-scrubbed 2D canvas/SVG** — mobile and mid-tier devices
3. **Static annotated diagram** — `prefers-reduced-motion`, no JS, print

**Budget:** 3D chunk ≤200KB gzipped, dynamically imported, never blocking first
paint. Instanced geometry, no imported models, no post-processing stack. If it
cannot hit that budget it ships as tier 2 and we lose nothing that matters.

---

## 9. Interactive demonstration architecture

### The central idea: it runs the real engine

`packages/rfq-engine` already exists from Phase 1 — `classify`, `extract`,
`triage`, `findComparables`, `buildDraft`, confidence gating, the review queue.
The website **imports it**.

This is the honest answer to "not a fake chat window": the demo is not a
simulation of the product, it *is* the product with sample inputs. It is also
why the monorepo (§10) matters — a separate repo would force us to either
duplicate the logic (which drifts, and then the demo becomes a lie) or publish a
package (overhead we do not need).

### Two modes

**Mode 1 — canned samples (default).** `MockProvider`, client-side. Instant,
free, deterministic, works offline. Five sample emails including the awkward
ones — the vague enquiry and the purchase order — because a demo where
everything succeeds is not credible to someone who has watched software fail.

**Mode 2 — "paste your own" (highest conversion, highest risk).** Server Action →
real provider, rate-limited, bot-protected. Requires: an explicit data-handling
notice *before* the textarea, no retention, and a clear statement of what is
sent where. These are their customers' technical documents. Being casual here
loses the deal in one sentence.

Mode 2 is a Day 3 stretch goal, not a Day 3 requirement.

### The player is workflow-agnostic (per W3)

```
WorkflowDefinition {
  id, name, description
  stages[]        { id, label, description, kind }
  fieldSchema     { name → { label, type, confidenceFloor } }
  samples[]       { document, expectedOutcome }
  copy            { it, en }
}
```

`rfq-preventivo` is the first definition. A second workflow is a new file.

### UI

Split view. Left: the incoming document. Right: the pipeline advancing stage by
stage, fields populating with visible confidence, the review queue filling. It
ends on the **human approval step with a real approve/edit control** — the
visitor performs the approval themselves.

**The refusal case gets equal billing.** One sample returns no price and says
why. Phase 1 found this to be the strongest trust moment in the terminal demo;
it should be the strongest moment here too.

**Non-negotiable:** labelled *"Dimostrazione — dati di esempio"* throughout ·
fully keyboard accessible · works with no WebGL · reduced-motion path · a
recorded 3-minute video fallback for meetings.

---

## 10. Repository architecture

**Recommendation: keep the existing monorepo, add `apps/web`.**

```
dolmir/
├── apps/
│   └── web/                  Next.js site
│       ├── app/              routes (it default, /en secondary)
│       ├── components/       page-level composition
│       ├── lib/
│       └── public/
├── packages/
│   ├── ai-core/              ← existing, unchanged
│   ├── rfq-engine/           ← existing. The demo imports this.
│   ├── prospecting/          ← existing, internal tooling
│   ├── design-system/        NEW — tokens + primitives
│   └── workflows/            NEW — WorkflowDefinition configs
├── content/                  MDX insights
├── docs/                     ← existing strategy docs
└── data/                     ← existing prospect data
```

**Why monorepo:** the demo's credibility depends on running the real engine, and
the monorepo makes that a compile-time guarantee rather than a promise.

**Tooling:** keep npm workspaces. **Do not add Turborepo yet** — one app does not
justify it. Add it when build times actually hurt.

### 🔴 Repository naming — needs your decision

The repo is currently **`ghaithjedey02-web/prova_1`**. That name will appear in
Vercel, in deployment URLs, and potentially in anything we share with a
prospect or a developer.

**Recommendation:** rename to `dolmir` (GitHub redirects the old URL
automatically, so nothing breaks). Alternative: create a fresh `dolmir` repo and
migrate. I need you to authorise one of these.

---

## 11. Deployment architecture

```
GitHub (main)  →  Vercel (production)  →  dolmir.com
GitHub (PR)    →  Vercel (preview)     →  <hash>.vercel.app
```

Vercel project root: `apps/web`, with workspace-aware install.

### DNS — what needs configuring, to be done deliberately

**I am not going to hand you DNS records from memory.** Vercel's apex IP and
CNAME targets change, and stale values from tutorials are a common cause of
broken production domains. Use exactly what the Vercel dashboard displays when
you add the domain.

The shape of it:

1. **`dolmir.com` (apex)** — an A record, or ALIAS/ANAME to Vercel's CNAME target
   if the registrar supports it (preferred where available).
2. **`www.dolmir.com`** — CNAME to Vercel's target. Pick one canonical host and
   301 the other. Recommendation: apex canonical.
3. **⚠️ Do not touch MX records.** The single most common way to break a company
   is replacing a DNS zone and taking email down with it. Export the current zone
   before any change.
4. **Email authentication** — SPF, DKIM, DMARC. Per W9, add a dedicated sending
   subdomain for cold outreach so the root domain's reputation is insulated.

**Sequence:** deploy to `*.vercel.app` first → verify → then attach the domain.
Never point DNS at something not yet verified.

### Environment variables

| Variable | Scope | Purpose |
|---|---|---|
| `ANTHROPIC_API_KEY` | Server only | Demo mode 2. Never `NEXT_PUBLIC_` |
| `RESEND_API_KEY` | Server only | Contact form |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Public | Analytics |
| `RATE_LIMIT_*` | Server only | Demo abuse protection |

---

## 12. Missing — things that would materially improve DOLMIR

Ranked by impact.

| # | Gap | Why it matters | Proposal |
|---|---|---|---|
| 1 | **Language strategy** | Blocks routing. Buyer is Italian | Italian primary, `/en` secondary |
| 2 | **Legal entity / P.IVA** | Legally required in the footer; prospects check | Confirm status before launch |
| 3 | **Post-CTA machinery** | A dead form silently kills the campaign | Cal.com + Resend + GDPR consent + autoresponder, all on Day 2 |
| 4 | **Email/domain separation** | Cold outreach can burn the root domain | Dedicated sending subdomain, warmed |
| 5 | **A real named person** | Decisive for Italian SME trust | Name, photo, background on `/studio` |
| 6 | **Performance budget as a CI gate** | Otherwise "fast" is an aspiration | LCP < 1.8s on 4G, JS < 180KB initial, CLS < 0.05 — enforced in CI, build fails |
| 7 | **Accessibility target stated** | Cheap now, expensive to retrofit | WCAG 2.2 AA |
| 8 | **Content plan for `/note`** | An empty blog dates the site | Three real pieces at launch, or don't ship the section |
| 9 | **404 / error / empty states** | Always forgotten, always noticed | Designed, not default |
| 10 | **OG images** | Every LinkedIn and WhatsApp share | Generated per route via `next/og` |
| 11 | **A print stylesheet** | Owners print things. Genuinely | Low cost, disproportionate signal |

---

## 13. Phased implementation plan

Four days. Each day ends with something deployed and viewable — no day ends with
work only visible on my machine.

### Day 1 — Foundation and design system
Monorepo restructure · Next 16 + Tailwind 4 token layer (**tokens = the design
system, no hard-coded values anywhere**) · typography decision locked · layout
shell, nav, footer · legal pages · Vercel connected, preview deploying.
**Verify TypeScript 7 compatibility early; fall back to 5.9 if the ecosystem lags.**
→ *Deliverable: a real URL with the design system visible.*

### Day 2 — Narrative and content
Homepage scenes 1–3 and 6–9 (everything except the 3D centrepiece) · `/metodo` ·
`/studio` · `/contatto` with working form and booking · Italian copy · SEO
foundation, sitemap, robots, structured data, OG images.
→ *Deliverable: a complete, honest, shippable site without the showpiece. If we
stopped here, we could still start outreach.*

### Day 3 — The demonstration
Workflow-player architecture · wire to `@dolmir/rfq-engine` · the RFQ config ·
confidence and review-queue UI · the refusal case · mobile layout · keyboard and
screen-reader passes · "paste your own" if time allows.
→ *Deliverable: the crown jewel.*

### Day 4 — Signature 3D, polish, production
"The Line" + full fallback ladder · motion pass · Lighthouse and Core Web Vitals
against the budget · cross-device testing · Higgsfield asset integration · DNS
cutover.
→ *Deliverable: production on dolmir.com.*

### Then: freeze and go sell
Per W5. Iterate only on real prospect reactions.

---

## What I need from you to start

**Blocking:**
1. **Language** — confirm Italian primary?
2. **Repository** — rename `prova_1` → `dolmir`, or create fresh?
3. **Legal entity** — does DOLMIR have a P.IVA yet?
4. **Pricing** — agree to publish the €2,900 audit anchor only, and hold monthly
   pricing until we have evidence? (W1)
5. **Type direction** — Option A (technical editorial) or B (instrument)?
6. **`/studio`** — whose name, photo and background go on the About page?

**Needed by Day 2:** Vercel account access · a Cal.com or Calendly account ·
domain registrar access (do not change anything yet).

**Assumed unless you say otherwise:**
- No case-studies page until a real client exists
- No monthly pricing published in v1
- `/note` ships only if three real pieces exist
- Site freezes after Day 4
