#!/usr/bin/env python3
"""
Import the round-1 source map into the website's record store.

WHY THIS IS NOT A FLAT DUMP
The source map holds three different kinds of record, and only one of them is
evidence about the incidents:

  about the incidents   -> incidents, evidence, external index
  how to obtain records -> SOURCING.md, not the evidence library
  the legal framework   -> the offices' statutoryBasis

Dumping all 136 into WGO.evidence would fill the evidence library with facts
about RTI filing fees, which establish nothing about Jantar Mantar.

WHAT THIS SCRIPT WILL NOT DO
It does not upgrade a state. A claim arrives at whatever confidence the source
map gave it and stays there. It does not invent establishes/doesNotEstablish
text: where the source map has no basis for one, the field is left empty and the
site renders 'Not recorded.'

Run from the repo root:  python3 sourcemap/import.py
Writes: whogavetheorder/data/records.generated.js
"""

import json
import pathlib
import re
from collections import OrderedDict

HERE = pathlib.Path(__file__).resolve().parent
SITE = HERE.parent
SRC = HERE

ev = json.load(open(SRC / 'evidence-items.json'))
oq = json.load(open(SRC / 'open-questions.json'))
fq = json.load(open(SRC / 'filing-queue.json'))

# --- category routing --------------------------------------------------------
ABOUT_INCIDENT = {'incident', 'legal_proceeding'}
EXTERNAL       = {'existing_documentation'}
FRAMEWORK      = {'statute', 'police_manual', 'guideline', 'precedent'}
# everything else is sourcing knowledge and stays in SOURCING.md


# jurisdiction -> the site's incident shells
JURIS_TO_INCIDENT = {'delhi': 'INC-0001', 'bihar': 'INC-0002', 'maharashtra': 'INC-0003',
                     'kerala': 'INC-0005'}


def incident_for(item):
    # Which incident shell an item belongs to. Normally the jurisdiction decides,
    # but a state can hold more than one incident: Siwan on 25 July is not Patna
    # on 22 July, and filing Siwan facts under the Patna record would be the
    # collapsing of distinct events that CLAUDE.md forbids between jurisdictions
    # and that is no more acceptable within one. An item may therefore name its
    # incident directly, and that wins.
    return item.get('incident') or JURIS_TO_INCIDENT.get(item['jurisdiction'])


def about_incident(item):
    # Does this item state a fact about one of the incidents?
    #
    # The `oversight` category does double duty. Most of it is mechanics - how
    # HRCNet works, what its dropdown contains, whether it accepts a foreign
    # mobile number - and that is sourcing knowledge. But a human rights
    # commission taking suo motu cognisance OF ONE OF THESE INCIDENTS is a
    # proceeding about the incident, in the same way the High Court PIL is, and
    # it was never reaching the site: the NHRC's notice to the Commissioner of
    # Police, corroborated by four independent outlets, appeared nowhere on the
    # website except as a string inside an open question.
    #
    # The line between the two is already in the data. An oversight item
    # carrying a real incident jurisdiction is about that incident; one carrying
    # `all` is mechanics. Nothing else is swept in on that rule - rti_mechanics
    # and retention items also carry a jurisdiction, but a state's retention
    # schedule is knowledge about how to obtain a record, not a fact about what
    # happened.
    if item['category'] in ABOUT_INCIDENT:
        return True
    return item['category'] == 'oversight' and item['jurisdiction'] in JURIS_TO_INCIDENT

# source-map category -> the site's evidence type vocabulary
CATEGORY_TO_TYPE = {
    'incident':               'OTHER_DOCUMENT',
    'legal_proceeding':       'COURT_DOCUMENT',
    # A commission's notice is not a court document and the taxonomy has no
    # nearer type, so it takes the honest default rather than borrowing one.
    'oversight':              'OTHER_DOCUMENT',
    'existing_documentation': 'NEWS_REPORT',
    'statute':                'OTHER_DOCUMENT',
    'police_manual':          'OTHER_DOCUMENT',
    'guideline':              'OTHER_DOCUMENT',
    'precedent':              'COURT_DOCUMENT',
}


def js(value, indent=0):
    """Serialise to JS literal. json.dumps is valid JS for our shapes."""
    return json.dumps(value, indent=2, ensure_ascii=False).replace('\n', '\n' + ' ' * indent)


# --- 1. sources --------------------------------------------------------------
# Every distinct URL in the source map becomes one SRC- record. Items then cite
# it by ID, so a correction to a source propagates everywhere it is used.
sources = OrderedDict()          # url -> SRC- id
source_records = []

# SRC- ids used to be positional: 'SRC-%04d' % (len(sources) + 1), assigned on
# first encounter while walking the records in file order. That meant adding a
# source to any early record renumbered every id after it. It never fired while
# the archive only grew by appending and the sweep only filled archiveUrl on
# sources that already existed; the first real content edit shifted 18 ids, so
# that SRC-0064 stopped meaning the Maharashtra Police Act and started meaning a
# commercial bare-act site. These ids are published: they appear in feed.xml and
# in the change log, and a syndicated identifier that changes what it points at
# is worse than no identifier at all.
#
# The allocation is therefore recorded rather than recomputed. A key that is in
# the ledger keeps its id forever, wherever its record moves in the file; a key
# that is not gets the next id after the highest ever issued, never a gap that a
# later insert could reuse. Delete an entry only if you mean to retire the id,
# and do not reuse a retired one.
LEDGER = SRC / 'source-ids.json'
ledger = json.load(open(LEDGER)) if LEDGER.exists() else {}
_ledger_at_start = dict(ledger)


def _next_source_id():
    used = [int(v.split('-')[1]) for v in ledger.values()]
    return 'SRC-%04d' % ((max(used) + 1) if used else 1)

def source_id_for(s):
    url = s.get('url')
    key = url or ('nourl::' + (s.get('publication') or 'unattributed'))
    if key in sources:
        # The same URL can be cited by several items, and only the first one
        # created the SRC- record. If a later citation knows something the first
        # did not - where the source got its information, an archived copy - fill
        # the gap rather than discarding it. Existing values are never overwritten.
        existing = next(r for r in source_records if r['id'] == sources[key])
        for field, key_in in (('originatesFrom', 'originates_from'),
                              ('archiveUrl', 'archive_url'),
                              ('archivedOn', 'archived_on'),
                              ('sha256', 'sha256'),
                              ('retrievedOn', 'retrieved_on')):
            if not existing.get(field) and s.get(key_in):
                existing[field] = s.get(key_in)
    if key not in sources:
        sid = ledger.get(key) or _next_source_id()
        ledger[key] = sid
        sources[key] = sid
        # Fixity travels with the source. A link is not a citation: pages are
        # edited, paywalled and taken down, and a source that cannot be shown to
        # be the one we read is a source the archive cannot defend. These are
        # carried through when the source map has them and left null when it
        # does not: the integrity check reports the gap rather than the import
        # inventing a value for it.
        source_records.append({
            'id': sid,
            'name': s.get('publication') or 'Unattributed source',
            'kind': (s.get('source_type') or 'secondary').upper(),
            'url': url,
            'retrievedOn': s.get('retrieved_on'),
            'archiveUrl': s.get('archive_url'),
            'archivedOn': s.get('archived_on'),
            'sha256': s.get('sha256'),
            # Where the source got it. Two outlets reading one affidavit are two
            # reports of one thing, not two independent accounts of it.
            'originatesFrom': s.get('originates_from'),
        })
    return sources[key]


# --- 2. incidents ------------------------------------------------------------
# The source map fixes real dates and places. Only fields it actually
# establishes are written; everything else stays UNKNOWN.
incident_items = [i for i in ev if i['category'] == 'incident']

DATE_RE = re.compile(r'on (\d{1,2} \w+ \d{4})')
PLACE_RE = re.compile(r'at ([^,]+(?:, [^,]+)?),? on ')

incident_updates = {}
for i in incident_items:
    inc_id = incident_for(i)
    if not inc_id:
        continue
    d = DATE_RE.search(i['claim'])
    p = PLACE_RE.search(i['claim'])
    slot = incident_updates.setdefault(inc_id, {'dates': [], 'places': [], 'items': [], 'state': set()})
    if d: slot['dates'].append(d.group(1))
    if p: slot['places'].append(p.group(1).strip())
    slot['items'].append(i['id'])
    slot['state'].add(i['confidence'])


# --- 3. evidence -------------------------------------------------------------
evidence_records = []
for i in ev:
    if not about_incident(i):
        continue
    evidence_records.append({
        'id': i['id'],
        'title': i['claim'][:160],
        'type': CATEGORY_TO_TYPE.get(i['category'], 'OTHER_DOCUMENT'),
        'verification': i['confidence'],
        'incidentId': incident_for(i),
        'dateOfItem': None,
        # The date this record entered the archive. Every evidence record used to
        # carry a hardcoded 2026-08-16, the date of the first import, which was
        # true for all 161 of them and became a false statement on the page the
        # moment a 162nd was added. An item carries `added_on` if it arrived
        # later; the default is the original import.
        'dateAdded': i.get('added_on', '2026-08-16'),
        'sourceIds': [source_id_for(s) for s in i['sources']],
        'origin': '',
        'establishes': i.get('notes') or '',
        'doesNotEstablish': '',
        'relatedIds': [],
        'accessNote': '',
        'volatility': i.get('volatility'),
    })


# --- 4. external index -------------------------------------------------------
external_records = []
for i in ev:
    if i['category'] not in EXTERNAL:
        continue
    pub = i['sources'][0].get('publication') if i['sources'] else None
    url = i['sources'][0].get('url') if i['sources'] else None
    external_records.append({
        'id': i['id'],
        'title': re.sub(r'^Published item documenting the \w+ incident: ', '', i['claim'])[:160],
        'creator': pub or 'Creator not recorded',
        'kind': 'Report',
        'date': None,
        'url': url,
        'incidentIds': [incident_for(i)] if incident_for(i) else [],
        'note': i.get('notes') or '',
        'confidence': i['confidence'],
    })


# --- 5. statutory framework --------------------------------------------------
# These fill the offices' statutoryBasis, which is the field that has rendered
# NO SOURCE ON RECORD since the site was built.
framework_records = []
for i in ev:
    if i['category'] not in FRAMEWORK:
        continue
    framework_records.append({
        'id': i['id'],
        'text': i['claim'],
        'confidence': i['confidence'],
        'sourceIds': [source_id_for(s) for s in i['sources']],
        'category': i['category'],
        'jurisdiction': i['jurisdiction'],
        'note': i.get('notes') or '',
    })


# --- 6. open questions -------------------------------------------------------
PRIORITY_MAP = {'time_critical': 'TIME_CRITICAL', 'high': 'HIGH', 'medium': 'MEDIUM', 'standing': 'STANDING'}
question_records = []
for q in oq:
    question_records.append({
        'id': q['id'],
        'incidentId': JURIS_TO_INCIDENT.get(q['jurisdiction']),
        'text': q['question'],
        'priority': PRIORITY_MAP.get(q['priority'], 'MEDIUM'),
        'whyItMatters': q.get('why_it_matters') or '',
        'lawfulRoute': q.get('lawful_route') or '',
        # A question could not be answered before this: state was hardcoded to
        # UNANSWERED and evidenceIds to empty, so every question on the site sat
        # at UNANSWERED however much evidence the archive held, and the one
        # thing the project exists to do could never be shown to have happened.
        # `answered_by` names the evidence ids that answer it; `answer_state`
        # overrides the default where a question is only partly closed. The
        # model still refuses to upgrade anything on its own, and check.js still
        # reports an ANSWERED question with no evidence attached.
        'state': (q.get('answer_state')
                  or ('ANSWERED' if q.get('answered_by') else 'UNANSWERED')),
        'wants': [q['lawful_route']] if q.get('lawful_route') else [],
        'evidenceIds': q.get('answered_by') or [],
        'blocks': q.get('blocks') or [],
        'category': q.get('category'),
    })


# --- 7. filing queue ---------------------------------------------------------
# These are PLANNED acquisitions, not filed applications. They must not enter
# the RTI register, which tracks applications that already have a clock running.
filing_records = []
for t in sorted(fq, key=lambda x: x['sequence']):
    filing_records.append({
        'id': t['id'],
        'sequence': t['sequence'],
        'deadlineDriven': t['deadline_driven'],
        'incidentId': JURIS_TO_INCIDENT.get(t['jurisdiction']),
        'jurisdiction': t['jurisdiction'],
        'action': t['action'],
        'authority': t['authority'],
        'method': t['method'],
        'cost': t['cost'],
        'legalBasis': t['legal_basis'],
        'exposureRisk': t['exposure_risk'],
        'notes': t['notes'],
        'resolves': t.get('resolves') or [],
    })


# --- 8. office <- framework assignment ---------------------------------------
# THE EDITORIAL JUDGEMENT. Which provision binds which office is a reading, not
# a lookup, so every assignment carries its reason. Two rules govern it:
#
#   1. A provision is assigned to the office that the provision itself names or
#      empowers. Where the text names the District Magistrate, it goes to the
#      District Magistrate and not to the police officer who acts on it.
#   2. A commissionerate and a district are not the same structure. In a
#      commissionerate the Commissioner concentrates powers that a district
#      splits between the DM and the SP, so the same subject matter lands on
#      different offices depending on jurisdiction.
#
# PREC-* records are deliberately excluded: they document how other archives
# were built, which is methodology, not the statutory basis of an office.
OFFICE_FRAMEWORK = {
    'OFC-0001': [  # Union Ministry of Home Affairs
        ('LAW-DEL-001', 'Delhi Police is a Union-administered force; the Act constituting its powers is the framework the ministry administers.'),
    ],
    'OFC-0002': [  # State Home Department
        ('LAW-CMD-001', 'Whether any state police statute imposes command responsibility is unresolved, and the home department is where such a provision would sit.'),
        ('MAN-BIH-001', 'The police manual is issued under state government authority, which makes the home department its custodian.'),
        ('MAN-MAH-001', 'As above, for Maharashtra.'),
    ],
    'OFC-0003': [  # Director General of Police
        ('GUI-NHRC-001', 'The NHRC instruction directs District Magistrates and Superintendents of Police to report; the DGP is the force-wide channel through which that reporting is enforced.'),
        ('GUI-NHRC-003', 'The 48-hour reporting requirement for deaths during police action binds the force, not an individual district.'),
    ],
    'OFC-0004': [  # Commissioner of Police (commissionerate cities incl. Delhi)
        ('LAW-DEL-001', 'Delhi Police Act ss.28 to 30: regulation of public places, directions to the public, and the power to prohibit certain acts.'),
        ('LAW-DEL-002', 'Delhi Police Act s.31(3) and (4) names the Commissioner of Police as the office that may prohibit an assembly by promulgated notification.'),
        ('LAW-MAH-001', 'Maharashtra Police Act s.37 and the enforcement provisions at ss.70 and 71.'),
        ('LAW-MAH-002', 'Maharashtra Police Act ss.36 and 37 name the Commissioner or the District Magistrate; in a commissionerate the power sits here.'),
        ('MAN-DEL-001', 'Whether Delhi Police standing orders on crowd control exist as a discrete published document is unresolved.'),
    ],
    'OFC-0005': [  # District Magistrate
        ('LAW-BNSS-003', 'The amended s.149 names the District Magistrate, or another Executive Magistrate authorised in writing, as the office that may requisition armed force.'),
        ('LAW-BNSS-005', 'BNSS s.163, urgent cases of nuisance or apprehended danger, is an executive magistrate power.'),
        ('LAW-BNSS-006', 'BNSS s.196 governs magisterial inquiry into a death, which is a magistrate function.'),
        ('LAW-MAH-002', 'Outside a commissionerate the same Maharashtra Police Act powers sit with the District Magistrate.'),
        ('GUI-NHRC-002', 'The two-month reporting requirement covers the magisterial inquiry report, which this office produces.'),
        ('GUI-NHRC-004', 'The 1997 NHRC procedure was addressed to Chief Ministers and operates through district administration.'),
    ],
    'OFC-0006': [  # Superintendent / Deputy Commissioner of Police (district)
        ('LAW-BIH-001', 'Bihar Police Act s.66 regulates public meetings and processions through the district police structure.'),
        ('LAW-BIH-002', 'The citation of the Bihar Police Act is itself disputed and is recorded as such.'),
        ('GUI-NHRC-001', 'The NHRC instruction names Superintendents of Police as reporting officers.'),
    ],
    'OFC-0007': [  # Officer commanding the deployment on site
        ('LAW-BNSS-001', 'BNSS s.148 places dispersal by civil force with the officer commanding at the scene.'),
        ('LAW-BNSS-002', 'The CrPC to BNSS mapping is recorded so pre-2024 material can be read against the current provisions.'),
    ],
    'OFC-0008': [  # Field personnel and units deployed
        ('LAW-BNSS-004', 'BNSS s.149(3) binds the armed forces officer acting on a requisition to use as little force as is consistent with dispersing the assembly.'),
        ('LAW-BNSS-001', 'BNSS s.150 empowers certain armed force officers to disperse an assembly; s.151 concerns protection for acts done in good faith.'),
    ],
}

office_basis = {}
framework_by_id = {f['id']: f for f in framework_records}
missing_refs = []
for office_id, entries in OFFICE_FRAMEWORK.items():
    rows = []
    for fid, reason in entries:
        if fid not in framework_by_id:
            missing_refs.append((office_id, fid))
            continue
        f = framework_by_id[fid]
        rows.append({
            'frameworkId': fid,
            'text': f['text'],
            'confidence': f['confidence'],
            'sourceIds': f['sourceIds'],
            'why': reason,
        })
    office_basis[office_id] = rows

# Methodology precedents: about how other archives were built, not about an
# office's powers. Kept separate so they cannot leak into a statutory claim.
precedents = [f for f in framework_records if f['id'].startswith('PREC-')]

# --- write -------------------------------------------------------------------
out = SITE / 'data' / 'records.generated.js'
with open(out, 'w') as fh:
    fh.write('/* GENERATED by sourcemap/import.py: do not edit by hand.\n'
             '   Regenerate after changing sourcemap/*.json. */\n\n'
             'window.WGO = window.WGO || {};\n\n')
    fh.write('WGO.importedSources = ' + js(source_records) + ';\n\n')
    fh.write('WGO.importedEvidence = ' + js(evidence_records) + ';\n\n')
    fh.write('WGO.importedExternal = ' + js(external_records) + ';\n\n')
    fh.write('WGO.importedFramework = ' + js(framework_records) + ';\n\n')
    fh.write('WGO.importedQuestions = ' + js(question_records) + ';\n\n')
    fh.write('WGO.importedFilings = ' + js(filing_records) + ';\n\n')
    fh.write('WGO.importedOfficeBasis = ' + js(office_basis) + ';\n\n')
    fh.write('WGO.importedPrecedents = ' + js(precedents) + ';\n\n')
    fh.write('WGO.importedIncidentFacts = ' + js({
        k: {'dates': sorted(set(v['dates'])), 'places': sorted(set(v['places'])),
            'evidenceIds': v['items'], 'state': sorted(v['state'])}
        for k, v in incident_updates.items()
    }) + ';\n')

print(f'sources    {len(source_records):>4}')
print(f'evidence   {len(evidence_records):>4}   (incident + legal_proceeding)')
print(f'external   {len(external_records):>4}   (existing_documentation)')
print(f'framework  {len(framework_records):>4}   (statute, manual, guideline, precedent)')
print(f'questions  {len(question_records):>4}')
print(f'filings    {len(filing_records):>4}')
print(f'precedents {len(precedents):>4}   (methodology, not statutory basis)')
print(f'\noffice assignments:')
for k in sorted(office_basis):
    print(f'  {k}  {len(office_basis[k]):>2} provision(s)')
if missing_refs:
    print('\nMISSING framework refs:', missing_refs)
print(f'\nincident facts recovered:')
for k, v in incident_updates.items():
    print(f'  {k}: dates={sorted(set(v["dates"]))} places={sorted(set(v["places"]))[:2]}')
print(f'\nnot imported: {len([i for i in ev if i["category"] not in ABOUT_INCIDENT|EXTERNAL|FRAMEWORK])} '
      f'sourcing-knowledge items: these belong in SOURCING.md')
print(f'wrote {out}')

# The ledger is written back so a newly allocated id survives to the next run.
# Sorted by id, so the diff on a content change is the one line that was added
# rather than a reshuffle, and so a reviewer can see at a glance what is new.
if ledger != _ledger_at_start:
    with open(LEDGER, 'w') as fh:
        json.dump(dict(sorted(ledger.items(), key=lambda kv: kv[1])),
                  fh, indent=2, ensure_ascii=False)
        fh.write('\n')
    added = {k: v for k, v in ledger.items() if k not in _ledger_at_start}
    print(f'source ids: {len(ledger)} allocated, {len(added)} new')
    for k, v in sorted(added.items(), key=lambda kv: kv[1]):
        print(f'  {v}  {k}')
