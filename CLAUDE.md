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

`events.html` (in the primary navigation and in site search as kind "Event") lists court hearings, orders and committee sittings from `data/calendar.js` (`WGO.calendar`, ids `CAL-NNNN`). It is a different pool from `WGO.events` in `data/records.js`, which is the incident timeline and stays empty until a document fixes a time. A calendar entry carries no state of its own: the page takes the state and the sources from the first evidence record in `evidenceIds`, and `model.integrity()` fails an entry with no evidence record. Coming up or past is worked out in the browser from the date in India, never stored. A `quotes` field holds the source's exact words or is left out. The 29 October 2026 sitting of the High Powered Enquiry Committee (`CAL-0009`, `PROC-SC-025`) is REPORTED, because the Committee's own notice could not be fetched from the build environment (`OQ-067`).

The home page shows the same calendar in a short block headed "Hearings and sittings" (`homeCalendar()` in `assets/pages.js`). It and the events page both read `calendarLead()`, `calendarWhen()` and `calendarSplit()`, so the state, the sources and the split into coming up and past have one definition. When nothing is coming up the block says so and lists the three most recent. `index.html` therefore loads `data/calendar.js`.

## The stack under every record title

`ui.metaStack()` in `assets/ui.js` writes three lines in a fixed order: state, date, number of sources. `ui.evidenceMeta()` and `ui.incidentMeta()` feed it, and the evidence cards, the incident cards, the incident header and the evidence record header all call those two. An incident's count is the distinct sources behind its evidence records, with sample records left out. A missing state or date reads Unknown and a record with no source reads "None on record". Change the stack in that one function. The three labels are in `tools/i18n-source.json` and, in Hindi written by hand and not yet read by a Hindi-speaking editor, in `data/i18n.js` under `meta`.

## The four figures on the home page

`.stat-row` is a ruled grid: two by two on a phone and in the hero's side column from 960px, four across between 600px and 959px. Measured on 19 November 2026 at 390x844, the bottom of the fourth cell moved from 854px to 832px, so the zero and its label are on the first screen. A longer label, or more padding in `.stat`, pushes it back under the fold: measure after changing either.

## Scheduled jobs

The sweep keeps one open issue titled "Sweep: candidates to look at". Each run with something to report replaces its body and adds the day as a dated comment; it opens a new issue only when none with that title is open. The dated "Sweep YYYY-MM-DD" issues opened before 19 November 2026 were left as they were. The issue step was run against a mock client in six cases before it was committed, and the first run of that test caught a duplicate variable name that would have failed every sweep.

`links.yml` allows 150 minutes. `tools/links.js` visits 1,166 URLs on 288 hosts one at a time with a 0.4 second pause before each request; the first 40 took 2 minutes 50 seconds on 19 November 2026, which puts a full run near 80 minutes. At the old limit of 20 the runs of 9 and 16 November were cancelled. Checking several hosts at once would shorten it; `tools/links.js` has no tests, so that change waits for some.
