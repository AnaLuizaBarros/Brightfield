---
name: brightfield-brand-system
description: Brand direction, color tokens (light and dark), typography, layout rules, SCSS architecture and voice for the Brightfield Solar city page. Use before writing any UI, stylesheet, OG image or Figma frame for this project.
---

# Brightfield Solar brand system (v5)

History: v1 (cream, amber, serif) was rejected. v2 (navy, orange, light-blue washes, Plus Jakarta + Inter, three equal cards per section, a hand-drawn SVG hero) was rejected as "generic vibe coding". v3 replaced the templated layout but kept navy, followed the system dark mode (a navy page) and had a split hero; the user rejected the navy background as not credible and the hero as weak. v4 is built from references that were actually opened and studied.

## Design read
City landing page for Phoenix homeowners, mostly on phones, arriving from ads and search. Trust-first and conversion-driven. Language: **an installer's estimate sheet in desert daylight**. Real photography, big grotesque type, monospaced figures, ruled rows instead of cards.

Dials (design-taste-frontend): variance 7, motion 5, density 4.

## References studied (screenshots in `references/design/`)
| Site | What it does in the hero |
|---|---|
| Palmetto | Off-white page, very large display type, and the bill slider right in the hero |
| Otovo, Sunrun, Enpal, Svea, 1KOMMA5 | One photograph of a real home or person fills the hero, headline over it |
| Octopus Energy | Postcode field in the hero, quote button beside it |
| Enphase | White page, black type, orange button |
| Behance and Dribbble, "solar landing page" | Full-bleed photography, large headline, figures under the hero |

Rules taken from them:
1. The hero is one full-bleed photograph of real installation work, never an illustration or a split layout.
2. The hero carries the proposition, the call to action and the city's track record. It has no calculator: the user rejected a second calculator, and the brief asks for the simulator as its own section.
3. The page is light. Dark appears only under photographs and in the closing band and footer.
4. No blue anywhere. Ink is a neutral charcoal.

## What made v2 look generic, and the rule that replaces it
| v2 | v3 rule |
|---|---|
| Hand-drawn SVG illustration in the hero | Real photos only. No decorative SVG. |
| Three equal cards in steps, crews and testimonials | No card grids. Ruled rows, one layout family per section. |
| Four KPI boxes as the simulator result | The result is an estimate sheet: array drawing, price lines, outcome. |
| Eyebrow label above every heading | Two eyebrows on the whole page (hero, crews). |
| Light-blue washes, blue links, green numbers | One accent (sun). Ink and neutrals do the rest. |
| Inter and Plus Jakarta Sans | Figtree, one family. |
| 10 and 16px radius, pill chips | One crisp 4px radius. Only slider thumbs are round. |
| Hand-written icon paths | Phosphor icons, bold weight. |

## Tokens (`src/styles/base/_tokens.scss`)
One theme only. The page does not follow the system dark mode (`color-scheme: light`).

| token | value | use |
|---|---|---|
| `--color-paper` | `#fbfbf9` | page |
| `--color-stone` | `#f2f2ee` | bands (simulator, crews) |
| `--color-sheet` | `#ffffff` | the estimate sheet, the hero card |
| `--color-line` | `#dcdcd6` | hairlines |
| `--color-ink` | `#16181a` | headings, rules, selected rows |
| `--color-body` | `#3f4346` | running text |
| `--color-muted` | `#63676b` | labels |
| `--color-sun` | `#ff7a1a` | the one accent: primary button, slider thumb, covered share |
| `--color-sun-deep` | `#a84300` | accent as text or icon |
| `--color-sun-wash` | `#ffebd9` | notices, hatched "added" pattern |
| `--color-on-sun` | `#16181a` | text on the accent |
| `--color-panel` | `#1c2430` | a panel in the roof drawing |
| `--color-night` | `#16181a` | scrim over photos, closing band, footer |
| `--color-on-night` | `#f7f7f5` | text over photos and the closing band |

Contrast, computed (WCAG AA is 4.5): ink on paper 17.2, body on paper 9.6, muted on paper 5.5, muted on stone 5.1, muted on sheet 5.7, ink on sun 6.8, sun-deep on paper 5.8, sun-deep on stone 5.4, on-night on night 16.6, on-night-soft on night 8.7. White on sun fails, so text on the accent is always ink.

No raw color in a component. If a new color is needed, add a token.

## Type
- **One family: Figtree.** Bricolage Grotesque with Geist Mono was rejected by the user. Figtree was picked from a side by side of six faces (`references/screenshots/fonts-*.jpg`); SunPower uses it too.
- Headings 700 and 800 with tracking -0.02 to -0.03em. Text 400 and 600.
- Figures use tabular lining numerals (`figures` mixin), never a monospaced face.
- Loaded with `next/font/google` in `app/layout.tsx` as `--font-figtree`; tokens expose `--font-sans` and `--font-display`.
- Roles are mixins in `src/styles/abstracts/_type.scss`: `display-xl`, `display-lg`, `display-md`, `lead`, `body`, `small`, `figures`, `label`.
- The hero title must fit in three lines at 1440px and at 390px.

## Layout families (one per section, never repeated)
1. **Hero:** one photograph edge to edge under a transparent header. Copy and two buttons on the left over a scrim, and the city's four figures (rating, installs, crews, permit days) along the foot. On phones the photo is a band at the top that fades into charcoal.
2. **Simulator:** stone band. The two questions first (profiles as a 2 by 2 grid of white options on the left, the two sliders on the right), the state incentive note, then the estimate sheet at full width: sentence, four figures in a row, notices, three columns (array drawing, price lines, bill bar), the math disclosure, the button. Then the five inputs every estimate is based on.
3. **Booking form (`/schedule`):** plain page. Estimate rows, then labels above inputs, error text under the field, radio options as bordered boxes that invert when chosen, success block with reference.
4. **Steps:** sticky photo left, three ruled rows with large numerals and a duration at the right.
5. **Crews and reviews:** roster rows with a photo per crew, a wide valley photo, one lead quote in display type with two smaller beside it.
6. **FAQ:** sticky heading left, native `details` rows right.
7. **Closing:** full-width dusk photo under a night scrim, then the footer.

## Components
- **Primary button:** sun fill, ink text, 4px radius, 54px tall, arrow icon that nudges on hover. Label "Request a site visit" everywhere for the booking intent; "See my savings" for the jump from the hero to the simulator. One label per intent.
- **Secondary button:** ink outline, fills ink on hover.
- **Estimate sheet:** header with a 2px ink rule, summary sentence (`role="status"`), roof drawing, dashed price lines with a solid rule above the total, two display figures, bill bar, notices, math disclosure, button.
- **Roof drawing:** one cell per panel. Panels added by the city minimum are hatched in sun-wash with a dashed border and named in the caption.
- **Bill bar:** covered by solar (sun), still paid to the utility (line), extra kept as credit (hatched).
- **Notice:** sun-wash fill, 3px sun rule on the left, Phosphor Info icon, one sentence of cause and effect. It sits next to the number it explains.
- **Phone mini summary:** ink strip that sticks to the top while the controls are on screen.
- **Phone action bar:** fixed at the bottom, hidden while the hero or the closing band is visible.

## Motion
Subtle and motivated. Page-load entrance staggered on the hero (`.enter`, `--i`). Scroll reveal in CSS only (`.reveal`, `animation-timeline: view()`, fill `forwards` so content is visible at rest). Parallax on photos through `ParallaxImage` (Motion `useScroll`). Result figures tween in 350 ms, written straight to the DOM. Panels pop in. Everything is off under `prefers-reduced-motion`. No scroll listeners, no marquees, no infinite loops.

## Photography
Real photos in `src/assets/images`, imported statically so `next/image` gets sizes and a blur placeholder. Subjects: crews at work, roofs, the Phoenix valley. No smiling stock families, no labels on top of photos. Sources and licence are in the README.

## SCSS architecture
```
src/styles/
  abstracts/   Sass only, no CSS output: _breakpoints, _layers, _mixins, _type, _index
  base/        _tokens, _reset, _base, _motion, _utilities
  global.scss  imported once in app/layout.tsx
src/components/<group>/<Name>/<Name>.tsx + <Name>.module.scss + index.ts
src/sections/<Name>/<Name>.tsx + <Name>.module.scss + index.ts
```
- Every module starts with `@use "abstracts" as *;` (resolved by `sassOptions.loadPaths`).
- Global classes are limited to `.container`, `.visually-hidden`, `.skip-link`, `.reveal`, `.enter`.
- Keyframes are scoped per module. Define them in the module that uses them.
- A class passed into a shared component must win: shared components wrap their defaults in `:where()`.
- z-index only from `abstracts/_layers.scss`.
- No Tailwind in this project.

## Credibility comes from the data file only
Every trust element on the page is a field of the city file: rating, installs, crews, permit days, named crews with their record and photo, testimonials with neighborhood and date, utility rate, sun hours, price per watt. Do not write claims the brief does not make (free visit, warranty, licence, certification, financing, number of reviews). To show one, add a field to the schema and the data file first.

## Voice
Short sentences. Dollars and kWh spelled out. No superlatives. Every claim sits next to its number. No em dashes in copy written for the template (the city data file is the client's text and is used as given).

## Figma handoff
Variables from the token table (one mode), text styles from the type roles, radius 4, spacing 4/8/12/16/24/32/48/64/96. Competitor references are in `references/competitors/`.
