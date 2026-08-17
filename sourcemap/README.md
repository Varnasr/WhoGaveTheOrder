# who-gave-the-order / source map, round 1

Machine-readable companion to the round-1 source map. Compiled 16 August 2026.

**Read `CLAUDE.md` before touching any data file.** It carries the six-state vocabulary, the prohibitions, and the legality and exposure constraints that govern every operation in this repo.

## Scope

Four incidents, in three jurisdictions, all postdating 1 July 2024 so the BNSS governs throughout with no CrPC overlay.

- Delhi: Jantar Mantar, 20 July 2026 and 22 July 2026
- Bihar: JP Golambar Patna 22 July; Katihar 23 July; Munger 23 July; Dakbungalow Square Patna 25 July
- Maharashtra: `UNKNOWN`, held open at the archive operator's instruction

## Files

| File | Contents |
|---|---|
| `CLAUDE.md` | Governing rules. Read first. |
| `evidence-items.json` | 136 sourced claims, each in one of six states |
| `open-questions.json` | 30 unanswered questions, prioritised |
| `filing-queue.json` | 12 lawful acquisition tasks, ordered by deadline |

## Current state

| State | Count |
|---|---|
| `VERIFIED` | 48 |
| `CORROBORATED` | 3 |
| `REPORTED` | 35 |
| `DISPUTED` | 1 |
| `UNVERIFIED` | 6 |
| `UNKNOWN` | 43 |

Open questions: 4 time-critical, 6 high, 14 medium, 6 standing.

The `UNKNOWN` count is high and is meant to be. It is not a backlog to be cleared by inference.

## Three things that change sequencing

**Delhi's destruction clock is judicially interrupted and Bihar's is not.** The Delhi High Court has directed preservation of CCTV and videography. No equivalent order was found for Patna, Katihar or Munger. Bihar is the urgent jurisdiction, which inverts the order the original brief implied.

**Maharashtra's RTI rules were remade twice in one month.** The rules gazetted 7 July 2026 supersede rules published 12 June 2026. Both bear the year 2026, so always specify the date. Rule 3(b) caps an application at one subject matter and 150 words, which means a bundled request is lawfully answerable in part only.

**No PIO designation was established for any office.** The whole document-custody category is `UNKNOWN`. The route out is s.4(1)(b) proactive disclosure, which is published rather than requested. `FQ-005` blocks most of the rest of the queue.

## One negative finding worth treating as substantive

No Supreme Court or NHRC guideline was found addressing the use of force against assemblies as distinct from custody and encounter deaths. The Indian accountability architecture is built around deaths, and BNSS s.151 protects officers acting in good faith under ss.148 to 150. See `GUI-GAP-001`, recorded as `UNVERIFIED` rather than as an established absence, because it is also the claim most likely to be wrong through a failure to search well.

## Verification debt

Two items assert `VERIFIED` on a URL that was not fetched in this pass: `RTI-ACT-001` and `RTI-ACT-002`, both pointing at the RTI Act on India Code. Confirm the URL resolves or downgrade both to `UNVERIFIED`.
