# Design research — what makes the references work, and what DOLMIR takes

Studied on 2026-09-02 with a real browser at 1440 px and 390 px, reading
computed styles (type, weights, spacing, surfaces, buttons, section rhythm)
rather than impressions. Linear is the primary reference; the others are read
for one thing each. Nothing here is copied — the point is the principles, and
the last section is the DOLMIR system that follows from them.

## Linear — product clarity, hierarchy, execution

Measured: ground `rgb(8,9,10)`; Inter Variable at weight **510** with tight
negative tracking (64 px / −1.4 px on the h1, 48 px on section heads, 24 px on
mobile); one reading size of 15–16 px at 24 px line-height; a 1344 px content
measure; section padding of 128 px top and bottom; 227 inline SVGs and **zero
video** — the product is drawn, live, in the page. The first screen is one
sentence ("The product development system for teams and agents"), one short
lead, two actions, then the product itself. Every later section opens with a
48 px head and a *real* piece of interface, not an illustration of one.

What transfers:
- **One reading size, one display weight.** The hierarchy comes from size and
  colour, not from mixing fonts. Body copy is short and never competes with
  the product.
- **Product as the illustration.** Nothing decorative stands in for the
  interface. If a section is about intake, you see intake.
- **Rhythm you can predict.** Equal section padding, one measure, headline →
  product → three short notes. The page reads like a document.
- **Restraint in colour.** Near-black ground, grey text ladder, one accent used
  for state, never for mood.
- **Motion that explains.** Small state transitions inside the product frames;
  no parallax, no floating.

## Attio — business context and data relationships

Measured: light ground (`lab(99.99…)`), interDisplay 600 at 64 px, section
heads at 40 px / 500, JetBrains Mono for data, **104 images and 444 SVGs** of
real records, tables and relationship graphs; long sections (6,479 px) that are
one continuous product demonstration; dark blocks (`lab(4.68)`) used as
punctuation between light ones.

What transfers:
- **Records, not metaphors.** Customers, orders, invoices drawn as the rows and
  fields they are, with the relationships between them made visible.
- **Alternating surfaces as chapter breaks** — a page does not have to be one
  colour to feel like one system.
- **Mono for data, sans for prose**, and never the reverse.

## Clay — workflow visualisation and data → action

Measured: Roobert at 575 (88 px h1, 72/44 px heads), warm off-white paper
(`rgb(255,253,249)`), a deep green hero block, **336 images and 9 videos**:
every capability is shown as a flow with inputs on the left and outcomes on the
right, and a "What do you want to build?" section that lets the visitor pick a
workflow and see it drawn.

What transfers:
- **Causality drawn left-to-right.** Input → step → step → outcome, with the
  data visibly moving between them.
- **Pick your own process.** Interactivity that changes the *content* of the
  same shape, so the visitor recognises their case.
- **Outcomes as checklists** ("CRM updated", "quote prepared") rather than
  adjectives.

## ElevenLabs — AI interaction and aliveness

Measured: near-white ground, Waldenburg at weight **300** (48 px, light and
airy), Inter 16 px body, Geist Mono for labels, pill buttons, 3 canvases used
for the live voice/waveform demos; the hero itself is a tabbed product demo you
can operate.

What transfers:
- **Let the visitor operate the AI in the first screen** — the demo is not
  below the fold and not a video.
- **Aliveness as measurement:** waveforms that respond to real audio, states
  that change because something happened. Never an animation that would play
  the same in a silent room.
- **Light display weights read as calm**, which is what a voice product needs.

## Anthropic — trust, restraint, maturity, typography

Measured: warm paper ground `rgb(250,249,245)`, Anthropic Sans 700 for the h1
(61 px) and a **serif** lead at 24 px / 33.6 px; only 43 SVGs, one video, no
stock imagery; short page (3,316 px); dark footer as the single dark block.

What transfers:
- **Say less, in larger type.** Editorial pacing: a claim, a paragraph, air.
- **Warmth without colour** — off-white instead of white, ink instead of
  black, so nothing glows.
- **No performance theatre.** Trust comes from what is *not* on the page.

## Vercel — technical precision, motion, performance

Measured: `rgb(250,250,250)` ground, Geist Sans at 400 with heavy negative
tracking (64 px / −3.84 px), Geist Mono for the lead, 6 px radii, 1 px
`box-shadow` rings instead of borders, 1392 px measure, sections that are
product diagrams with precise hairlines.

What transfers:
- **Hairline discipline.** One-pixel rings and rules carry the structure;
  nothing needs a drop shadow.
- **Tracking as a tool.** Tight display tracking reads as engineered.
- **Diagrams are live.** The infrastructure is drawn with the same primitives
  as the interface.

## Second inspection (final design pass) — composition, measured

Re-opened on 2026-09-02 with a real browser, reading geometry rather than
styles this time.

| site | h1 | first product visual | gap below h1 | notes |
|---|---|---|---|---|
| Linear, 1440 | 64 px, left, spans the measure (1282 px) | full-bleed image, 1440 × 804 | 91 px | 560 animated elements, 22 mask fades; mobile h1 38 px, product image later |
| Attio, 1440 | 64 px, centred | 74 % wide | 273 px | 6 sticky regions; long single-flow product sections |
| Clay, 1440 | 88 px, left | full width | 120 px | "what do you want to build" picker |
| ElevenLabs, 1440 | 48 px light | operable demo in the hero | — | pill buttons, canvases for live audio |
| Vercel, 1440 | 64 px, tight tracking | 64 % wide | — | mono lead, 6–8 px radii, hairline rings |
| Anthropic, 1440 | 61 px | canvas, 89 % wide | 122 px | serif lead, warm paper |

The lesson that changed DOLMIR's hero: the headline takes the whole measure
and **the product arrives immediately underneath, as wide as the page**, at
about a headline's height of distance. A two-column hero halves the
product; a stacked hero makes it the largest thing on the first screen.
DOLMIR's stage is therefore full width: three surfaces of the operational
layer side by side — what arrives, what DOLMIR makes of it, what comes out —
with one request walking across them and a dot travelling the rail each
time the information moves on. On phones the same three surfaces stack and
the one the story is on opens, the others fold to their header.

The second lesson (Attio) became chapter 03: the relationships between
records drawn as the boxes they are, with hairlines measured after layout
and the one relation that matters — new request versus previous quotation —
in amber, labelled.

## What DOLMIR is not allowed to borrow

Pill buttons and 12 px radii (Linear, Clay, ElevenLabs) — DOLMIR's corners
stay near-square, it is an industrial object. Light grounds as the default
(Attio, Clay, ElevenLabs, Anthropic, Vercel) — DOLMIR is dark, because it is
a system you look *into*; light is used as punctuation, never as the ground.
Customer walls and figures — DOLMIR has none it can prove, so there are none.

## The DOLMIR system that follows

**Identity.** Italian, industrial, precise, calm, human-controlled. The visual
reference remains a well-lit machine shop at night: near-black ground, one cold
light, hairlines like a drawing sheet, one instrument colour for readings and
one warm colour for the moment a person must decide.

**Type.** Archivo for display (600, −0.03 em), Instrument Sans for reading,
IBM Plex Mono only for what the machine produced or measured. Scale:
display-xl 40→68 px, display-l 31→48 px, display-m 26→37 px, display-s 20→26
px, body 17 px, small 15 px, micro 13 px, label 12 px. One reading size per
context; hierarchy through size, weight and the ink ladder, never through a
second font.

**Surfaces.** Five depths — void, ground, surface, raised, elevated — and they
are used as chapter punctuation: the hero and the product chapters sit on
ground; the problem, the case and the trust chapters sit on surface; product
frames are raised with a one-pixel top highlight and a `rule-strong` edge.
Not every pixel is black.

**Colour as meaning.** Ink ladder for prose; `accent` (cyan) = information and
the system at work; `good` (green) = VERIFICATO; `amber` = CONFLITTO,
NON DETERMINATO, DECISIONE RICHIESTA and APPROVAZIONE UMANA — everything that
means "the system stopped for a person". Nothing else is coloured. No
gradients as decoration, no glow, no rainbow states.

**Product frames.** The interface is the illustration. Every chapter shows a
believable piece of DOLMIR — inbox rows, extracted fields with their source,
verification lines, a conflict, a decision card with APPROVA / REVISIONA, an
action list with ticks — drawn with the same primitives as the real console,
on believable Italian business data that is declared as simulated.

**Motion.** Entrance reveals of 18 px / 520 ms; product state transitions of
280 ms; a scene clock that steps a product frame through its states so the
visitor sees causality (arrives → read → verified → conflict → person →
action). No parallax, no infinite floating, no decorative loops; everything
stops under `prefers-reduced-motion` and renders its most informative frame.

**Buttons.** Two: primary (accent fill, accent-ink text) and secondary (1 px
`border-ui`, ink text); 4 px radius, 44 px minimum height, arrow that moves on
hover, 1 px downward press. Labels are verbs.

**Rhythm.** One measure (108 rem), one gutter, section padding
`clamp(4rem, 7.5vw, 8rem)`, each chapter opened by index + label + headline
+ one lead, then the product, then at most three short notes. Each chapter
answers one question.

**Mobile.** The same chapters, stacked; product frames reflow to one column and
never scale down below readable size; tap targets ≥ 40 px; the console keeps
the transcript, input and evidence chips in one column with the system panel
folded into the answer.
