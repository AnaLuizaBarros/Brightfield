---
name: mobile-trust-share
description: Mobile-first layout, tap targets, shareable link previews and trust cues for the city page. Use when designing the simulator on a phone, the sticky CTA, the Open Graph image or any credibility element.
---

# Mobile, trust and sharing

## Context
Many visits come from a phone, sometimes from someone standing in the yard looking at the roof. The link is then sent by message to a partner or family member who decides with them. It must look credible in the message preview and on first open.

## Mobile
- Design at 375 px first. One column. Body text at least 16 px so iOS does not zoom on focus.
- Sliders: 44 px minimum thumb hit area, values shown next to the label in large tabular numerals, keyboard arrows and `aria-valuetext` ("$220 per month", "80 percent").
- Result stays visible while the slider moves. On phones an ink strip with the four key numbers sticks to the top while the controls are on screen. Nobody should scroll to see what their thumb just did.
- Profile shortcuts as a ruled list of rows with the typical bill at the right, not a native dropdown.
- Sticky bottom CTA bar after the hero scrolls away, with `env(safe-area-inset-bottom)` padding. It hides while the final CTA is on screen.
- Phone number is a real `tel:` link and also visible as text.
- No hover-only information. Explanations for the capped-savings and minimum-panels notes are inline text, not tooltips.

## Trust cues, from the data file only
- Installs completed, average rating, crews available, average permit days.
- Named crews with installs, rating and start year.
- Testimonials with first name, last initial, neighborhood and date.
- Show the math: list the assumptions under the result (rate, sun hours, panel watts, cost per watt, credit). One review says they trusted Brightfield because it showed the math.
- State incentive shown as an informative note, marked as not included.
- Placeholder crew photos are labeled as illustrations in the README, not passed off as real people.

## Share preview
- `opengraph-image` route per city, generated from the data: city name, utility, panels for the default scenario, rating. 1200×630.
- Title and description as in `city-page-seo-geo`.
- The link stays clean. No long query strings after the simulator changes; keep simulator state in memory, or in a short hash if a shareable state is added later.

## Checks
- 375 px wide, throttled 4G: largest contentful element visible with the CTA in the first screen.
- Lighthouse mobile accessibility 95 or better, contrast 4.5:1, focus ring visible on every control.
- Send the URL to a messaging app and read the preview.
