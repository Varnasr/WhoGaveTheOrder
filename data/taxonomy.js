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

  /* Editorial state of the archive itself. Shown in the masthead notice bar so
     no visitor mistakes an empty record for a finished one. */
  archiveStage: 'PRE-LAUNCH',

  /* demoMode renders the layout-sample records so the interface can be reviewed
     before real evidence exists. Every sample is drawn with a SAMPLE ribbon and
     is excluded from all published counts. SET THIS TO false BEFORE LAUNCH. */
  demoMode: true,

  contact: {
    evidence: 'evidence@whogavetheorder.in',
    corrections: 'corrections@whogavetheorder.in',
    legal: 'legal@whogavetheorder.in'
  },

  lastReviewed: '2026-08-15'
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

/* --- Primary navigation (section 18) — deliberately short ----------------- */
WGO.NAV = [
  { href: 'investigations.html', label: 'Investigations' },
  { href: 'evidence.html',       label: 'Evidence' },
  { href: 'chain.html',          label: 'Chain of Command' },
  { href: 'response.html',       label: 'Government Response' },
  { href: 'submit.html',         label: 'Submit Evidence' },
  { href: 'about.html',          label: 'About' }
];
