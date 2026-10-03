# Brightfield Solar: city page (Case 09)

A city page for a fictional solar installer, with Phoenix as the first city. One page, one template, about 120 cities: swapping the data file swaps the page, with no code changes.

- **Case:** 09, city page for a solar installer
- **Time spent:** about 3 hours (confirmed in WakaTime)
- **Video walkthrough (English):** https://drive.google.com/file/d/1hcOtpE0l5KBZE1whYJfHa7v3utZyvqlG/view?usp=sharing
- **Live page:** https://brightfield.albseven.com/
- **Design:** https://www.figma.com/design/vnKv1AC4WRuosvYIXz3He2/Alvorada-Dev (a cover, the design history with the rejected versions, and the built page as one desktop frame) and 390 px and 1440 px captures in `references/screenshots/`
- **Stack:** Next.js (App Router), React, TypeScript, SCSS (global + CSS Modules), Motion, Phosphor Icons, Zod, Vitest

## How to run

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # 18 tests: calculation, FAQ and the three simulator notices
npm run build && npm start
```

Routes: `/` (the home city page, the first file in `data/cities` by file name), `/opengraph-image`, `/<slug>` (every other city; the home city's own slug redirects to `/`), `/sitemap.xml`, `/robots.txt`, `/schedule` (site-visit request, with a form and a Server Action).

## Folder structure

```
data/cities/<slug>.json          content and numbers for each city
src/
  app/                           routes, metadata and page composition only
  sections/<Name>/               one folder per page section
    <Name>.tsx
    <Name>.module.scss
    index.ts
    Simulator/parts/             simulator pieces, each with its own .module.scss
    Simulator/__tests__/         interface tests for the notices
  components/
    ui/                          Button, RangeField, ParallaxImage, AnimatedNumber, Notice
    layout/                      Header, Footer, StickyCta, SimplePage
    brand/                       Wordmark
    analytics/                   campaign capture and page view
  features/city-page/            the six sections assembled, and a city's metadata
  features/simulator/            simulator state (controls, estimate sheet, phone summary)
  features/booking/              site-visit request: Zod schema, Server Action, form
  lib/
    solar/                       calculate() and its tests
    city/                        schema, file loading, FAQ
    seo/                         site constants, structured data
    analytics/                   attribution and events
    format.ts
  styles/
    abstracts/                   Sass only, no CSS output: breakpoints, layers, mixins, type
    base/                        tokens, reset, base, motion, utilities
    global.scss                  imported once in app/layout.tsx
  assets/images/                 template photographs
public/images/crews/             crew photos, referenced by the data file
```

Style rules:
- Every module starts with `@use "abstracts" as *;`.
- Colors, radius, shadows and animation durations are tokens in `styles/base/_tokens.scss`. No component uses a raw color.
- There are only five global classes: `.container`, `.visually-hidden`, `.skip-link`, `.reveal`, `.enter`. Everything else is a module.
- `z-index` only from `abstracts/_layers.scss`.

Environment variables (set them before `npm run build`, because they are baked in at build time; see `.env.example`):
- `NEXT_PUBLIC_SITE_URL`: the public address, used for the canonical URL, the sitemap and the share image.
- `NEXT_PUBLIC_ALLOW_INDEXING`: off by default. Unless it is `true`, every page ships `noindex, nofollow` and `robots.txt` blocks everything, so a portfolio copy on a subdomain does not compete with the real site or the ad landing pages.

To add a city, copy `phoenix-az.json`, change the values and run `npm run build`. The new city appears at `/<slug>`. The root page is always the first city by file name, so replacing the Phoenix file with another city's file swaps the root page without touching code. An invalid field fails the build and names the file and the field.

## Architecture decisions

- The calculation is a pure function used by the simulator, the FAQ, the metadata and the visit-request Server Action. FAQ answers use `{{tokens}}` instead of fixed numbers, so nothing on the page can disagree with the simulator.
- Everything quotable is in the server HTML: hero, steps, crews, testimonials and FAQ (`<details>`). The simulator's default result is also rendered as a sentence.
- Campaign attribution: UTM parameters and `gclid`/`fbclid` are kept in the session (first touch wins). Every event carries the city and the campaign. The "Request a site visit" link is built on click with the current simulation and the campaign. Events: `page_view`, `sim_started`, `sim_result` (debounced by 800 ms), `profile_selected`, `cta_click`, `booking_submitted`. No analytics provider has been chosen.
- The visit request is a Server Action. The brief rules out scheduling and a back end, but the page's funnel ends in a request, so `/schedule` has a short form (name, phone, neighborhood, time) with accessible server-side validation (Zod), a per-field error, focus on the first error and a success state with a reference. The action validates, generates the reference and writes the request to the server log as JSON, with the simulation and the campaign attached. That is what answers the Monday question in the brief. There is no database and no email.
- A price table by system size, generated from the same formula as the simulator (from the city minimum up to 41 panels) and rendered on the server. It answers the search for system cost without inventing a single number.
- The simulator has two steps: the two questions on top (profiles on the left, controls on the right on desktop), and the estimate below at full width: the four figures first, then the notices, then the roof drawing, the price lines and the bill bar side by side.
- Mobile first: in the simulator, a strip with the four figures sticks to the top while the controls are on screen. A fixed bottom bar carries the call to action and hides while the hero or the closing band is visible.
- Animation: staggered entrance on the hero, scroll reveal in plain CSS, parallax on photos, numbers that transition. All of it turns off under reduced motion.

## Design decisions

The first implementation looked generated: a hand-drawn SVG illustration, three identical cards in every section, four number boxes as the result, an uppercase label over every title. The page was rebuilt with these rules:

| Before | Now |
|---|---|
| SVG illustration in the hero | A real photograph |
| Three identical cards in steps, crews and testimonials | Ruled rows, one layout family per section |
| Four number boxes | An estimate sheet: roof drawing, price lines, result |
| Blue, orange, green and light-blue washes | One accent (orange) over charcoal and light neutrals, no blue |
| Split hero with a preview card | Full-bleed photo, title and call to action on it, the city's four numbers along the foot |
| Crews with initials only | A photo per crew, from the data file |
| Automatic dark theme (navy background) | A single, light theme |
| Inter and Plus Jakarta Sans | Figtree, one family, with tabular figures |
| 10 px and 16 px radii | A single 4 px radius |

The roof drawing shows one rectangle per panel. When the city minimum adds panels, they are hatched and the caption says how many were added. The bill bar shows what solar covers, what still goes to the utility and the surplus that becomes credit.

## Two investigated decisions

**1. A household profile must reset coverage to 80%.**
I had assumed that picking a profile only fills in the bill. Running the brief's example sequence in the browser, the fourth row gave 9 panels and $7,796, not the expected 8 panels and $6,930. The reason: the third row leaves coverage at 100%, and a $90 apartment at 100% needs 8.55 panels, which rounds up to 9. The table only holds if the profile also returns coverage to 80%. I concluded that a profile is a complete starting point and implemented it that way. The six rows of the example match in the browser and in a test.

**2. The hero and the color came from references that were opened and studied.**
Two earlier versions were discarded. The first was generic. The second followed the system dark theme, which made the page navy, and had a split hero that did not convince. I opened and captured the heroes of Palmetto, Otovo, Sunrun, Enpal, Octopus Energy, Svea Solar, 1KOMMA5, Enphase and the "solar landing page" searches on Behance and Dribbble (captures in `references/design/`). What they share: a real photograph filling the whole hero, and a light page. I adopted both. I did try putting the electricity-bill control in the hero, as Palmetto does, but removed it: the page ended up with two calculators, and the brief asks for the hero to carry the proposition and a call to action, and for the simulator to be the second part. The font was chosen from a side-by-side comparison of six families (`references/screenshots/fonts-*.jpg`). I checked the contrast of every color pair (all pass AA) and the page at 390 and 1440 px.

## Assumptions

- The simulator starts at a $220 bill and 80% coverage, as suggested.
- Changing coverage while the panel minimum applies does not change the result. The page explains this next to the control, with the real coverage the minimum produces.
- The FAQ in the brief had fixed numbers. They became fields filled in by the calculation.
- `installDays` (1) is a new field in the data, taken out of the FAQ text.
- The data has no review count. For that reason the JSON-LD has no `aggregateRating`: Google requires the count, and inventing one would be a false claim.
- The state incentive appears only as an informational note and is not part of the calculation.
- The photos belong to the template, not to the city. To vary them per city, the photo path would go into the data file.
- The crew photos are stock images, as the brief allows. I chose each one by the roof type the crew works on, not by the look of the people. The `photo` field is optional; without it the page shows initials.
- The page only states what is in the data. There is no mention of a free visit, warranty, license, certification, financing or number of reviews, because the brief gives none of that.
- The page is published at a subdomain of my own studio (`brightfield.albseven.com`); the company itself is fictional. The address comes from `NEXT_PUBLIC_SITE_URL`.

## Photographs

Unsplash and Pexels, free-use licenses.

| File | Source |
|---|---|
| `hero-install.jpg` | Pexels, https://www.pexels.com/photo/9875418/ |
| `steps-tile-roof.jpg` | https://unsplash.com/photos/hrIpsXkrAO0 |
| `valley.jpg` | https://unsplash.com/photos/akE66HU-_Kg |
| `dusk-panels.jpg` | https://unsplash.com/photos/OZ0ZEAm_PbE |
| `public/images/crews/tile-roof.jpg` | Pexels, https://www.pexels.com/photo/9875405/ |
| `public/images/crews/pitched-roof.jpg` | Pexels, https://www.pexels.com/photo/14613939/ |
| `public/images/crews/flat-roof.jpg` | Pexels, https://www.pexels.com/photo/6158868/ |

## Tests

`src/lib/solar/calc.test.ts` protects the calculation: the six rows of the brief's example, the savings cap against the uncapped value, the panel minimum, rounding up, coverage with no effect, the ends of the slider ranges, a second invented city (proving nothing is hard-coded) and the FAQ quoting the same numbers as the simulator.

`src/sections/Simulator/__tests__/Simulator.test.tsx` protects what appears on screen in the brief's three situations: the savings-cap notice with both values, the panel-minimum notice with the requested number and the drawing marking the added panel, and the note that lowering coverage does not change the result.

## Audit

Lighthouse 12 against the production build on 2026-09-30, Phoenix page: mobile 93 performance and 100 accessibility, best practices and SEO; desktop 100 in all four categories. The only mobile item below 90 is the LCP of the hero photo (3.1 s on simulated 4G). axe-core (WCAG 2.2 AA and best practices) found no violations on the page or the form; the 20 items flagged for manual review are text over the hero photograph, which sits on a dark veil to keep the contrast. The mobile LCP (3.1 s on simulated 4G) is not image weight: on the production build the hero photo is AVIF at 23 KB at 828 px, 35 KB at 1080 px and 84 KB at 1920 px, with `preload` and `srcset` in the HTML. While measuring I found that Next 16 only serves the qualities listed in `images.qualities` (default 75) and rewrites any other value, so the `quality` prop I was passing did nothing; I removed it. The layout was checked in Chromium.

## Use of AI

Claude Code helped analyze competitors, propose the architecture and write the code. I worked with it through short rule files in `.claude/skills/`, one per concern (data model, calculator, attribution, SEO, mobile and sharing, brand system), instead of one long prompt. The first visual version it produced was discarded as generic, and the page was rebuilt with the rules above. I did not accept its assumption about household profiles; I ran the brief's table in the browser and found the mismatch described above. What I checked: the calculation against the six rows (in a test and in the browser), color contrast, the server HTML, the layout at 390 and 1440 px with no horizontal scroll, Lighthouse on the production build and axe-core.
