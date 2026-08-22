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
/* --- Updates: what the people running this archive have done ------------- *
   A dated notice board, and it has one rule that keeps it inside the site's
   grammar: AN UPDATE MAY ONLY REPORT WHAT THIS ARCHIVE DID, OR WHAT A CLOCK
   DID. It may not say what happened at an incident.

   "We filed an application on this date" is a fact about us. "The reply fell
   due and nothing came" is a fact about a deadline. Both are ours to state.
   "Police used tear gas" is a claim about an incident, and it belongs in an
   evidence record with a source behind it, never here. Without that line an
   updates feed becomes the running commentary this archive exists not to
   write — and the fastest way to launder an unsourced claim into a fact is to
   put it in a news item nobody thinks to check.

   Fields: date (ISO), title, body, and optionally recordId — the record the
   update concerns, which is rendered as a link so a reader can go and check
   the thing itself rather than take the note's word for it. */
WGO.updates = [
  {
    date: '2026-08-21',
    title: 'Hospital records obtained under RTI put at least ten people in hospital with pellet injuries',
    body: 'Saket Gokhale asked four Delhi hospitals how many people they treated for pellet, shot or projectile injuries on 20 July. Lady Hardinge Medical College answered nine, recorded as pellet or projectile injuries. Safdarjung answered one. AIIMS refused under section 8(1)(j), saying a number could identify a patient. Ram Manohar Lohia had not answered. This is the best-sourced thing on the pellet question and it is not our work, so it is credited to him. Hospital records are independent of both the police and the petitioners \u2014 but a clinical category is not a finding about a weapon, and what was fired is still recorded as disputed.',
    recordId: 'INC-DEL-006'
  },
  {
    date: '2026-08-21',
    title: 'An FIR has been registered about the police action itself',
    body: 'A student who says he was hit by pellets at Jantar Mantar on 20 July complained in writing on 14 August. An FIR was registered at Parliament Street police station on 21 August, against unidentified persons. Everything else in this archive is a writ petition, a commission proceeding or an affidavit; this is the first criminal case about what the police did. It comes with a file, a case diary and either a chargesheet or a closure report at the end, and those are documents that can be asked for. We are not naming the complainant, and the record says why.',
    recordId: 'PROC-DEL-003'
  },
  {
    date: '2026-08-21',
    title: 'The committee exists now, and our earlier record was overtaken',
    body: 'This archive recorded on 19 August that a high-powered committee had been decided on but was not shown to have been constituted. It has been, by an order reported dated 18 August: five members, chaired by a former Supreme Court judge, with the deployment of pellet guns inside its mandate by name and a first interim report due at the earliest. The record has been corrected and says what it used to say. We hold reporting of the order, not the order.',
    recordId: 'PROC-SC-006'
  },
  {
    date: '2026-08-21',
    title: 'A police diary entry is reported to record whose orders the munitions were used under',
    body: 'Two outlets say they have read a Delhi Police General Diary entry of 22 July which records what was used at Jantar Mantar on 20 July — tear smoke, shells, an anti-riot gun and two rounds of plastic pellets — and records that it was used under the orders of a Deputy Commissioner of Police. That is the first time anything on this record connects the force used to an officer who ordered it. It is still not an order, and this archive does not hold the entry: it holds two reports of it. The count of orders found stays at zero, because that number counts orders we hold.',
    recordId: 'INC-DEL-004'
  },
  {
    date: '2026-08-21',
    title: 'The Supreme Court has asked for the pellet gun procedure, and for a log to be kept',
    body: 'In a petition brought by a former IPS officer and two injured protesters, the Court is reported to have directed Delhi Police to place its standard operating procedure on pellet-firing weapons on record, to have ordered the Rapid Action Force ammunition log for 20 July preserved, and to have said it will lay down a protocol. Counsel told the Court that from 1967 to now there is not a single standing order or regulation mentioning pellet guns. That is a submission, not a finding, and the archive records it as one. Both documents the Court asked for are now open questions here.',
    recordId: 'PROC-SC-008'
  },
  {
    date: '2026-08-21',
    title: 'A petition on the facial recognition is before the Supreme Court',
    body: 'A public interest petition asks the Court to hold the deployment of facial recognition against a peaceful assembly unconstitutional, and to order disclosure of the systems, procedures and vendor agreements used at Jantar Mantar. That disclosure is the same document this archive has been unable to obtain by any other route. The Court is reported to have agreed on 13 August to hear it. What the petition alleges was deployed is a party\'s case, not a finding, and the record says so.',
    recordId: 'PROC-SC-007'
  },
  {
    date: '2026-08-21',
    title: 'Two officers who policed Jantar Mantar have been moved',
    body: 'A Delhi Government order of 18 August transferred 43 officers, two of them holding posts that covered the policing of the protest. Reporting says the order does not call either move disciplinary or mention the protest. The useful part for this archive is the smaller one: it names two officers and the posts they held on 20 July, which nothing else on the record did. Neither has been added to the chain of command, and no finding against either is recorded, because none exists.',
    recordId: 'OVR-DEL-001'
  },
  {
    date: '2026-08-19',
    title: 'A fourth incident is open: Siwan',
    body: 'The daily sweep found the State of Bihar telling the Supreme Court that police discharged firearms at a student protest at Siwan on 25 July — four rounds from an AK-47 and two from a pistol, with three protesters injured. Siwan was not on this archive before today and has been opened as its own record rather than added to the Bihar one: a different town, a different date and a different weapon is a different incident. These are the first firearms in the archive.',
    recordId: 'INC-SIW-001'
  },
  {
    date: '2026-08-19',
    title: 'An earlier finding of ours has been overtaken',
    body: 'This archive recorded on 16 August that no court proceeding concerning the Bihar incidents could be found. That was true when written and is now wrong: Bihar is a respondent before the Supreme Court and has filed there. The record has been corrected and says what it used to say. Whether any court is seized of Patna, Katihar or Munger specifically is still not established.',
    recordId: 'PROC-BIH-001'
  },
  {
    date: '2026-08-19',
    title: 'Delhi Police has admitted using facial recognition at Jantar Mantar',
    body: 'On affidavit before the Supreme Court, the force said facial recognition technology was deployed at the protest. That it was used is now the police\'s own statement and is recorded as corroborated. Whether it was confined to people with criminal records, as the police say, or ran on the crowd, as the petitioners say, is recorded as disputed — the court has not decided it and neither has this archive.',
    recordId: 'PROC-SC-002'
  },
  {
    date: '2026-08-18',
    title: 'The court\'s own record of the Delhi hearing is now held',
    body: 'The Delhi High Court cause list for 22 July 2026 has been retrieved and filed. It establishes the cause title, the case number and the bench, and it corrects a date two news reports had disagreed about. It does not establish what was ordered: that still rests on reporting until the order itself is obtained.',
    recordId: 'PROC-DEL-002'
  },
  {
    date: '2026-08-18',
    title: 'Nothing on these incidents has been answered in Parliament yet',
    body: 'The parliamentary record was searched for a question on the police action. Nothing on any of these incidents is indexed as answered. The search is dated and recorded rather than repeated silently, and it will be run again when the next session opens.'
  },
  {
    date: '2026-08-18',
    title: 'The NHRC\'s two-week deadline has passed',
    body: 'The Commission is reported to have sought a report from the Commissioner of Police, Delhi, within two weeks of 25 July. That period expired on or about 8 August. Whether anything was filed is not established, and the Commission has not announced the proceeding on its own press-release page.',
    recordId: 'OVR-NHRC-001'
  }
];

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
    /* Dates and place established by the round-1 source map. Everything below
       them remains UNKNOWN: that an incident occurred is corroborated, and
       nothing about conduct, cause or proportionality follows from that. */
    dateState: 'CORROBORATED',
    date: '20 and 22 July 2026',
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
    place: 'JP Golambar and Dakbungalow Square, Patna; Katihar; Munger',
    state: 'Bihar',
    coords: [25.5941, 85.1376],           // Patna; Katihar and Munger not yet plotted
    coordsState: 'REPORTED',
    incidentState: 'UNDER_INVESTIGATION',
    dateState: 'REPORTED',
    date: '22, 23 and 25 July 2026',
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
    place: 'Maharashtra — held open, no incident located',
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
  },
  /* Opened 19 August 2026, on the strength of the State of Bihar's own affidavit
     to the Supreme Court. Siwan is a separate shell rather than another line in
     the Bihar record because 25 July at Siwan is a different event from 22 July
     at Patna, with different personnel, a different weapon and a different
     district administration. Folding it into INC-0002 would produce a record
     that reads as one incident across four towns, which is the collapsing this
     archive refuses between states and has no better reason to do within one.

     It is also the first incident here that did not come from the round-1
     research: the daily sweep found it. */
  {
    id: 'INC-0004',
    slug: 'siwan',
    title: 'Police firing during the student protest at Siwan',
    place: 'JP Chowk, Siwan',   // the sources say 'near JP Chowk'; the qualifier belongs in the record, not in the place name
    state: 'Bihar',
    coords: [26.2196, 84.3597],           // Siwan town
    coordsState: 'UNKNOWN',
    incidentState: 'REPORTED',
    dateState: 'CORROBORATED',
    date: '25 July 2026',
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: { state: 'UNKNOWN', items: [] },
    crowdControl:   { state: 'UNKNOWN', items: [] },
    injuries:       { state: 'UNKNOWN', note: null },
    detentions:     { state: 'UNKNOWN', note: null },
    firs:           { state: 'UNKNOWN', note: null },
    officeIds: ['OFC-0002', 'OFC-0003', 'OFC-0004', 'OFC-0005', 'OFC-0006', 'OFC-0007', 'OFC-0008'],
    openedOn: '2026-08-19'
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
