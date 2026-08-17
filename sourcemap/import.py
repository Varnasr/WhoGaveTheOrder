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

Run from the repo root:  python3 whogavetheorder/sourcemap/import.py
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
JURIS_TO_INCIDENT = {'delhi': 'INC-0001', 'bihar': 'INC-0002', 'maharashtra': 'INC-0003'}

# source-map category -> the site's evidence type vocabulary
CATEGORY_TO_TYPE = {
    'incident':               'OTHER_DOCUMENT',
    'legal_proceeding':       'COURT_DOCUMENT',
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

def source_id_for(s):
    url = s.get('url')
    key = url or ('nourl::' + (s.get('publication') or 'unattributed'))
    if key not in sources:
        sid = 'SRC-%04d' % (len(sources) + 1)
        sources[key] = sid
        source_records.append({
            'id': sid,
            'name': s.get('publication') or 'Unattributed source',
            'kind': (s.get('source_type') or 'secondary').upper(),
            'url': url,
            'retrievedOn': s.get('retrieved_on'),
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
    inc_id = JURIS_TO_INCIDENT.get(i['jurisdiction'])
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
    if i['category'] not in ABOUT_INCIDENT:
        continue
    evidence_records.append({
        'id': i['id'],
        'title': i['claim'][:160],
        'type': CATEGORY_TO_TYPE.get(i['category'], 'OTHER_DOCUMENT'),
        'verification': i['confidence'],
        'incidentId': JURIS_TO_INCIDENT.get(i['jurisdiction']),
        'dateOfItem': None,
        'dateAdded': '2026-08-16',
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
        'incidentIds': [JURIS_TO_INCIDENT[i['jurisdiction']]] if i['jurisdiction'] in JURIS_TO_INCIDENT else [],
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
        'state': 'UNANSWERED',
        'wants': [q['lawful_route']] if q.get('lawful_route') else [],
        'evidenceIds': [],
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
    fh.write('/* GENERATED by sourcemap/import.py — do not edit by hand.\n'
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
      f'sourcing-knowledge items — these belong in SOURCING.md')
print(f'wrote {out}')
