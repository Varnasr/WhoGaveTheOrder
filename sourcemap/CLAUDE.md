# CLAUDE.md

Project: citizen-led evidence archive documenting uses of state force against citizens and tracing the chain of authority behind them.

Read this file before touching any data file in this repo.

## The governing rule

A claim without a source does not render as a fact.

Every statement in this archive carries exactly one of six states. Moving a claim between states requires a document. The archive currently holds zero evidence items and publishes its open-question count. Both of those numbers are load-bearing: an empty archive that says it is empty is correct, and an archive with one invented citation is worse than useless.

## The six states

| State | Meaning | Requirement to enter this state |
|---|---|---|
| `VERIFIED` | Official or primary source held, URL present | A URL to an official or primary document. Gazette, India Code, court order, portal page, statutory commission record. |
| `CORROBORATED` | Two or more independent credible secondary sources agree | At least two URLs from sources that are actually independent of each other. Three outlets syndicating one PTI wire is one source, not three. |
| `REPORTED` | One credible secondary source | One URL. Named publication. |
| `DISPUTED` | Credible sources conflict | URLs for each side. Do not resolve the conflict by picking a side. |
| `UNVERIFIED` | A claim exists in the record but no adequate source has been found | Describe what the claim is and where it was encountered. |
| `UNKNOWN` | Could not be established | This is a valid, publishable state. It is the default. |

`UNKNOWN` is not a failure condition. Do not treat reducing the UNKNOWN count as a goal. Do not fill an UNKNOWN with an inference, a plausible reconstruction, or a value carried over from a similar jurisdiction.

## Hard prohibitions

Do not invent, and do not derive by pattern from a similar example:

- URLs
- portal names
- statutory section numbers
- office designations or PIO titles
- case numbers, diary numbers, file numbers
- report titles
- publication names
- dates

If a value is not in a source you can point to, the value is `UNKNOWN` and the `source_url` is `null`.

A URL you have not fetched is not a verified URL. Constructing a URL by editing the path of a URL you have seen is inventing a URL.

## Field discipline

- `confidence` must be one of the six states. No other value.
- `source_url` must be `null` or a URL that was actually retrieved. Never a placeholder, never a search query, never a homepage standing in for a deep link.
- `source_type` distinguishes `primary` (gazette, statute, court order, official portal) from `secondary` (news, blog, aggregator) from `tertiary` (Wikipedia, encyclopaedic summary).
- Any claim at `VERIFIED` must have `source_type: "primary"`.
- Any claim at `CORROBORATED` must have two or more entries in `sources[]`.
- `retrieved_on` is the date the URL was actually fetched, not the date of the underlying document.
- `as_stated` holds the source's own framing. `as_asserted_by_archive` holds nothing unless the archive is itself making a claim, which it usually is not.

## Prohibition on narrative

This archive does not say what happened. It says where the documents are and what state each claim is in. Do not generate summaries, chronologies, or accounts of events. If asked to, produce a list of sourced claims with their states instead.

Do not aggregate REPORTED items into a narrative that reads as established. Two REPORTED claims placed adjacent in prose imply a connection the sources do not support.

## Legality constraint on generated tasks

Every acquisition route this repo proposes must be lawful and available to an ordinary person. Permitted: statutory information requests, published court and legislature records, complaints to statutory commissions, written representations to public offices, proactive disclosure under s.4(1)(b) RTI Act.

Never generate a task that would require a person to breach a law, a service rule, or a confidentiality obligation. Never propose obtaining a document through an insider, a leak, or an unauthorised access route. If a document appears obtainable only that way, the correct output is an open question, not a task.

## Source exposure

Two operations in this repo can permanently expose a person:

1. The HRCNet complaint form has a toggle controlling whether the complainant's and victim's names appear on the public site. That choice is made at submission and is not casually reversible.
2. An RTI applicant's name and address appear on the application and may be disclosed to a third party under s.11 RTI Act where third-party information is involved. A resident co-filer used to solve a citizenship or payment problem is therefore exposed.

Any task touching either must carry `exposure_risk: true` and must not be auto-executed.

## Jurisdictional non-generalisation

Delhi, Bihar and Maharashtra diverge materially and must not be collapsed.

- Delhi Police reports to the Ministry of Home Affairs, not to the Government of NCT of Delhi. Its RTI route is the Union portal.
- Bihar runs its own system including a telephone filing route.
- Maharashtra's rules were remade on 7 July 2026, superseding rules published on 12 June 2026, and impose a one-subject, 150-word cap per application.

Never carry a fee, a form, a deadline, or an office designation from one jurisdiction to another. If a value is established for Delhi and not for Bihar, the Bihar value is `UNKNOWN`.

A commissionerate city and a district have different structures. In a commissionerate the Commissioner of Police concentrates the relevant powers. In a district they split between the District Magistrate and the Superintendent of Police, with the DM holding executive magistrate functions including requisition of armed force under BNSS s.149. Do not apply one structure's office names to the other.

## Volatility

Flag on read, do not silently rely on:

- RTI portals get migrated. Bihar's Jaankari was replaced on 1 October 2025.
- Fees get revised. Maharashtra's were revised twice in June and July 2026.
- The CrPC to BNSS transition renumbered provisions. All incidents in this repo postdate 1 July 2024, so BNSS governs and there is no CrPC overlay. CrPC equivalents are recorded only so the archive can read pre-2024 material.
- Retention schedules destroy records. Any item in `filing-queue.json` with `deadline_driven: true` may be moot by the time it is filed, and that motion is itself a documentable fact.

Any record whose `volatility` field is `high` must be re-verified before it is used to support a published claim.

## Files

- `evidence-items.json` — sourced claims, each with a state
- `open-questions.json` — everything that could not be established
- `filing-queue.json` — lawful acquisition tasks, ordered by deadline

## Reporting

When asked for the archive's status, report the count of items by state and the count of open questions. Do not editorialise about the ratio.
