/* =============================================================================
   WhoGaveTheOrder.in — layout samples
   -----------------------------------------------------------------------------
   These records exist so the interface can be reviewed, tested and handed to a
   designer before any real evidence has been collected. They are not evidence.

   Every record here carries `demo: true`. The model keeps them in a separate
   pool from WGO.evidence, draws each one with a SAMPLE ribbon, and excludes
   them from every published count on the site.

   They are loaded only while WGO.config.demoMode === true. Set that flag to
   false in data/taxonomy.js and this file goes dark without any other change.

   No sample below contains a quotation, a name, a date or a document that is
   claimed to exist. Where real content will sit, the sample says so in
   brackets.
   ========================================================================== */

window.WGO = window.WGO || {};

WGO.sampleSources = [
  { id: 'SRC-S001', demo: true, name: '[Sample] Public information officer, district police', kind: 'RTI', url: null },
  { id: 'SRC-S002', demo: true, name: '[Sample] Independent news publication', kind: 'PUBLICATION', url: null },
  { id: 'SRC-S003', demo: true, name: '[Sample] Original recording supplied by a witness', kind: 'WITNESS', url: null }
];

WGO.sampleEvidence = [
  {
    id: 'WGO-S001',
    demo: true,
    title: '[Sample] Deployment order for the day of the protest',
    type: 'OFFICIAL_ORDER',
    verification: 'VERIFIED',
    incidentId: 'INC-0001',
    dateOfItem: '[date on the document]',
    dateAdded: '[date the archive received it]',
    sourceIds: ['SRC-S001'],
    origin: '[Where this document came from, and how]',
    establishes: 'What a verified primary document establishes is written here in one sentence, in plain language.',
    doesNotEstablish: 'And what it does not establish is written here — the harder and more important half of the record.',
    relatedIds: ['WGO-S002'],
    accessNote: 'Original made available where it is lawful and safe to do so.'
  },
  {
    id: 'WGO-S002',
    demo: true,
    title: '[Sample] RTI response on whether a written order exists',
    type: 'RTI_RESPONSE',
    verification: 'VERIFIED',
    incidentId: 'INC-0001',
    dateOfItem: '[date on the reply]',
    dateAdded: '[date the archive received it]',
    sourceIds: ['SRC-S001'],
    origin: '[The application, the office it went to, and the reply received]',
    establishes: 'A reply confirming that a record does or does not exist is itself primary evidence, and is filed as such.',
    doesNotEstablish: 'A department stating that no record exists does not establish that no order was given.',
    relatedIds: ['WGO-S001'],
    accessNote: 'Application and reply published together.'
  },
  {
    id: 'WGO-S003',
    demo: true,
    title: '[Sample] Photograph of the site during the deployment',
    type: 'PHOTOGRAPH',
    verification: 'CORROBORATED',
    incidentId: 'INC-0001',
    dateOfItem: '[capture time from the file]',
    dateAdded: '[date the archive received it]',
    sourceIds: ['SRC-S003'],
    origin: '[Who took it, on what device, and how it reached us]',
    establishes: 'Corroborated means several independent sources agree on what a photograph shows, without a single document settling it.',
    doesNotEstablish: 'A photograph fixes a scene. It does not identify who ordered what is in it.',
    relatedIds: [],
    accessNote: 'Published at the contributor’s stated permission level. Faces may be blurred on request.'
  },
  {
    id: 'WGO-S004',
    demo: true,
    title: '[Sample] News report describing the police account',
    type: 'NEWS_REPORT',
    verification: 'REPORTED',
    incidentId: 'INC-0002',
    dateOfItem: '[date of publication]',
    dateAdded: '[date indexed]',
    sourceIds: ['SRC-S002'],
    origin: '[Publication, headline and byline, linked to the original]',
    establishes: 'That a credible outlet reported this, on this date. That is all REPORTED ever means here.',
    doesNotEstablish: 'That the reported facts are correct. We index the report; we do not adopt it.',
    relatedIds: [],
    accessNote: 'Linked to the publisher. We do not mirror other people’s journalism.'
  },
  {
    id: 'WGO-S005',
    demo: true,
    title: '[Sample] Two accounts of the same twenty minutes that do not agree',
    type: 'EYEWITNESS',
    verification: 'DISPUTED',
    incidentId: 'INC-0003',
    dateOfItem: '[dates of the accounts]',
    dateAdded: '[date recorded]',
    sourceIds: ['SRC-S003'],
    origin: '[Two accounts, separately obtained]',
    establishes: 'Only that the accounts conflict. Both are shown in full; neither is resolved by us.',
    doesNotEstablish: 'Which account is correct. DISPUTED is a state we are willing to leave a record in.',
    relatedIds: [],
    accessNote: 'Identifying detail withheld where a contributor asked for it.'
  },
  {
    id: 'WGO-S006',
    demo: true,
    title: '[Sample] Submitted footage whose provenance is not yet established',
    type: 'VIDEO',
    verification: 'UNVERIFIED',
    incidentId: 'INC-0002',
    dateOfItem: '[claimed capture date]',
    dateAdded: '[date submitted]',
    sourceIds: [],
    origin: '[Submitted through the public form; provenance under check]',
    establishes: 'Nothing yet. It is logged so that the record of what we hold is complete.',
    doesNotEstablish: 'Anything at all. Unverified material is never cited in support of a claim.',
    relatedIds: [],
    accessNote: 'Not published until provenance is established.'
  }
];

WGO.sampleResponses = [
  {
    id: 'GOV-S001',
    demo: true,
    incidentId: 'INC-0001',
    claimId: 'CLM-0001',
    respondingOffice: '[Office that issued the statement]',
    date: '[date of the statement]',
    channel: '[Press conference, press note, court affidavit, reply in the legislature]',
    quote: '[The official statement is reproduced here in full and without editing. Where it is long, the full text is linked and the operative passage is quoted.]',
    sourceIds: [],
    ourEvidence: 'What the archive holds on this claim is summarised here, with evidence IDs.',
    stillUnanswered: 'What neither our evidence nor the official response answers is listed here as open questions.'
  }
];

WGO.sampleExternal = [
  {
    id: 'EXT-S001',
    demo: true,
    title: '[Sample] Independent investigation by a news organisation',
    creator: '[Publication and reporter, always named]',
    kind: 'Investigation',
    date: '[date]',
    url: null,
    incidentIds: ['INC-0001'],
    note: 'Indexed, not reproduced. The work belongs to whoever did it and the link goes to them.'
  },
  {
    id: 'EXT-S002',
    demo: true,
    title: '[Sample] Legal analysis of the applicable dispersal powers',
    creator: '[Author and where it was published]',
    kind: 'Analysis',
    date: '[date]',
    url: null,
    incidentIds: ['INC-0001', 'INC-0002', 'INC-0003'],
    note: 'Indexed because it helps a reader understand the statutory questions, not because we endorse its conclusions.'
  }
];
