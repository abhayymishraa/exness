# Exness design system

One dark theme, one accent, one type pairing. Every surface is a variation on
the same material language; nothing here is per-page invention.

## Design read

Precision instrument for people reading live numbers. Dark-locked, because the
product is a terminal and a light marketing page bolted onto a dark app reads as
two products. Dials: **variance 6, motion 4, density 6** on the app surfaces;
variance 7, motion 6, density 3 on the landing page.

## Tokens

Declared once in `frontend/src/index.css` under Tailwind v4 `@theme`, so every
value below is a real utility (`bg-surface`, `text-ink-dim`, `border-line`).

| Token | Value | Job |
|---|---|---|
| `base` | `#0a1216` | page ground |
| `surface` | `#101b20` | panels |
| `raised` | `#16232a` | hover, active, skeletons |
| `sunken` | `#071013` | inputs, recesses |
| `line` | `#1e2e35` | hairlines, dividers |
| `line-strong` | `#2b3f49` | ghost-button edges |
| `ink` / `ink-dim` / `ink-faint` | `#e6eef1` / `#93a7b0` / `#5f747d` | text ladder |
| `accent` | `#158bf9` | the only accent |
| `long` / `short` | `#1fb26a` / `#eb483f` | **data, not decoration** |

**The long/short rule.** Green and red encode direction. They never decorate.
This is why the account page departs from the industrial-brutalist archetype's
mandated Aviation Red accent: on a screen where people read P&L, an accent that
shares a colour with "you are losing money" collides with meaning.

## Type

`Geist` for prose, `Geist Mono` for every figure. Numbers carry
`font-variant-numeric: tabular-nums` via `.num` so digits do not jitter as live
prices tick. Headlines: `-0.03em` tracking, `1.05` leading, `text-wrap: balance`.
Small caps labels (`.label`) are the only place positive tracking appears.

## Material

- Panels are **a hairline plus a surface shift**, never a drop shadow. Shadows on
  a dark ground make mud.
- Dividers are made with `gap-px` over a `bg-line` parent, so the 1px gaps *are*
  the dividers and no cell carries its own border.
- Radius is 4px app-wide, **0px** inside `.tty` (the account surface).

## Motion

Entry only, one orchestrated pass per surface. `cubic-bezier(0.32, 0.72, 0, 1)`,
600–850ms, `once: true`. Scroll reveals resolve out of a 6px blur so content
arrives with mass. Everything collapses to static under `prefers-reduced-motion`,
including the `FlickeringGrid`, which unmounts entirely.

Never `window.addEventListener('scroll')`. Motion values, `whileInView`, or CSS.

## Surfaces

| Surface | Language | Why |
|---|---|---|
| `/` landing | premium editorial, generous rhythm, kinetic CTAs | marketing; it has to seduce |
| `/trading` | dense instrument, hairline compartments | product; it has to disappear |
| `/account` (`.tty`) | tactical telemetry: mono, 0px radius, scanlines, ASCII framing, one macro numeral | an account is a readout, not a dashboard |
| `/signin`, `/signup` | split shell, quiet fact rail | the form is the whole job |

## Imagery

Every image is real. The clay-diorama world is generated from one shared style
preamble carrying these exact tokens, so the art and the UI share a palette by
construction. The product shot is a genuine screenshot of the running terminal.
No div-built fake UI, no hand-rolled decorative SVG, no stock.

Decorative art is masked with a radial gradient so it dissolves into the surface
rather than hard-cutting at a container edge.

## Icons

`react-icons` Phosphor set (`react-icons/pi`), already a dependency. One family.
Never hand-rolled paths.

## Hard rules

- Zero em-dashes in any user-visible string.
- One accent. Data colours are not accents.
- No invented figures: every number on screen comes from the API or is labelled.
- Money always renders two decimals with thousands separators.
- Buttons state their action; a number is never secretly a link.
- `min-h-dvh`, never `h-screen`.
- Grid children that hold tables get `min-w-0`, or the grid outgrows the viewport.
