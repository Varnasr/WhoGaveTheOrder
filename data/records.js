/* =============================================================================
   WhoGaveTheOrder.in — the record store
   -----------------------------------------------------------------------------
   THE SEED RULE
   This file ships EMPTY OF FACTUAL ASSERTIONS. The three investigations exist
   as shells: the questions are populated, the offices that hold authority are
   mapped by statutory role, and every factual field is UNKNOWN until an editor
   attaches a source.

   That is not a placeholder problem to be tidied up later. It is the product:
   a claim without a source ID does not render as a fact anywhere on this site.

   ADDING REAL CONTENT
   1. Add a Source record first. Nothing else can cite what does not exist.
   2. Add the Evidence record, pointing at that source.
   3. Only then set a claim, timeline event, or authority link to a state other
      than UNKNOWN, listing the evidence IDs that carry it.
   Records whose `sourceIds` / `evidenceIds` are empty are drawn by the UI with
   a NO SOURCE ON RECORD marker. Do not remove that marker; fill the array.

   ID CONVENTIONS
     INC-  incident        EVT-  timeline event    PER-  person
     OFC-  office          ORD-  order             WGO-  evidence
     SRC-  source          CLM-  claim             QST-  question
     GOV-  government response                     EXT-  external investigation
   ========================================================================== */

window.WGO = window.WGO || {};

/* --- Sources -------------------------------------------------------------- *
   A Source is where a piece of evidence came from: a publication, a court
   registry, a public information officer, a named witness. Evidence cites
   sources; claims cite evidence. Nothing skips a link in that chain. */
WGO.sources = [];

/* --- People --------------------------------------------------------------- *
   DELIBERATELY EMPTY, AND THIS IS A RULE, NOT A GAP.

   A named individual is added here only when a sourced document places that
   person in the relevant office at the relevant time. Holding an office is not
   evidence of having issued an order. The chain-of-command interface is built
   to work with offices alone precisely so that the archive never has to name a
   person in order to be useful. */
WGO.persons = [];

/* --- Offices -------------------------------------------------------------- *
   Structural map of who is empowered to decide what. `statutoryBasis` entries
   carry their own sourceIds; where that array is empty the interface prints
   NO SOURCE ON RECORD, because an uncited assertion about the law is still an
   uncited assertion. */
WGO.offices = [
  {
    id: 'OFC-0001',
    title: 'Union Ministry of Home Affairs',
    shortTitle: 'Union Home Ministry',
    level: 'UNION',
    jurisdiction: 'Union of India',
    appliesTo: ['INC-0001', 'INC-0002', 'INC-0003'],
    statutoryBasis: [
      { text: 'Union ministry responsible for internal security and, for Union Territories including Delhi, for the police force itself.', sourceIds: [] }
    ],
    whatWeKnow: [],
    whatWeDontKnow: [
      'Whether any communication passed between this ministry and the forces deployed at any of the three locations.',
      'Whether any situation report was called for, or received, before or after the events.'
    ],
    evidenceIds: [],
    authorisationEvidence: []
  },
  {
    id: 'OFC-0002',
    title: 'State Home Department',
    shortTitle: 'State Home Department',
    level: 'STATE',
    jurisdiction: 'Bihar / Maharashtra',
    appliesTo: ['INC-0002', 'INC-0003'],
    statutoryBasis: [
      { text: 'Police is a State subject. The State Home Department is the administrative department for the state police force.', sourceIds: [] }
    ],
    whatWeKnow: [],
    whatWeDontKnow: [
      'Whether any advisory, circular or instruction was issued to the districts ahead of the protests.',
      'Whether any post-incident report was called for.'
    ],
    evidenceIds: [],
    authorisationEvidence: []
  },
  {
    id: 'OFC-0003',
    title: 'Director General of Police (State)',
    shortTitle: 'DGP',
    level: 'SENIOR',
    jurisdiction: 'Bihar / Maharashtra',
    appliesTo: ['INC-0002', 'INC-0003'],
    statutoryBasis: [
      { text: 'Head of the state police force; issues force-wide standing orders and directions.', sourceIds: [] }
    ],
    whatWeKnow: [],
    whatWeDontKnow: [
      'Whether any force-wide instruction on handling the protests was issued.',
      'Which officer was in overall charge of the deployment.'
    ],
    evidenceIds: [],
    authorisationEvidence: []
  },
  {
    id: 'OFC-0004',
    title: 'Commissioner of Police',
    shortTitle: 'Commissioner of Police',
    level: 'SENIOR',
    jurisdiction: 'Commissionerate cities, including Delhi',
    appliesTo: ['INC-0001', 'INC-0003'],
    statutoryBasis: [
      { text: 'Head of a city police force under the commissionerate system; in Delhi, the Commissioner of Police heads a force under the Union Home Ministry rather than a state government.', sourceIds: [] },
      { text: 'Exercises certain magisterial powers, including powers relating to public order and assemblies, that are held elsewhere by the District Magistrate.', sourceIds: [] }
    ],
    whatWeKnow: [],
    whatWeDontKnow: [
      'Whether any prohibitory order was in force at the site on the day.',
      'Who approved the deployment plan, and in what form.'
    ],
    evidenceIds: [],
    authorisationEvidence: []
  },
  {
    id: 'OFC-0005',
    title: 'District Magistrate',
    shortTitle: 'District Magistrate',
    level: 'SENIOR',
    jurisdiction: 'District (non-commissionerate)',
    appliesTo: ['INC-0002', 'INC-0003'],
    statutoryBasis: [
      { text: 'Executive magistrate with statutory powers relating to unlawful assembly and the dispersal of assemblies, and with responsibility for requisitioning and directing force in aid of civil power.', sourceIds: [] }
    ],
    whatWeKnow: [],
    whatWeDontKnow: [
      'Whether an executive magistrate was present at the site, as certain dispersal powers contemplate.',
      'Whether any written requisition or direction exists.'
    ],
    evidenceIds: [],
    authorisationEvidence: []
  },
  {
    id: 'OFC-0006',
    title: 'Superintendent of Police / Deputy Commissioner of Police (District)',
    shortTitle: 'SP / DCP',
    level: 'OPERATIONAL',
    jurisdiction: 'District or police district',
    appliesTo: ['INC-0001', 'INC-0002', 'INC-0003'],
    statutoryBasis: [
      { text: 'Officer in operational command of the district police; ordinarily approves deployment strength, the composition of the force and its equipment.', sourceIds: [] }
    ],
    whatWeKnow: [],
    whatWeDontKnow: [
      'Who signed the deployment order, if one exists in writing.',
      'What equipment the deployed units were authorised to carry.'
    ],
    evidenceIds: [],
    authorisationEvidence: []
  },
  {
    id: 'OFC-0007',
    title: 'Officer commanding the deployment on site',
    shortTitle: 'On-site commanding officer',
    level: 'OPERATIONAL',
    jurisdiction: 'The site of the incident',
    appliesTo: ['INC-0001', 'INC-0002', 'INC-0003'],
    statutoryBasis: [
      { text: 'The senior police officer present is ordinarily responsible for decisions on the escalation of force at the scene, within standing orders and any specific direction received.', sourceIds: [] }
    ],
    whatWeKnow: [],
    whatWeDontKnow: [
      'Who the senior officer present was at the time force was used.',
      'What instruction, oral or written, that officer received or gave.',
      'What was recorded in the station diary or equivalent record.'
    ],
    evidenceIds: [],
    authorisationEvidence: []
  },
  {
    id: 'OFC-0008',
    title: 'Field personnel and units deployed',
    shortTitle: 'Field personnel',
    level: 'FIELD',
    jurisdiction: 'The site of the incident',
    appliesTo: ['INC-0001', 'INC-0002', 'INC-0003'],
    statutoryBasis: [
      { text: 'Constabulary, armed reserve and any central armed police units present act under the direction of the officer commanding them.', sourceIds: [] }
    ],
    whatWeKnow: [],
    whatWeDontKnow: [
      'Which units were deployed, in what strength, and drawn from where.',
      'Whether personnel wore identifying numbers, and whether they are legible in any available footage.',
      'What crowd-control equipment was issued, and against what record.'
    ],
    evidenceIds: [],
    authorisationEvidence: []
  }
];

/* --- Orders --------------------------------------------------------------- *
   Empty until an order is located. The investigation page prints
   ORDER NOT YET LOCATED rather than speculating about what an order said. */
WGO.orders = [];

/* --- Timeline events ------------------------------------------------------ *
   Empty. A timeline is a chronology of established fact; an empty chronology is
   an honest one. Add EVT- records with `state: 'VERIFIED'` and evidenceIds only
   once a document or dated original recording fixes the time. */
WGO.events = [];

/* --- Incidents ------------------------------------------------------------ */
WGO.incidents = [
  {
    id: 'INC-0001',
    slug: 'jantar-mantar',
    title: 'Police action against students at Jantar Mantar',
    place: 'Jantar Mantar, New Delhi',
    state: 'Delhi',
    coords: [28.6270, 77.2166],           // Jantar Mantar, the protest site itself
    incidentState: 'UNDER_INVESTIGATION',
    dateState: 'UNKNOWN',
    date: null,
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: { state: 'UNKNOWN', items: [] },
    crowdControl:   { state: 'UNKNOWN', items: [] },
    injuries:       { state: 'UNKNOWN', note: null },
    detentions:     { state: 'UNKNOWN', note: null },
    firs:           { state: 'UNKNOWN', note: null },
    officeIds: ['OFC-0001', 'OFC-0004', 'OFC-0006', 'OFC-0007', 'OFC-0008'],
    openedOn: '2026-08-15'
  },
  {
    id: 'INC-0002',
    slug: 'bihar',
    title: 'Police action against students in Bihar',
    place: 'Bihar — specific location to be established',
    state: 'Bihar',
    coords: [25.5941, 85.1376],           // Patna, pending a located site
    coordsState: 'UNKNOWN',
    incidentState: 'UNDER_INVESTIGATION',
    dateState: 'UNKNOWN',
    date: null,
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: { state: 'UNKNOWN', items: [] },
    crowdControl:   { state: 'UNKNOWN', items: [] },
    injuries:       { state: 'UNKNOWN', note: null },
    detentions:     { state: 'UNKNOWN', note: null },
    firs:           { state: 'UNKNOWN', note: null },
    officeIds: ['OFC-0002', 'OFC-0003', 'OFC-0005', 'OFC-0006', 'OFC-0007', 'OFC-0008'],
    openedOn: '2026-08-15'
  },
  {
    id: 'INC-0003',
    slug: 'maharashtra',
    title: 'Police action against students in Maharashtra',
    place: 'Maharashtra — specific location to be established',
    state: 'Maharashtra',
    coords: [19.0760, 72.8777],           // Mumbai, pending a located site
    coordsState: 'UNKNOWN',
    incidentState: 'UNDER_INVESTIGATION',
    dateState: 'UNKNOWN',
    date: null,
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: { state: 'UNKNOWN', items: [] },
    crowdControl:   { state: 'UNKNOWN', items: [] },
    injuries:       { state: 'UNKNOWN', note: null },
    detentions:     { state: 'UNKNOWN', note: null },
    firs:           { state: 'UNKNOWN', note: null },
    officeIds: ['OFC-0002', 'OFC-0003', 'OFC-0004', 'OFC-0005', 'OFC-0006', 'OFC-0007', 'OFC-0008'],
    openedOn: '2026-08-15'
  }
];

/* --- Claims --------------------------------------------------------------- *
   A Claim is a single checkable proposition. It is the unit the government
   response page argues with, and the unit evidence attaches to.

   Every claim below is UNVERIFIED with no evidence attached. That is the
   correct starting state for this archive: the premise that brought the
   project into being is itself something to be established, not assumed. */
WGO.claims = [
  {
    id: 'CLM-0001',
    incidentId: 'INC-0001',
    text: 'Police used force against students at Jantar Mantar.',
    state: 'UNVERIFIED',
    evidenceIds: [],
    note: 'Recorded as the claim under investigation. It is not presented as established until primary evidence is attached.'
  },
  {
    id: 'CLM-0002',
    incidentId: 'INC-0002',
    text: 'Police used force against students in Bihar.',
    state: 'UNVERIFIED',
    evidenceIds: [],
    note: 'Recorded as the claim under investigation. It is not presented as established until primary evidence is attached.'
  },
  {
    id: 'CLM-0003',
    incidentId: 'INC-0003',
    text: 'Police used force against students in Maharashtra.',
    state: 'UNVERIFIED',
    evidenceIds: [],
    note: 'Recorded as the claim under investigation. It is not presented as established until primary evidence is attached.'
  }
];

/* --- Questions ------------------------------------------------------------ *
   Section 7 of the brief. The standard set is expanded onto every incident so
   that the same twelve questions are asked of every use of force, in the same
   order, everywhere in the archive. Incident-specific questions are added to
   `WGO.questionsExtra`. */
WGO.STANDARD_QUESTIONS = [
  { key: 'deployment',      text: 'Who authorised the deployment?',                                     level: 'SENIOR',      wants: ['Deployment order', 'Force requisition', 'Duty roster'] },
  { key: 'tear-gas',        text: 'Who authorised the use of tear gas, if its use is established?',      level: 'OPERATIONAL', wants: ['Equipment issue register', 'Wireless log', 'Station diary entry'] },
  { key: 'pellets',         text: 'Who authorised the use of pellet-firing weapons, if their use is established?', level: 'OPERATIONAL', wants: ['Armoury issue record', 'Medico-legal records', 'Original footage'] },
  { key: 'written-req',     text: 'Was written authorisation required for the force used?',              level: 'STATE',       wants: ['Standing orders', 'Police manual provisions', 'Standard operating procedure'] },
  { key: 'written-issued',  text: 'Was a written order issued?',                                         level: 'SENIOR',      wants: ['The order itself', 'RTI response confirming existence or absence'] },
  { key: 'oral-order',      text: 'If not, was an oral order given?',                                    level: 'OPERATIONAL', wants: ['Wireless log', 'Control-room recording', 'Officer statement on record'] },
  { key: 'who-issued',      text: 'Who issued it?',                                                      level: 'OPERATIONAL', wants: ['Signed order', 'Contemporaneous log naming the officer'] },
  { key: 'instructions',    text: 'What instructions were given to field personnel?',                    level: 'OPERATIONAL', wants: ['Briefing record', 'Wireless log', 'Written instructions to units'] },
  { key: 'reports',         text: 'What reports were submitted after the incident?',                     level: 'SENIOR',      wants: ['Situation report', 'Daily diary', 'Report to the home department'] },
  { key: 'who-received',    text: 'Who received those reports?',                                         level: 'STATE',       wants: ['Routing slip', 'File noting', 'RTI response'] },
  { key: 'inquiry',         text: 'Was an inquiry ordered?',                                             level: 'STATE',       wants: ['Inquiry order', 'Magisterial inquiry notification', 'Court direction'] },
  { key: 'action',          text: 'What action followed?',                                               level: 'STATE',       wants: ['Departmental proceedings record', 'FIR against personnel', 'Inquiry findings'] }
];

/* Questions specific to a single incident, added to the standard set. */
WGO.questionsExtra = [
  {
    id: 'QST-X001',
    incidentId: 'INC-0001',
    text: 'Was any prohibitory order in force at the site at the time, and when was it promulgated?',
    level: 'SENIOR',
    state: 'UNANSWERED',
    wants: ['The order and its date of promulgation', 'Proof of publication'],
    evidenceIds: []
  },
  {
    id: 'QST-X002',
    incidentId: 'INC-0001',
    text: 'Were any central armed police units deployed alongside the city police, and under whose direction?',
    level: 'UNION',
    state: 'UNANSWERED',
    wants: ['Requisition for central forces', 'Deployment order naming the units'],
    evidenceIds: []
  }
];

/* --- Government responses ------------------------------------------------- *
   Section 13. Official accounts are reproduced fairly and in full, and are
   never removed because they are inconvenient. Empty until one is recorded. */
WGO.responses = [];

/* --- External investigations (section 9) ---------------------------------- *
   An index of other people's work, always attributed to whoever made it. We do
   not reproduce it and we do not claim it. */
WGO.external = [];

/* --- Evidence ------------------------------------------------------------- *
   Empty. Layout samples live in data/samples.js behind WGO.config.demoMode and
   are never mixed into these arrays. */
WGO.evidence = [];

/* --- RTI register --------------------------------------------------------- *
   Add an RTI record on the day you file it, not on the day a reply arrives.
   The register is what turns the gap list from a wish into a clock, and an
   application that is weeks overdue is itself worth publishing.

   Shape:
     {
       id:            'RTI-0001',
       incidentId:    'INC-0001',
       questionIds:   ['QST-0001-01'],      // what this application would answer
       office:        'Public Information Officer, ...',
       subject:       'Short description of what was asked for',
       filedOn:       '2026-08-20',          // YYYY-MM-DD
       period:        'STANDARD',            // key from WGO.RTI_PERIODS
       referenceNo:   'registration number, where the portal gives one',
       status:        'FILED',               // key from WGO.RTI_STATES
       repliedOn:     null,
       exemptionCited: null,                 // where status is REFUSED
       outcome:       null,                  // one line, plain language
       evidenceIds:   []                     // the reply, once filed as evidence
     }

   The reply-due date and any overdue count are computed by the model from
   filedOn and period. Do not store them: a stored deadline goes stale, and a
   stale deadline in an accountability archive is worse than none. */
WGO.rtis = [];
