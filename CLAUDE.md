# WhoGaveTheOrder

Shared engineering standard: @.claude/engineering-standards.md. It applies to all work in this repository. This file adds what is specific to the project, and wins where the two disagree.

A citizen-led accountability archive at www.whogavetheorder.in: when state
power is used against citizens, who authorised it. Split out of
`Varnasr/Experiments` on 17 August 2026. Served by Netlify.

The rule the README states first governs everything: nothing renders as a fact
without a source, including in the seed data. A field with no source reads
`UNKNOWN`. `SOURCING.md` sets out how sources are judged.

## Commands

```bash
node tools/check.js
python3 sourcemap/validate.py
node tools/build-seo.js --check
node tools/build-letters.js --check
node tools/build.js
```

`sweep.yml` runs daily and `translate.yml` pushes commits; both are builds
on the Netlify site.

## The events page

`events.html` lists court hearings, orders and committee sittings from `data/calendar.js` (`WGO.calendar`, ids `CAL-NNNN`). It is a different pool from `WGO.events` in `data/records.js`, which is the incident timeline and stays empty until a document fixes a time. A calendar entry carries no state of its own: the page takes the state and the sources from the first evidence record in `evidenceIds`, and `model.integrity()` fails an entry with no evidence record. Coming up or past is worked out in the browser from the date in India, never stored. A `quotes` field holds the source's exact words or is left out. The 29 October 2026 sitting of the High Powered Enquiry Committee (`CAL-0009`, `PROC-SC-025`) is REPORTED, because the Committee's own notice could not be fetched from the build environment (`OQ-067`).
