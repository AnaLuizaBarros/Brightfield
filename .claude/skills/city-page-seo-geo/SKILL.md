---
name: city-page-seo-geo
description: Search and AI-assistant visibility for templated city pages. Use when writing metadata, structured data, FAQ markup, headings or crawlable copy for a city page.
---

# City page SEO and AI-search readiness

Half the traffic comes from Google and AI assistants. Both quote text they can read without running JavaScript.

## Render what gets quoted on the server
- Hero, process steps, crews, testimonials and FAQ are server-rendered HTML.
- The simulator is interactive, so its default state must also render as static text: "A $220 bill at 80% coverage needs 17 panels, costs $14,726 after the 30% federal credit and pays back in about 6.9 years." That sentence is what an assistant will cite.
- FAQ answers are visible in the DOM, not hidden behind JS-only accordions. Use `<details>` so the text stays in the HTML.

## Metadata per city
- `<title>`: "Solar Panels in Phoenix, AZ | Brightfield Solar". Under 60 characters.
- Description: one concrete sentence with city, utility and one number.
- Canonical: `/{slug}`; the same URL regardless of `utm_*`.
- `robots`: index, follow. Paid campaign params never create new indexable URLs.
- Open Graph title, description and image per city, see `mobile-trust-share`.

## Structured data (JSON-LD, generated from the same data file)
- `HomeAndConstructionBusiness` with `areaServed` = city and neighborhoods, and `telephone`. Add `aggregateRating` only when the data file carries a real review count; Google requires the count and the Phoenix data has none, so it is omitted.
- `FAQPage` from the FAQ list, using the resolved answer text.
- `BreadcrumbList`.
- Only mark up what is visible on the page. Never invent a review count. If the data has no review count, omit `reviewCount` rather than guess.

## Copy that is not doorway spam
120 near-identical pages get demoted. Each page needs facts that differ: utility name and rate, sun hours, permit days, neighborhoods, state incentive, named crews, local testimonials. Keep the template prose short and let the data carry the page.

## Headings
One `h1` with city and proposition. Each section `h2` written as a question or plain noun phrase people search for ("How many solar panels does a house in Phoenix need?").

## Check
View source with JS disabled. If the numbers, FAQ and crews are there, it passes.
