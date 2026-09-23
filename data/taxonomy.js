/* =============================================================================
   WhoGaveTheOrder.in — taxonomy and site configuration
   -----------------------------------------------------------------------------
   Every controlled vocabulary the platform uses lives here. Nothing in the UI
   invents a status string: if a label is not defined in this file, it does not
   render. This is what keeps the evidence grammar disciplined as the archive
   grows beyond one investigation.
   ========================================================================== */

window.WGO = window.WGO || {};

WGO.config = {
  siteName: 'WhoGaveTheOrder.in',
  question: 'When state power is used against citizens, who authorised it?',

  /* Optional stage label for the masthead notice bar. Set to a string such as
     'PRE-LAUNCH' to flag the archive's own state; null shows a plain status line
     with the live counts instead. */
  archiveStage: null,

  /* demoMode renders the layout-sample records so the interface can be reviewed
     before real evidence exists. Every sample is drawn with a SAMPLE ribbon and
     is excluded from all published counts.
     Switched off on 17 August 2026: with real records in the archive, samples
     sitting beside them were more confusing than helpful. */
  demoMode: false,

  contact: {
    evidence: 'evidence@whogavetheorder.in',
    corrections: 'corrections@whogavetheorder.in',
    legal: 'legal@whogavetheorder.in'
  },

  lastReviewed: '2026-08-15',

  /* Where the archive actually answers from today. The feed and the citation
     blocks build absolute URLs out of this, and a feed full of URLs that do not
     resolve is worse than no feed, so this tracks reality rather than intent.
     Pointed at the custom domain on 17 August 2026, the day it began serving:
     the apex redirects to www and the certificate is live. */
  siteUrl: 'https://www.whogavetheorder.in',

  /* Terms for reuse, in one place because the export manifest and the citation
     block both have to state them and must not state them differently. This
     restates about.html#licence — it does not add a licence the project has not
     granted, and naming a formal one here would do exactly that. */
  licence: {
    name: 'Reuse with attribution',
    url: 'about.html#licence',
    note: 'Records written by this project may be reused with attribution to the archive and a link back. Documents obtained from public offices are public records and this project claims no rights over them. Work by other people indexed here belongs to whoever made it.'
  }
};

/* --- Evidence / claim states ---------------------------------------------- *
   Section 15 of the brief. These six words carry the site's credibility, so
   each one ships with the definition the public sees. */
WGO.EVIDENCE_STATES = {
  VERIFIED: {
    label: 'Verified',
    definition: 'Primary evidence in our possession supports the claim, and we have checked it against its original source.'
  },
  CORROBORATED: {
    label: 'Corroborated',
    definition: 'Multiple credible, independent sources support the claim, though we hold no single primary document establishing it.'
  },
  REPORTED: {
    label: 'Reported',
    definition: 'Reported by a credible external source. We have not independently verified it.'
  },
  DISPUTED: {
    label: 'Disputed',
    definition: 'Credible accounts conflict. Both are shown and neither is presented as settled.'
  },
  UNVERIFIED: {
    label: 'Unverified',
    definition: 'Material has been submitted to us but not established. We record it and do not rely on it.'
  },
  UNKNOWN: {
    label: 'Unknown',
    definition: 'The available evidence does not answer the question.'
  }
};

/* --- Distance to the order ------------------------------------------------ *
   How far the archive has got towards holding the document that would answer
   the question the site is named after, for one incident.

   THIS IS A LADDER AND NOT A PERCENTAGE, AND THE DIFFERENCE IS THE POINT.
   A percentage needs a denominator: eighty per cent of the way to what, out of
   how much work nobody has scoped? Nobody knows, so the number would be
   invented, and an invented number on this site is the one thing that would
   discredit every sourced one next to it. It would also be the sentence that
   gets quoted — "archive says it is 80% of the way to proving who ordered it" —
   and no document would exist behind it.

   Each rung is instead a fact with a record behind it. A rung is reached only
   when a published evidence record establishes it, and the record id is stored
   beside the rung so the claim of progress is sourced exactly like every other
   claim here. Rungs cannot be claimed on a feeling that things are going well.

   The rungs are cumulative: reaching rung 3 means rungs 1 and 2 were reached. */
WGO.ORDER_LADDER = [
  {
    key: 'ALLEGED',
    label: 'An order is said to have been given',
    definition: 'Somebody asserts that the force used was ordered by someone. An assertion, from any source, that an authorisation existed.'
  },
  {
    key: 'REFERRED',
    label: 'A document refers to the order',
    definition: 'A record made by somebody other than us refers to the order having been given — a diary entry, a log, an affidavit. The reference is reported to us; we have not read the record ourselves.'
  },
  {
    key: 'REFERRING_DOC_HELD',
    label: 'We hold the document that refers to it',
    definition: 'The referring record is in our possession and we have read it against its source, rather than reading a report of it.'
  },
  {
    key: 'IDENTIFIED',
    label: 'The order is identified',
    definition: 'The office that gave it, and its date, number or form, are established. Enough to ask for it by name.'
  },
  {
    key: 'PRODUCED',
    label: 'The order itself is in our hands',
    definition: 'The document is held, checked against its source, and published. This is the only rung that answers the question on the front of this site.'
  }
];

/* --- Question states ------------------------------------------------------ *
   Section 7. A question is a first-class record, not a rhetorical flourish. */
WGO.QUESTION_STATES = {
  ANSWERED: {
    label: 'Answered',
    definition: 'A sourced document or on-record statement answers the question.'
  },
  PARTIALLY_ANSWERED: {
    label: 'Partially answered',
    definition: 'Part of the question is answered on the record; a material part is not.'
  },
  UNANSWERED: {
    label: 'Unanswered',
    definition: 'Nothing on the public record answers this question.'
  },
  DISPUTED: {
    label: 'Disputed',
    definition: 'Answers exist and they contradict each other.'
  }
};

/* --- Authority levels — the chain of command rungs (section 6) ------------- */
WGO.AUTHORITY_LEVELS = [
  { key: 'UNION',       label: 'Union level',                             note: 'Ministries and Union authorities' },
  { key: 'STATE',       label: 'State level',                             note: 'State government and its home department' },
  { key: 'SENIOR',      label: 'Senior administrative / police authority', note: 'District and city-level command' },
  { key: 'OPERATIONAL', label: 'Operational command',                     note: 'Officers commanding the deployment' },
  { key: 'FIELD',       label: 'Field personnel',                         note: 'Units and personnel present at the site' }
];

/* --- The distinction the interface must never blur (section 6) ------------- */
WGO.AUTHORITY_CLAIMS = {
  HAS_AUTHORITY: {
    label: 'Has authority',
    definition: 'This office is empowered, on the face of the law or the administrative structure, to take or approve decisions of this kind. It says nothing about what it did.'
  },
  EVIDENCED_TO_HAVE_AUTHORISED: {
    label: 'Evidenced to have authorised',
    definition: 'A document or on-record statement in the archive places this office or person behind this specific action. Absent such a document, this reads NOT ESTABLISHED.'
  }
};

/* --- Evidence types (section 8) ------------------------------------------- */
WGO.EVIDENCE_TYPES = [
  { key: 'OFFICIAL_ORDER',      label: 'Official Orders' },
  { key: 'GOVT_STATEMENT',      label: 'Government Statements' },
  { key: 'POLICE_STATEMENT',    label: 'Police Statements' },
  { key: 'COURT_DOCUMENT',      label: 'Court Documents' },
  { key: 'RTI_RESPONSE',        label: 'RTI Responses' },
  { key: 'PARLIAMENTARY',       label: 'Parliamentary Questions' },
  { key: 'PHOTOGRAPH',          label: 'Photographs' },
  { key: 'VIDEO',               label: 'Videos' },
  { key: 'NEWS_REPORT',         label: 'News Reports' },
  { key: 'EYEWITNESS',          label: 'Eyewitness Accounts' },
  { key: 'EXPERT_ANALYSIS',     label: 'Expert Analysis' },
  { key: 'OTHER_DOCUMENT',      label: 'Other Documents' }
];

/* --- Citizen submission workflow (section 11) ----------------------------- *
   Nothing the public sends us goes live automatically. */
WGO.SUBMISSION_WORKFLOW = [
  { key: 'RECEIVED',     label: 'Received',     note: 'Logged, not public. Contact details are never published.' },
  { key: 'UNDER_REVIEW', label: 'Under review', note: 'Checked against its original source; privacy and legal risk assessed.' },
  { key: 'VERIFIED',     label: 'Verified',     note: 'Provenance established, or downgraded to a lesser state with reasons.' },
  { key: 'PUBLISHED',    label: 'Published',    note: 'Given an evidence ID and entered into the public archive.' }
];

WGO.REVIEWER_ACTIONS = [
  'Verify', 'Reject', 'Request clarification', 'Redact',
  'Flag privacy concern', 'Mark disputed', 'Link to existing evidence item'
];

/* --- RTI register --------------------------------------------------------- *
   An RTI application is a record from the day it is filed, not from the day a
   reply arrives. Filing it puts a clock on a public office, and the clock is
   the point: an unanswered application that is 40 days overdue says something
   the archive should show.

   Every state below is an outcome we can publish. A refusal is an outcome. A
   transfer is an outcome. Silence past the statutory deadline is an outcome,
   and it has a name in the Act. */
WGO.RTI_STATES = {
  FILED: {
    label: 'Filed — awaiting reply',
    definition: 'Application filed and within the statutory period for a reply.'
  },
  REPLY_RECEIVED: {
    label: 'Reply received',
    definition: 'The office replied on the merits. The reply is filed as evidence.'
  },
  NO_RECORD_HELD: {
    label: 'No record held',
    definition: 'The office states it holds no such record. Filed as primary evidence of what the office has said about its own files. It does not establish that no order was given.'
  },
  REFUSED: {
    label: 'Refused',
    definition: 'Disclosure refused under a claimed exemption. The exemption cited is recorded alongside.'
  },
  TRANSFERRED: {
    label: 'Transferred',
    definition: 'Application transferred to another public authority as holding the record. The transfer itself narrows where the record sits.'
  },
  LAPSED: {
    label: 'No reply — deemed refusal',
    definition: 'The statutory period passed with no reply. Under the Act this is treated as a refusal, and it opens the appeal.'
  },
  FIRST_APPEAL: {
    label: 'First appeal filed',
    definition: 'Appealed to the First Appellate Authority within the public office.'
  },
  SECOND_APPEAL: {
    label: 'Second appeal filed',
    definition: 'Appealed to the Information Commission.'
  },
  WITHDRAWN: {
    label: 'Withdrawn',
    definition: 'Application withdrawn or abandoned. Recorded so the register stays complete.'
  }
};

/* Statutory reply periods, in days. The shorter period applies where the
   information sought concerns the life or liberty of a person — which is
   arguable for several questions in this archive, and worth claiming
   explicitly when it applies. Verify the current provision before relying on
   it in an application. */
WGO.RTI_PERIODS = [
  { key: 'STANDARD',      days: 30, label: '30 days — standard' },
  { key: 'LIFE_LIBERTY',  days: 2,  label: '48 hours — life or liberty' },
  { key: 'THIRD_PARTY',   days: 40, label: '40 days — third-party information involved' }
];

/* --- The appeal windows --------------------------------------------------- *
   Silence is not the end of an application, it is the start of an appeal, and
   an appeal has its own clock. The register computes these dates so that an
   unanswered application carries the date by which somebody has to act on it
   rather than sitting there as a complaint.

   Provisions are named so a reader can check them rather than take the number
   on trust. Verify the current text before relying on any of this: these are
   the periods as the archive understands them, not legal advice, and a
   Commission's own practice on limitation varies. */
WGO.RTI_APPEALS = {
  FIRST: {
    days: 30,
    provision: 'section 19(1)',
    note: 'First appeal to the First Appellate Authority within the public office, counted from the day the reply fell due or the day a decision was received. A later appeal may still be admitted where the appellate authority is satisfied there was sufficient cause for the delay.'
  },
  FAA_DECISION: {
    days: 30,
    extendedDays: 45,
    provision: 'section 19(6)',
    note: 'The First Appellate Authority is to dispose of the appeal within 30 days, extendable to 45 for reasons recorded in writing.'
  },
  SECOND: {
    days: 90,
    provision: 'section 19(3)',
    note: 'Second appeal to the Information Commission, counted from the date the first appeal should have been decided or was in fact decided.'
  }
};

/* Who is filing. The register is used both by this archive and by readers
   filing their own applications, so anything not set here renders as a
   bracketed placeholder in the draft rather than as a wrong name. */
WGO.config.applicant = {
  name: null,
  address: null,
  email: 'evidence@whogavetheorder.in'
};

/* --- Incident states (used by the map — section 12) ----------------------- */
WGO.INCIDENT_STATES = {
  VERIFIED:            { label: 'Verified' },
  REPORTED:            { label: 'Reported' },
  DISPUTED:            { label: 'Disputed' },
  UNDER_INVESTIGATION: { label: 'Under investigation' }
};

/* --- What we are asking the public for (section 10) ----------------------- */
WGO.WANTED = [
  'Government orders',
  'Police orders',
  'Internal circulars',
  'Deployment orders',
  'RTI responses',
  'Court filings',
  'Parliamentary answers',
  'Original photographs',
  'Original videos',
  'Eyewitness evidence',
  'Official correspondence'
];

/* Which preservation letters belong to which incident.
   letters.html composes four Bihar representations out of correspondence/*.md.
   Until now they were reachable only from that page, so a reader who had just
   read what happened at Siwan had no way to act on it from where they stood.
   This is the one hand-maintained join between an incident and an action, so
   tools/check.js asserts both directions: every id here exists in
   WGO.letters, and every letter is reachable from at least one incident. */
WGO.LETTERS_FOR_INCIDENT = {
  'INC-0002': ['bihar-preservation-patna', 'bihar-preservation-katihar', 'bihar-preservation-munger'],
  'INC-0004': ['bihar-preservation-siwan']
};

/* --- Primary navigation (section 18) — deliberately short ----------------- */
/* Five items, and the third is the only one a reader can act on.
   It used to be seven, three of which pointed at pages holding nothing:
   chain.html (0 orders, 0 persons), rti.html (0 applications) and
   response.html (0 official replies). Meanwhile letters.html, which opens a
   preservation request to a district police office addressed and ready to
   send, was not in the navigation at all — it sat in the fourth column of the
   footer. A site that asks people to do something has to put the doing in
   reach of the reading. */
WGO.NAV = [
  { href: 'investigations.html', label: 'Incidents' },
  { href: 'evidence.html',       label: 'Documents' },
  { href: 'letters.html',        label: 'Ask for the records' },
  { href: 'submit.html',         label: 'Add a document' },
  { href: 'about.html',          label: 'About' }
];
