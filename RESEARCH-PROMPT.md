# Research prompt: building the source map

A reusable prompt for finding **where documents live and how to obtain them**, to be run in a
research-capable assistant with web search enabled.

Run it once per new incident the archive takes on. Its output feeds
[`SOURCING.md`](SOURCING.md), the offices' `statutoryBasis` fields in `data/records.js`, and the
external index on `others.html`.

**Before you paste it:** update the incident list in the Context block to whatever you are
researching. Everything else is reusable as-is.

**Before you commit anything it returns:** verify each row. The prompt demands a URL for every
factual claim precisely so that each one is checkable in about thirty seconds. A research model
under pressure to be helpful is exactly the failure mode this archive exists to guard against, and
a fabricated citation in an accountability archive is worse than an empty section.

---

## The prompt

````markdown
# Research task: source map for a public accountability archive (India)

## Context

I run a citizen-led evidence archive documenting uses of state force against
citizens and tracing the chain of authority behind them. It is live at:

    https://varnasr-experiments.netlify.app/whogavetheorder/

(also reachable at https://idealogworks.foo/whogavetheorder/ — same site, the
project's own domain is not registered yet)

Do not treat anything on that site as established fact — every factual field
currently reads UNKNOWN by design. Use it to understand the archive's structure
and its open questions, not as a source.

The first investigation covers police action against students at Jantar Mantar
(Delhi), and in Bihar and Maharashtra.

The archive's governing rule: **a claim without a source does not render as a
fact.** Every statement carries one of six states — VERIFIED, CORROBORATED,
REPORTED, DISPUTED, UNVERIFIED, UNKNOWN — and moving a claim between them
requires a document. It currently holds zero evidence items and 38 unanswered
questions, and says so publicly.

I need a **source map**: where the documents actually live, who holds them, and
exactly how to obtain them. I am not asking you to tell me what happened.

## What I need

### 1. RTI filing mechanics, per jurisdiction

For each of: (a) Union ministries via rtionline.gov.in — the route for Delhi,
since Delhi Police reports to the Ministry of Home Affairs rather than a state
government; (b) Bihar; (c) Maharashtra.

- Exact filing URL, or confirmation that no online portal exists and postal
  filing is required
- Fee, and accepted payment methods (including how BPL applicants are exempted)
- Whether non-residents/non-citizens can file, and any state-specific restrictions
- How to address the application to the correct Public Information Officer
- Statutory reply period, the shorter period where life or liberty is concerned,
  and the extended period where third-party information is involved
- First Appellate Authority and Information Commission appeal routes, with time
  limits for each
- What happens procedurally when the deadline passes with no reply

### 2. Which office holds which document

For each document type below, identify the specific public authority that would
hold it in a commissionerate city (Delhi) and in a district (Bihar/Maharashtra),
and the correct PIO to address:

- Deployment orders and force requisitions
- Station diary / roznamcha / General Diary entries
- Wireless and control-room logs
- Armoury issue registers (what crowd-control equipment was issued, and to whom)
- Post-incident situation reports, and their routing up the chain
- Magisterial inquiry orders and their findings
- Standing orders on crowd control and the use of force

### 3. Statutory framework — current text only

- The provisions of the **Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023** that
  govern unlawful assembly, dispersal, and the use of force in aid of civil
  power. Give current section numbers and note which CrPC sections they replaced.
  **Flag explicitly if you are not confident of the current numbering.**
- Delhi Police Act 1978, Bihar Police Act 2007, Maharashtra Police Act 1951 —
  the provisions bearing on command responsibility and the use of force
- Whether the State Police Manuals for Delhi, Bihar and Maharashtra are publicly
  available, and where. If they are obtainable only by RTI, say so.
- Any binding NHRC or Supreme Court guidelines on the use of force against
  assemblies, and on reporting after such incidents

### 4. Court records

- How to search eCourts for cases by district, party name and case type
- Access to Delhi High Court, Patna High Court, Bombay High Court and Supreme
  Court records — what is free, what is paywalled, what needs a registry visit
- Whether FIRs are published online by Delhi Police, Bihar Police and
  Maharashtra Police, and at what URL
- How to obtain a State's counter-affidavit in a pending writ or PIL

### 5. Legislature questions

- How to search Lok Sabha and Rajya Sabha questions and answers on sansad.in
- The same for Bihar Vidhan Sabha and Maharashtra Vidhan Sabha
- The procedure and deadlines for getting a question tabled through a member
- Session calendars for the coming year

### 6. Oversight bodies

- NHRC complaint procedure, what documents a registered case generates, whether
  reports called for from a DGP become accessible, and how to cite a pending case
- The equivalents for the Bihar and Maharashtra State Human Rights Commissions

### 7. What is already publicly documented

For each of the three incidents, what already exists in the public domain —
news reports, video, legal filings, fact-finding reports by civil society.

**For this section only, list nothing you cannot link to.** If you are unsure
whether a specific report exists, say "not found" rather than describing a
plausible one. I would rather receive an empty section than one item I have to
discover is invented. Where you do find something, give: publication, author,
date, URL, and one line on what it documents.

### 8. Precedent projects

Comparable accountability archives in India or elsewhere that have documented
state violence through primary documents. What their sourcing strategy was, and
what went wrong for them — legal pressure, takedowns, source exposure.

## Output format

Structure the answer by the eight sections above. Within each, give me rows I
can act on:

| Document / fact | Where it lives | How to obtain it | Cost & time | Source URL | Confidence |

Use these confidence values, matching my archive's own vocabulary:

- **VERIFIED** — you have an official or primary source, and you are giving me
  its URL
- **REPORTED** — a credible secondary source says so; give the URL
- **UNKNOWN** — you could not establish it

## Rules

1. **Every factual claim gets a URL.** A claim without one is not useful to me;
   mark it UNKNOWN instead of asserting it.
2. **Do not invent** URLs, portal names, section numbers, office designations,
   case numbers, report titles or publication names. If you are unsure whether
   something exists, say so. This is the single most important instruction here:
   an archive built on a fabricated citation is worse than an empty one.
3. **Flag anything that may have changed recently** — RTI portals get migrated,
   fees get revised, and the CrPC→BNSS transition renumbered a lot of provisions.
4. **Prefer the official source** over an explainer article, always.
5. Where a state's process differs materially from the Union's, say so
   explicitly rather than generalising across India.
6. End with a section titled **"What I could not establish"**, listing every
   question above you were unable to answer from a citable source. I need that
   list as much as the answers — it becomes the next round of work.

## Safety constraint

Do not suggest any method of obtaining documents that would require a person to
break a law, a service rule, or a confidentiality obligation. Everything you
propose must be a lawful route available to an ordinary citizen.
````

---

## Where the output goes

| Section | Destination |
|---|---|
| 1, 2 | `SOURCING.md` — replaces the places it currently hedges on state-level filing |
| 3 | `statutoryBasis` on the offices in `data/records.js`, with `sourceIds`. These render **NO SOURCE ON RECORD** today because the build refused to guess at BNSS numbering. |
| 4, 5, 6 | `SOURCING.md`, and new `RTI-`-adjacent routes for questions RTI cannot reach |
| 7 | `EXT-` records on `others.html` — each credited and linked, never mirrored |
| 8 | Editorial judgement; some of it belongs in the About page's risk section |
| "What I could not establish" | The next round of work. Treat it as a backlog, not a failure. |

## A note on pasting the live URL

Including the URL is useful: a research assistant can read the evidence grammar, the open questions
and the gap list directly, which sharpens section 7.

It is also public. The research query, and anything fetched, goes to the assistant's provider.
Nothing on the site is sensitive while the archive is empty. **Once it holds real submissions, do
not paste working URLs of unpublished material into any assistant.** Contributor data lives in the
submission backend and should never travel through a chat window.
