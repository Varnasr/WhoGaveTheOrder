# WhoGaveTheOrder.in

A citizen-led public accountability platform. One question, asked systematically:

> When state power is used against citizens, who authorised it?

**Stage:** Live at [www.whogavetheorder.in](https://www.whogavetheorder.in) · Own repository since
17 August 2026, split out of the `Varnasr/Experiments` sandbox with its history intact. Served by
Netlify from external DNS — an apex A record to Netlify's load balancer, `www` as a CNAME — with the
apex redirecting to `www`.

---

## The one thing to understand about this archive

**Nothing renders as a fact without a source, including in its own seed data.**

Dates and locations are established for all eight incidents (five from July 2026, three from October 2026). Beyond those, most factual fields
still read `UNKNOWN`: **no order authorising the use of force has been found**, and that count is
still zero.

What has changed since launch is where the archive expects to find an author. Delhi and Bihar hold
police action, and police action leaves no order. Mumbai, Kochi, Kolkata and Assam hold something
else: cases registered against people for assembling. 13 FIRs against more than 400 in Mumbai, one
against 101 at Kochi, seven naming about 70 in Kolkata, five in Assam, and 355 booked in Bihar
alongside the lathi charges. The Supreme Court closed all of them on 1 September 2026 under Article
142, leaving one exception: a single FIR concerning 2,873 people whom Delhi Police's facial
recognition system placed at Jantar Mantar. An Indian Express check of the 205 names on that list
facing the gravest charges found at least 25 who were in jail on the day the software saw them.

A second wave began on 2 October 2026, over the Chief Election Commissioner and the revision of the
electoral rolls. It is recorded as two incidents of its own, apart from the July ones: mass
detention at Jantar Mantar under a section 163 order (force alleged by protesters, not established),
and an FIR over the Shivaji Park gathering in Mumbai (no force alleged). The Supreme Court order of
1 September is reported to cover only the protests of 20 to 25 July.

An FIR, a refusal of permission and a withdrawal notification are each written by somebody. A baton
is not. That asymmetry is the archive's subject and the records now keep the two apart: a shell
recording cases rather than force says so in its title and in every field.

That is not an unfinished seed to be tidied up. It is the product working as designed. The brief's own rule (§23) is that the site must never manufacture certainty, and the
fastest way to violate it would have been to ship plausible-looking placeholder facts about real
events. A claim without a source ID does not render as a fact anywhere on this site — including in
its own seed data.

What is real here is the machinery: the content model, the evidence grammar, the integrity checks,
and the refusal to display a claim without a source.

---

## Running it

No build step, no dependencies to install.

```bash
python3 -m http.server 8000
# then open http://localhost:8000/
```

Opening `index.html` directly off the filesystem also works — the data is loaded as plain scripts
rather than fetched JSON, so there is no CORS problem. The only things that need a server are the
map tiles and the Netlify Forms submission endpoints.

---

## Pages

| File | What it is |
|---|---|
| `index.html` | Homepage — what the record holds, what it does not, and the letter |
| `investigations.html` | Investigation index and the incident map |
| `investigation.html?id=<slug>` | The five-section incident page: what happened, what evidence exists, has anyone said who authorised it, what remains unknown, what would close the gap |
| `evidence.html` | Evidence library; `?id=WGO-0001` renders a single evidence record |
| `letters.html` | The four Bihar preservation representations, composed and opened in a mail window |
| `submit.html` | Submission form, the gap list, and the public demand |
| `others.html` | Index of other people's investigations, credited to them |
| `about.html` | Transparency: who runs it, funding, methodology, standards, corrections, privacy, takedown |
| `search.html` | One index across every entity |
| `rti.html` | How to ask a public office, and the register of what has been asked |
| `press.html` | Press kit |
| `changes.html` | What changed — every record added, every state moved, derived from git history. Atom feed at `feed.xml` |
| `hi.html` | यह अभिलेख क्या है — the Hindi entry page |

### Four pages removed on 2026-09-23

`chain.html`, `walkthrough.html`, `admin.html` and `response.html` are gone, with 301 redirects in
`netlify.toml`. The reason is worth keeping, because the same thing will be tempting again.

The primary navigation had seven items. Three of them led to pages holding nothing: `chain.html`
(0 orders, 0 persons), `rti.html` (0 applications) and `response.html` (0 official replies). Each
carried several hundred words explaining what would be in it. Meanwhile `letters.html`, the one
page on the site a reader can act on, was not in the navigation at all — it sat in the fourth
column of the footer under "Take part".

`chain.html` in particular was not wrong. It mapped the eight offices empowered to authorise force
in India and reported "authorisation not established" on every node, which is true. Rendered
identically for every incident, in the second navigation slot, eight times down the page, it read
as an investigation rather than as the absence of one. The specific half of it — which office
holds the records for *this* incident, and the letter asking that office to keep them — is now on
the incident page, in section 03, where somebody has just finished reading what happened.

`walkthrough.html` was a nine-step manual for reading nineteen records. `admin.html` published an
editorial console, including a section headed "What a full CMS has to add", on the public
internet. Deleting the walkthrough also removed its renderer from `assets/pages.js`, where the
entire block including `var WALKTHROUGH_STEPS` had been duplicated verbatim; non-strict mode
permits the redeclaration, so nothing had ever errored. `assets/pages.js` went from 1,546 lines to
1,052.

---

## Content model

Structured and relational, not a pile of pages. Two chains, and no page may skip a link in either:

```
Incident → Claim    → Evidence  → Source
Incident → Question → Authority → Evidence → Answer state
```

| Prefix | Entity | Prefix | Entity |
|---|---|---|---|
| `INC-` | Incident | `WGO-` | Evidence |
| `EVT-` | Timeline event | `SRC-` | Source |
| `PER-` | Person | `CLM-` | Claim |
| `OFC-` | Office | `QST-` | Question |
| `ORD-` | Order | `GOV-` | Government response |
| `EXT-` | External investigation | `SUB-` | Submission |
| `RTI-` | RTI application | | |

### Files

```
.
├── SOURCING.md        # where the evidence actually comes from. Read this second.
├── RESEARCH-PROMPT.md # reusable prompt for building the source map, per incident
├── data/
│   ├── taxonomy.js    # every controlled vocabulary + site config. Start here.
│   ├── records.js     # the record store. Add real content here.
│   ├── i18n.js        # the Hindi interface. Grammar only — records are never translated.
│   ├── samples.js     # layout samples, loaded only while demoMode is on
│   └── export/        # GENERATED. The archive as JSON and CSV.
├── assets/
│   ├── styles.css     # design system and the evidence-state palette
│   ├── model.js       # relational graph, counts, clocks, appeals, integrity checks
│   ├── ui.js          # chrome, chips, source lines, citations, empty states
│   └── pages.js       # per-page controllers
├── tools/             # Node, no dependencies. Loads the site's own model.
│   ├── archive.js     # evaluates data/ + model.js in a sandbox, at any git revision
│   ├── check.js       # the integrity checks, for CI
│   ├── deadlines.js   # runs the RTI clocks on a schedule
│   ├── sweep.js       # the daily hunt for new documents
│   ├── watchlist.json # where it looks, and why each place is watched
│   ├── fixity.js      # gets every source into a public web archive
│   ├── links.js       # are the cited sources still there? weekly, in CI
│   ├── translate.js   # English to Hindi via Sarvam, written to a file
│   ├── i18n-source.json # the English behind every translated string
│   └── build.js       # change log, Atom feed, and the export
└── *.html
```

### Two commands

Everything generated is committed, and CI fails if either is stale:

```bash
python3 sourcemap/import.py   # after editing sourcemap/*.json
node tools/build.js           # after any record changes: change log, feed, export
```

Both are gated in `check.yml`. Until 18 September 2026 only the first one was, so
the change log, the Atom feed and `data/export/` were checked by nothing while the
README said otherwise.

**`build.js` needs the full git history** and refuses to run without it. It derives
the change log by diffing each commit against its parent, and in a shallow clone the
boundary commit reports no parent, so every record reads as added by it. The daily
sweep ran at `actions/checkout`'s default depth of 1 and committed the result with
`[skip ci]`: the published change log became a single entry claiming a sweep-log
commit had created all 201 records, and the Atom feed told subscribers the same.
Both workflows now set `fetch-depth: 0`, and `build.js` exits rather than writing a
false history if one is missed.

**`SRC-` ids are allocated in `sourcemap/source-ids.json`, not recomputed.** They
used to be positional, so adding a source to an early record renumbered every id
after it — the first real content edit moved 18 of them, and these ids are published
in `feed.xml` and the change log. A key in the ledger keeps its id wherever its
record moves; a new key gets the next id after the highest ever issued. Do not
delete an entry unless you mean to retire the id, and do not reuse a retired one.

### The source map, and the editorial mapping

`sourcemap/` holds the round-1 research: 136 evidence items, 30 open questions, 13 filing tasks,
its own `CLAUDE.md` rules file, and `validate.py`. `import.py` routes it into the site.

The import is **not** a flat dump. The 136 items are three different kinds of record and only one is
evidence about the incidents:

| | | |
|---|---|---|
| 32 | about the incidents | incidents, evidence, external index |
| 75 | how to obtain documents | `SOURCING.md`, not the evidence library |
| 29 | the legal framework | the offices' `statutoryBasis` |

**Which provision binds which office is a reading, not a lookup.** `OFFICE_FRAMEWORK` in
`import.py` carries the assignment and, for each one, the reason. Two rules govern it: a provision
goes to the office the provision itself names or empowers, and a commissionerate is not a district —
the Commissioner concentrates powers that a district splits between the DM and the SP. The chain
page shows the reasoning rather than hiding it.

`PREC-*` records are excluded from that mapping on purpose: they document how other archives were
built, which is methodology, not the statutory basis of an office.

Re-run after editing `sourcemap/*.json`:

```bash
python3 sourcemap/import.py
```

### The daily sweep

`tools/sweep.js` goes to the places a document about these incidents could appear — the Delhi High
Court cause list and judgments page, the NHRC press releases, the parliamentary library, Bar & Bench,
and four news queries — and reports what is new since yesterday. It runs at 02:30 UTC and opens an
issue when there is something to look at.

**It never writes a record.** It writes candidates and a dated log, and a person decides what becomes
evidence and at what confidence. Assigning a state means judging whether two sources are actually
independent and what a document does and does not establish; a feed that could set a state would be a
route for laundering an unsourced claim into a fact.

What it does record every day is that it looked. `sourcemap/watch-log.json` is committed daily, so an
absence in this archive has a date on it — the same discipline as PROC-BIH-001 and LEG-010, which are
both searches that found nothing.

```bash
node tools/sweep.js            # human summary
node tools/sweep.js --json     # what the workflow reads
node tools/sweep.js --date 2026-09-11   # the next Delhi High Court listing
```

Watch terms come partly from `tools/watchlist.json` and partly from the records themselves — incident
places and case numbers — so a new incident starts being watched without anyone updating a list. City
and state names are deliberately excluded: "New Delhi" matches every article filed from New Delhi, and
a sweep that reports everything reports nothing.

### Are the sources still there?

`fixity.js` gets a source into the Internet Archive, but it only looks at sources
with **no** `archive_url` yet: once a snapshot exists the URL is never revisited.
Nothing asked whether a live source still resolved, so nothing noticed when two
of them stopped.

On 18 September 2026 the India Code URLs for the **Delhi Police Act 1978** and the
**Bihar Police Act 2007** were returning 404. India Code had migrated from
`www.indiacode.nic.in` to `indiacode.gov.in`. Those two statutes are the statutory
basis of two of the three jurisdictions in the chain of command.

`tools/links.js` checks every cited source URL, weekly, in `links.yml`. A status
code alone would not have done the job, in both directions:

- `indiacode.gov.in` is a single-page application that answers **200 with an
  identical 2,338-byte shell for every path**, including paths that do not exist.
  A status check calls the whole host healthy. So the tool probes a control path
  on the same origin that cannot exist, and where the host answers it with the
  same body, reports `UNCHECKABLE` rather than guessing.
- Two HTTP clients disagree about a live source: on the BNSS PDF, `curl` returns
  200 with 2 MB and Node's `fetch` returns 404 with an error page, same URL, same
  user agent. A `DEAD` verdict is therefore confirmed with a second client, and a
  disagreement is reported as `CONFLICT` rather than as a dead link.
- Naming itself got it blocked. A `User-Agent` of
  `WhoGaveTheOrder-link-check (+https://www.whogavetheorder.in)` draws a 403 from
  `www.indiacode.nic.in` on URLs that serve 200 to curl's default, which would have
  condemned every source on that host. It sends no custom agent.
- A 4xx means the document is not there and fails the run. A 5xx means the server
  is having a bad day and does not.

```bash
node tools/links.js              # exits 1 if a source is 4xx from two clients
node tools/links.js --json
node tools/links.js --no-fail    # report only
```

It never edits a record. Where a source has moved, add the new URL **beside** the
old one rather than replacing it: the earlier retrieval did happen, and the date
the old URL was found dead is itself worth recording.

### Keeping sources checkable

A link is not a citation. News sites edit stories, paywall them and take them down, and when that
happens a record still says "source: Bar & Bench" with no way for a reader to check it.

`tools/fixity.js` asks the Internet Archive whether a snapshot of each source URL exists and requests
one where it does not, writing the snapshot URL back into the source map. The sweep runs it daily on a
handful of sources, so a backlog clears over a week without anyone being throttled.

Anonymous capture requests are often refused with a 403. The Internet Archive issues free keys: set
`IA_ACCESS_KEY` and `IA_SECRET_KEY` as repository secrets and captures are requested properly.
Without them the tool still does the useful half, which is finding the snapshots that already exist.

### Hindi

`tools/translate.js` sends the English in `tools/i18n-source.json` to Sarvam and writes the Hindi to
`data/i18n.generated.js`. **The site never calls Sarvam.** Translation happens once, the result is
committed, and every reader gets a static file. That keeps the cost to one run per change, keeps the
privacy note true — the site makes no third-party request on a reader's behalf — and keeps the site
working if the API is down.

Only strings whose English has changed are sent, so a second run costs nothing. The workflow is
manual (Actions → Translate → Run workflow); there is deliberately no schedule on a paid API.

Where the machine translation exists it is used; anything it has not covered falls back to the Hindi
in `data/i18n.js`, so a page is never half-translated.

### Is the corroboration real?

`CORROBORATED` means two or more **independent** sources. That is easy to get wrong. Four outlets
reporting one affidavit look like four sources; a wire story carried by three papers looks like three.

A source may record `originates_from` — the document or wire it actually read. The integrity check
then flags any `CORROBORATED` record whose sources all trace back to a single origin:

> CORROBORATED, but every source traces to one origin: Delhi Police affidavit to the Supreme Court.
> Fine if the claim is what that source says; one source if the claim is what happened.

It is a warning rather than an error because the answer depends on the claim. If the claim is that a
document says something, several people reading that document do corroborate it. If the claim is about
what happened, they do not. The check states the question; a person answers it.

### Explaining the archive

Two layers, not three. The nine-step walkthrough was the third and it is gone.

1. **Inline explainers** — collapsed `<details>` blocks placed where the confusion actually lands:
   the UNKNOWN shells on an incident, the six states in the evidence library, the reply clock on
   the register and the gap list. Defined once in `ui.EXPLAIN` and read from the same taxonomy the
   chips do. `EXPLAIN.authority` went with `chain.html`, which was its only caller.
2. **The homepage** — what the record holds, what it does not, and what a reader can do about it,
   so a first-time visitor is oriented in one screen rather than sent on a tour.

If a status label is not defined in `taxonomy.js`, it does not render anywhere. That is what keeps
the evidence grammar from drifting page to page as the archive grows.

---

## Adding real content

1. **Add a `SRC-` record first.** Nothing can cite what does not exist.
2. **Add the `WGO-` evidence record**, pointing at that source. Fill in both `establishes` and
   `doesNotEstablish` — the second one is the harder half and is not optional in practice.
3. **Only then** set a claim, timeline event or authority link to a state other than `UNKNOWN`,
   listing the evidence IDs that carry it.

`node tools/check.js` runs the integrity check on every push, and CI fails on an error. It flags:

- evidence citing a source that does not exist
- claims, questions or offices citing evidence that does not exist
- published evidence with no source attached
- a claim asserting `VERIFIED`/`CORROBORATED` with no evidence attached
- a question marked `ANSWERED` with no evidence attached

Records with an empty `sourceIds` render a **NO SOURCE ON RECORD** marker. Don't remove the
marker — fill the array.

### The two rules the code enforces, not the editor

- **Sample records never enter a published count.** `model.counts()` reads the published pools only.
- **A record with no evidence and no source resolves to `UNKNOWN`.** The model never upgrades a
  state on its own, and `authorisationStatus()` returns *not established* until a document says
  otherwise.

---

## Outstanding

- [x] `demoMode: false` — layout samples removed, 17 August 2026.
- [x] `archiveStage: null` — the masthead now shows a live status line rather than a launch banner.
- [x] `about.html` — who runs this project, and funding, both written.
- [x] `evidence@`, `corrections@` and `legal@whogavetheorder.in` provisioned, 17 August 2026.
      Microsoft 365 mailbox on `legal@`, with the other two as aliases.
- [ ] **Fix the SPF record before emailing any public authority.** The domain publishes
      `v=spf1 include:secureserver.net -all`, but the mail is Microsoft 365 — the MX points at
      `mail.protection.outlook.com` and DKIM is signed by Microsoft. `secureserver.net` resolves to
      GoDaddy's own ranges and does not authorise Microsoft's outbound servers, so mail sent from
      these addresses fails SPF against a hard `-all`, with DMARC at `p=quarantine`. DKIM alignment
      should still carry DMARC, but a receiver that checks SPF on its own — which government mail
      systems do — may quarantine an RTI appeal. The record should read
      `v=spf1 include:secureserver.net include:spf.protection.outlook.com -all`.
- [ ] A postal address for legal service. Still printed on the site with no address behind it.
- [ ] Enable **Netlify Analytics** on the site (dashboard only — it is a paid add-on, so the API
      cannot turn it on). Server-side, read from CDN logs: no cookies, no script, no consent banner,
      nothing added to the page. The privacy section is already written to describe this accurately.
      Deliberately not Google Analytics: this archive's likely readers are people who attended the
      protests it documents, and logging their reading to a third party is the threat model the
      project exists inside.
- [ ] Have a lawyer read the licence and privacy sections, and confirm whether accepting public
      submissions brings this within India's intermediary rules and their grievance-officer
      requirement.
- [ ] Have a Hindi-speaking editor read `data/i18n.generated.js` and `hi.html`. The interface is
      machine-translated, now by a model built for Indian languages, and the page says so. That is
      better than it was and is still not the same as a person having read it.
- [x] `config.siteUrl` pointed at `https://www.whogavetheorder.in`, 17 August 2026 — the day the
      domain began serving. The Atom feed and every citation build absolute URLs out of it.
- [ ] Backfill `archiveUrl` and `sha256` on the 32 imported sources. Every one is a live URL with a
      retrieval date and no archived copy, which the integrity check reports as a warning: a link is
      not a citation, because a page can be edited or taken down.
- [ ] Replace the Delhi High Court directions currently sourced to a news report with the order
      itself. See the case-law routes in [SOURCING.md](SOURCING.md#where-to-actually-get-the-text) —
      the Indian Kanoon API gives non-commercial projects ₹10,000 of free credit a month.
- [x] Netlify forms `wgo-evidence` and `wgo-demand` are registered, with email notifications
      routed to the project reviewer. The address is held in Netlify's site config and deliberately
      not in this repository. Submissions stay in Netlify, outside this repo, so unreviewed material
      never sits in a public place.

---

## The RTI register

`rti.html` lists every Right to Information application the project has filed. Add an `RTI-` record
on the **day you file**, not the day a reply arrives.

The reply-due date and any overdue count are computed from `filedOn` on every page load and are
never stored — a stored deadline goes stale, and a stale deadline in an accountability archive is
worse than none. An application that is 40 days late says so by itself, on a public page.

The clock stops when an office replies, even if the reply came late. Outcomes that count as replies
are `REPLY_RECEIVED`, `NO_RECORD_HELD`, `REFUSED` and `TRANSFERRED`; `LAPSED` means the statutory
period passed in silence, which the Act treats as a refusal and which opens the appeal.

The gap list on `submit.html#missing` gains a column from this: every open question shows either its
filed application and clock, or **Not yet requested**.

See [SOURCING.md](SOURCING.md) for what to ask each office for, and where to file, and
[RESEARCH-PROMPT.md](RESEARCH-PROMPT.md) for the reusable prompt that builds that map for a new
incident.

---

## Design notes

**Not a campaign site.** No party colours, no politician photographs, no protest-poster language,
no outrage red. The register is editorial and civic: a serif display face, generous whitespace,
hairline rules, restrained accents used only to carry evidence states. Public archive × newsroom ×
evidence room.

**`UNKNOWN` is the strongest visual state on the site** — inverted black, not a grey apology. It is
a finding, not an omission, and the interface treats it that way.

**Two claims the chain-of-command interface never merges:** *has authority* is a statement about
law and administrative structure; *is evidenced to have authorised this action* requires a
document. They are separate fields, separately displayed. There is not a single individual named
anywhere in the chain, and that is a rule rather than an oversight — a person is added to an office
only when a sourced document places them in it at the relevant time.

**Mobile first.** Most readers arrive from WhatsApp, X or Instagram on a phone. Verified at 320,
390, 768 and 1280 px, in light and dark, with the map degrading to a plain location list if Leaflet
or its tiles fail to load.

---

## Dependencies

One, and it is optional: Leaflet 1.9.4 from unpkg, for the incident map on `investigations.html`.
If it fails to load, the map renders as a linked list of locations. Everything else is vanilla
HTML, CSS and JavaScript with no build step, consistent with the rest of this repository.
