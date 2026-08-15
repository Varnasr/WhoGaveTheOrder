# WhoGaveTheOrder.in

A citizen-led public accountability platform. One question, asked systematically:

> When state power is used against citizens, who authorised it?

**Directory:** `whogavetheorder/` · **Stage:** Prototype · **Live path:** `/whogavetheorder/`

---

## The one thing to understand about this build

**It ships empty of factual assertions, on purpose.**

The three investigations named in the brief — Jantar Mantar, Bihar, Maharashtra — exist as
*shells*. The questions are populated, the chain of authority is mapped by statutory role, and
every factual field reads `UNKNOWN`. No date, no injury figure, no named official, no evidence
item has been entered, because none has been verified.

That is not an unfinished seed to be tidied up before launch. It is the product working as
designed. The brief's own rule (§23) is that the site must never manufacture certainty, and the
fastest way to violate it would have been to ship plausible-looking placeholder facts about real
events. A claim without a source ID does not render as a fact anywhere on this site — including in
its own seed data.

What is real here is the machinery: the content model, the evidence grammar, the integrity checks,
and the refusal to display a claim without a source.

---

## Running it

No build step, no dependencies to install.

```bash
# from the repo root
python3 -m http.server 8000
# then open http://localhost:8000/whogavetheorder/
```

Opening `index.html` directly off the filesystem also works — the data is loaded as plain scripts
rather than fetched JSON, so there is no CORS problem. The only things that need a server are the
map tiles and the Netlify Forms submission endpoints.

---

## Pages

| File | What it is |
|---|---|
| `index.html` | Homepage — hero, the three-column fact frame, first investigation, chain teaser, evidence legend |
| `investigations.html` | Investigation index and the incident map |
| `investigation.html?id=<slug>` | The seven-section investigation page — the heart of the product |
| `evidence.html` | Evidence library; `?id=WGO-0001` renders a single evidence record |
| `chain.html` | Chain of command, filterable by incident |
| `response.html` | Government response — our evidence / their response / what remains unanswered |
| `submit.html` | Submission form, the gap list, and the public demand |
| `others.html` | Index of other people's investigations, credited to them |
| `about.html` | Transparency: who runs it, funding, methodology, standards, corrections, privacy, takedown |
| `search.html` | One index across every entity |
| `rti.html` | RTI register — every application filed, with a live reply-due clock |
| `admin.html` | Editorial console — integrity checks, review workflow, record composer, CMS spec |

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
whogavetheorder/
├── SOURCING.md        # where the evidence actually comes from. Read this second.
├── data/
│   ├── taxonomy.js    # every controlled vocabulary + site config. Start here.
│   ├── records.js     # the record store. Add real content here.
│   └── samples.js     # layout samples, loaded only while demoMode is on
├── assets/
│   ├── styles.css     # design system and the evidence-state palette
│   ├── model.js       # relational graph, counts, search index, integrity checks
│   ├── ui.js          # chrome, chips, source lines, empty states
│   └── pages.js       # per-page controllers
└── *.html
```

If a status label is not defined in `taxonomy.js`, it does not render anywhere. That is what keeps
the evidence grammar from drifting page to page as the archive grows.

---

## Adding real content

1. **Add a `SRC-` record first.** Nothing can cite what does not exist.
2. **Add the `WGO-` evidence record**, pointing at that source. Fill in both `establishes` and
   `doesNotEstablish` — the second one is the harder half and is not optional in practice.
3. **Only then** set a claim, timeline event or authority link to a state other than `UNKNOWN`,
   listing the evidence IDs that carry it.

The [editorial console](admin.html) has a composer that emits records in exactly the right shape,
and an integrity check that flags:

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

## Before launch

- [ ] `data/taxonomy.js` → set `demoMode: false`. Samples disappear; nothing else changes.
- [ ] `data/taxonomy.js` → set `archiveStage` away from `PRE-LAUNCH` once evidence is published.
- [ ] `about.html` → fill in **who runs this project** and **funding**. Both currently render as
      visible "to be completed" blocks, deliberately: an unfinished disclosure is better shown
      than hidden.
- [ ] Provision the three contact addresses, plus a postal address for legal service.
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

See [SOURCING.md](SOURCING.md) for what to ask each office for, and where to file.

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
