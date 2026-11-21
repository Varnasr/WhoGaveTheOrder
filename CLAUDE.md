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

The home page shows the same calendar in a short block headed "Hearings and sittings" (`homeCalendar()` in `assets/pages.js`). It and the events page both read `calendarLead()`, `calendarHead()` and `calendarSplit()`, so the state, the sources, the date and the split into coming up and past have one definition. `calendarHead()` writes the head of every dated entry on both pages: the day as a large numeral, the month, year and weekday beside it, the kind of event opposite, and a hairline under them (`.dated` in `assets/styles.css`). The `time` element carries the whole date. When nothing is coming up the block says so in a notice (`.rail__notice`) and lists the three most recent. `index.html` therefore loads `data/calendar.js`.

## The opening of the home page, and Latest

The hero opens with one sentence saying what the site covers, between two hairlines (`.hero__is`), then the owner's headline in four lines as written in `index.html`: "A record of what the police did. And a way to ask who ordered it." The headline is the owner's wording. A session on 19 November 2026 shortened it to a question without being asked, and it was put back the next day: do not reword it. The line above must not repeat it, which is why that line no longer says "A public record of". Measured on 20 November 2026: at 390x844 the two actions end at 594px and the fourth figure at 768px; at 360x800 they end at 609px and 792px; at 320px the fourth figure ends at 849px. A larger `font-size` on `.hero .display`, or more padding in the hero below 560px, pushes the figures under the fold: measure after changing either.

## The top of the page on a phone

Below 560px the status bar shows the short form of the counts (`.notice-bar__brief`: documents, open questions, orders found) on one row with the language switch, and the masthead rows sit closer. From 560px it shows the full sentence (`.notice-bar__full`). Both are written by `ui.renderChrome()` from `model.counts()`, and CSS hides one with `display: none`, so a screen reader meets the counts once. At 390px the bottom of the masthead moved from 181px to 125px and the first line of the home page from 225px to 153px. `[data-chrome="masthead"]` reserves 127px below 420px to match; change the two together. The Hindi status line has no short form and stays two lines (masthead 143px), because a short form needs a Hindi string nobody has written. Below 360px the short form may wrap to two lines.

Latest on the home page is `ui.updateBrief(6)` (five shown below 960px): date and headline, a hairline between items, and the note with its pointer to the record under a native `details` element. `changes.html` still uses `ui.updateList()` and shows every note in full. The home page went from 9,181px to 8,475px tall at 390px wide with five items where it had three.

## The stack under every record title

`ui.metaStack()` in `assets/ui.js` writes three lines in a fixed order: state, date, number of sources. `ui.evidenceMeta()` and `ui.incidentMeta()` feed it, and the evidence cards, the incident cards, the incident header and the evidence record header all call those two. An incident's count is the distinct sources behind its evidence records, with sample records left out. A missing state or date reads Unknown and a record with no source reads "None on record". Change the stack in that one function. The three labels are in `tools/i18n-source.json` and, in Hindi written by hand and not yet read by a Hindi-speaking editor, in `data/i18n.js` under `meta`.

## The four figures on the home page

`.stat-row` is a ruled grid: two by two on a phone, four across from 600px. Measured on 19 November 2026 at 390x844, the bottom of the fourth cell moved from 854px to 832px, so the zero and its label are on the first screen. A longer label, or more padding in `.stat`, pushes it back under the fold: measure after changing either.

## The home page on a wide screen

From 960px the hero is the headline on the left with the paragraph and the two actions beside it, ending level with the headline's last line (`.hero__say` is a grid), and the four figures in one ruled row across the full width under both. Until 20 November 2026 the figures sat in a side column of their own, which left 299px of nothing under them at 1280px and an empty band between them and the headline. The headline keeps its four lines at every width from 960px to 1920px; between 960px and 1139px the headline column is wider to hold them. The hero has the same padding as every other section there and the section after it is ruled off like the rest.

"Latest" and "Hearings and sittings" start level: the heading and its sentence sit inside the left column of `.home-split`. `ui.updateBrief(6)` writes six headlines; the stylesheet shows five below 960px and the sixth from 960px, so the two columns end close together (35px apart at 1280px and wider, 93px at 960px, measured 20 November 2026). When the calendar gains or loses an entry the columns drift apart again: measure, and change the six. Nothing below 600px changed in this work, and the phone measurements above were taken again and match.

## The colour theme switch

Until 21 November 2026 the site had no theme control: it followed the device and nothing else. The status bar now carries one button (`[data-wgo-theme]`, written by `ui.renderChrome()`) that moves from the device setting to light to dark. The choice is kept on the device under `wgo.theme`, and `ui.applyTheme()` sets `data-theme` on `<html>`. `assets/styles.css` therefore holds the dark values twice: inside `@media (prefers-color-scheme: dark)` for `:root:not([data-theme="light"])`, and again for `:root[data-theme="dark"]`. Nothing compares the two blocks, so change both together; a dark rule written only inside the media query will not apply for a reader who chose dark on a light device. The scripts load at the end of `<body>`, so a reader whose choice differs from the device can see the other palette for an instant on load. The button has a negative block margin so the status bar keeps its height: the masthead measured the same before and after at 320, 360, 390 and 1280px.

## Scheduled jobs

The sweep keeps one open issue titled "Sweep: candidates to look at". Each run with something to report replaces its body and adds the day as a dated comment; it opens a new issue only when none with that title is open. The dated "Sweep YYYY-MM-DD" issues opened before 19 November 2026 were left as they were. The issue step was run against a mock client in six cases before it was committed, and the first run of that test caught a duplicate variable name that would have failed every sweep.

`links.yml` allows 150 minutes. `tools/links.js` visits 1,166 URLs on 288 hosts one at a time with a 0.4 second pause before each request; the first 40 took 2 minutes 50 seconds on 19 November 2026, which puts a full run near 80 minutes. At the old limit of 20 the runs of 9 and 16 November were cancelled. Checking several hosts at once would shorten it; `tools/links.js` has no tests, so that change waits for some.
