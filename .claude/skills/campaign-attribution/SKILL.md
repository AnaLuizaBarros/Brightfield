---
name: campaign-attribution
description: Captures campaign parameters and simulator events so the campaign owner can tell on Monday which ads produced savings simulations. Use when adding analytics, UTM handling, event tracking or the CTA links.
---

# Campaign attribution

## The question the page must answer
"Which ads generated simulations, and did they turn into a visit request?" That needs the campaign, the ad and the city on every event, with no back-end.

## Capture
- On first load read `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` and `gclid`/`fbclid`.
- Store them once in `sessionStorage` (wrapped in try/catch) so later navigation and the CTA keep them. First touch wins for the session.
- Add `city` (slug) to every event automatically. That is what lets 120 pages share one report.

## Events (small, named, stable)
| event | when | properties |
|---|---|---|
| `page_view` | mount | city, utm_* |
| `sim_started` | first change of bill, coverage or profile | city, utm_*, source: slider or profile |
| `sim_result` | debounced 800 ms after the last change, max once per 5 s | bill, coverage, panels, netCost, savings, payback, minimumApplied, savingsCapped |
| `profile_selected` | profile chip | profile label |
| `cta_click` | any CTA | location: hero, simulator, final; with the current simulation values |

Debounce `sim_result`. A person dragging a slider must not send 30 events.

## CTA links
The CTA may point at an empty address, but build the URL from the stored params plus the last simulation: `/schedule?city=phoenix-az&bill=220&coverage=80&utm_campaign=...`. The visit request then arrives already carrying the ad and the number that convinced the person.

## Booking request (`src/features/booking`)
The `/schedule` page is a real form. Its Server Action validates with Zod, gives the request a reference and logs one JSON line (`site_visit_requested`) with the estimate and the campaign. That line is the Monday report until a CRM or e-mail is wired into the same action. Hidden inputs carry `city`, `bill`, `coverage` and the campaign keys from the URL.

## Transport
No back-end in this case. Use one `track(name, props)` function that logs to the console in development and calls a provider adapter in production (Plausible, PostHog or GA4, chosen later). Nothing else in the code imports the provider.

## Privacy
No names, addresses or emails in events. Bill and coverage are fine. Respect Do Not Track and Global Privacy Control.

## Verify
Open `/phoenix-az?utm_campaign=test&utm_content=ad-b`, move the slider, click the CTA. Every logged event carries `utm_content=ad-b` and `city=phoenix-az`.
