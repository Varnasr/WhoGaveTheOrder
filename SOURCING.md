# Sourcing playbook

How to fill this archive. Written for whoever is doing the actual filing, calling and reading.

The site already tells you what to source. Every unanswered question carries the specific document
that would close it, and [`submit.html#missing`](submit.html) renders that as a work-list: *document
we are looking for → question it would answer → incident → whether we have asked for it yet*.

Sourcing here is not open-ended research. It is that table, one row at a time.

> **Verify the law before you rely on it.** Section numbers move. BNSS replaced the CrPC from
> mid-2024 and renumbered the assembly-and-dispersal provisions. Nothing in this playbook cites a
> section number for that reason, and neither does the site: `statutoryBasis` entries render
> NO SOURCE ON RECORD until a lawyer fills them in against the current text. Get that from someone
> who practises it.

---

## 1. RTI — the workhorse

The archive is built around one property of the Right to Information Act: **a reply saying "no such
record exists" is itself primary evidence.** It establishes what a public office has said about its
own files, on the record and attributably. An RTI never comes back empty.

### What to ask each office for

| Document | Who holds it |
|---|---|
| Deployment order, force requisition | District police HQ / Commissionerate |
| Station diary (roznamcha / GD) entries | The police station with jurisdiction |
| Wireless and control-room logs | Police control room |
| Armoury issue register | District armoury — *what equipment went out, and to whom* |
| Post-incident situation reports, and their routing | State home department; MHA for Delhi |
| Inquiry orders, magisterial inquiry notifications | District Magistrate / home department |
| Standing orders on crowd control | State police headquarters |

### Where to file

- **Union ministries** (including MHA, which is the route for Delhi, since Delhi Police reports to
  it rather than to a state government): `rtionline.gov.in`
- **Bihar and Maharashtra**: each state has its own mechanism. Check whether the state offers online
  filing or requires postal filing with a court-fee stamp, because that changes the volunteer
  workflow and the turnaround.

### Two provisions worth knowing cold

- **The shorter reply period where life or liberty is concerned.** Several questions in this archive
  arguably qualify. Claim it explicitly in the application when it applies, and say why.
- **The appeal ladder**: First Appellate Authority inside the office, then the Information
  Commission. Expect refusals on anything touching an investigation said to be ongoing, and treat
  the appeal as part of the plan rather than as a failure.

### The technique that actually cracks "who gave the order"

**File the same question at every rung of the chain, simultaneously.**

If the Union ministry says it is a state matter and the state says the force was Union-directed,
that contradiction is a finding. It narrows the chain without a single leaked document, and it goes
straight into `chain.html`. Ten offices each saying "not us" is a map.

### Log it the day you file

Add an `RTI-` record to `data/records.js` on the **day of filing**, not the day a reply arrives. The
register computes the reply-due date and any overdue count from `filedOn`, so an application that is
40 days late says so on the public page by itself. See the [RTI register](rti.html).

---

## 2. Legislature questions — the underrated route

A question tabled by an MP or MLA forces a **written, attributable answer from the ministry itself**.
For "who authorised the deployment", this is often faster and more citable than RTI, and it cannot be
refused the way an RTI can.

- **Union**: Lok Sabha and Rajya Sabha Q&A archives at `sansad.in`. MHA answers Delhi Police questions.
- **State**: Bihar Vidhan Sabha, Maharashtra Vidhan Sabha.

"Get this question tabled" is a concrete ask you can make of a sympathetic member, and the taxonomy
already carries `PARLIAMENTARY` as an evidence type. Time it to a session.

---

## 3. Court records

- **eCourts** for district and high courts; the Supreme Court registry for anything there.
- If a writ or PIL has been filed on any of these incidents, **the State's counter-affidavit is the
  highest-value document available anywhere.** Governments must state facts on affidavit, which
  routinely includes what was authorised and by whom.
- **FIRs** are public documents in most cases, and several state forces publish them online.
- **Bail and habeas orders** fix dates, sections and detainee counts.

---

## 4. The statutory layer

This is what answers *"was written authorisation required?"* — question 4 of the standard twelve.

- **State Police Manuals** carry the actual crowd-control standing orders. Often obtainable,
  sometimes already published.
- **Police Acts**: Delhi (1978), Bihar (2007), Maharashtra (1951).
- **BNSS** for assembly and dispersal powers, against the current text.

Get a lawyer to fill in `statutoryBasis` on the offices in `data/records.js`, with sources. Until
then those entries correctly render NO SOURCE ON RECORD.

---

## 5. Oversight bodies

**NHRC** has jurisdiction over police excess, and when it registers a case it seeks reports from the
DGP. Those reports are documents, and the case reference number is citable while the case is still
pending. State Human Rights Commissions in Bihar and Maharashtra work the same way.

---

## 6. Medical records and original media

**Medical**: medico-legal certificates and hospital records need the consent of the person they
concern, which the site's privacy policy already commits to. Aggregate admission figures via RTI to
government hospitals give you numbers without identities.

**Media**: original files, not forwards. A WhatsApp forward is stripped of the metadata that fixes
time and place, which is why submitted footage of unknown provenance stays UNVERIFIED, sometimes
permanently. Ask contributors for the file off the device that recorded it.

Geolocation, shadow and timestamp analysis, and unit-insignia identification are what move footage
from REPORTED to CORROBORATED.

---

## 7. Other people's work

Index it, credit it, link to the original, never mirror it. See [`others.html`](others.html) for
what qualifies. Indexing is not endorsement: an item can appear in that index and still sit at
REPORTED in the evidence library.

---

## Running the work

1. **Assign the work-list.** Every open question gets a named owner and a filing date. The gap list
   is the backlog.
2. **Log RTIs on filing.** The register turns the gap list into a clock, and the clock is public.
3. **Plan past the 30-day wall.** RTI timelines outlast news cycles. Legislature questions and court
   filings are what keep the archive moving in the meantime.
4. **Let refusals accumulate.** Every "not us" narrows the chain. This content model is unusually
   good at holding that, and few other formats are.
5. **File the reply as evidence, whatever it says.** The integrity check on the editorial console
   flags any RTI marked as answered whose reply has not been entered as an evidence record.

### Two limits, stated plainly

- **Oral orders leave no paper.** Where an order was given orally, the most this archive may
  establish is who was present and what was logged. That is a real ceiling, and the site says so on
  the About page rather than pretending otherwise.
- **Exemptions will be claimed hard** on anything touching an investigation described as ongoing.
  Budget for the appeal.

---

## Safety

Do not ask anyone to break a law, a service rule or a confidentiality obligation. Do not ask a source
to photograph a document somewhere they can be identified doing it. Where a document can be obtained
through an RTI instead, file the RTI.

Contributor contact details never enter this repository. They stay in the submission backend, and
they are never published, shown to a third party, or attached to a published record.
