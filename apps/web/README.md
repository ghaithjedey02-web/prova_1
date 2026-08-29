# @dolmir/web

The public site — Italian first, five routes, one interactive demonstration.

## Run

```bash
npm run dev        # from the repo root: builds workspace packages, then next dev
npm run build:web  # production build
npm run start:web  # serve the production build
```

Always run from the repo root: the site imports `@dolmir/rfq-engine`, which has
to be compiled first.

## Layout

| Path | What it holds |
|---|---|
| `app/globals.css` | **The design system.** Colour, type, spacing, radius and motion tokens for both themes. |
| `content/site.ts` | **All visible copy.** Change a sentence here, not in a component. |
| `components/home/` | Homepage scenes, one file per scene |
| `components/line/` | "The Line" — 3D, 2D canvas and static tiers |
| `components/demo/` | The workflow player |
| `lib/capability.ts` | Chooses the fidelity tier for The Line |

## Two rules

**1. No component hard-codes a colour, spacing step, radius, duration or type
size.** Everything comes from the tokens in `globals.css`. This is what keeps
design iteration cheap rather than a find-and-replace exercise.

**2. The demonstration runs the real engine.** `components/demo/WorkflowPlayer`
imports `@dolmir/rfq-engine` — the same code that ships to clients. It is not a
scripted animation. If that ever stops being true, the page's central claim
becomes a lie.

## The Line — fidelity tiers

`lib/capability.ts` picks one, conservatively: anything we cannot positively
confirm falls back a tier.

| Tier | When | File |
|---|---|---|
| `three` | Desktop, WebGL, motion allowed | `LineScene.tsx` (lazy, ~229KB gz, never in the initial payload) |
| `canvas` | Narrow screens, low memory, few cores, no WebGL | `LineCanvas2D.tsx` |
| `static` | `prefers-reduced-motion`, or before hydration | `LineStatic.tsx` |

All three carry the same five-station argument. Nothing about the proposition
depends on being able to render animation.

## Performance budget

Measured on the production build:

- Initial homepage JS: **~179 KB gzipped**
- `three` chunk: excluded from the initial payload, loaded only on tier `three`
- No vendor AI SDK in any client chunk — enforced by the subpath exports in
  `@dolmir/ai-core`

If a change pushes initial JS materially past ~180 KB gz, that is a regression
worth reverting rather than accepting.
