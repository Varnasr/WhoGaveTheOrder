/* =============================================================================
   Loading the archive outside a browser
   -----------------------------------------------------------------------------
   The data files and the model are plain scripts that assign onto `window`.
   That is deliberate: the site has no build step and opening index.html off the
   filesystem has to work. It also means the model cannot be `require`d.

   Rather than duplicate the model in Node: which would give the tooling its
   own idea of what the archive says, and eventually a different one: this
   evaluates the same files the browser loads, in a sandbox with a `window`, and
   hands back the built model. Every tool in this directory reads the archive
   through here, so a rule enforced in assets/model.js is enforced in CI too.
   ========================================================================== */

'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');

/* The order the pages load them in. records.generated.js is written by
   sourcemap/import.py and must come after the hand-entered records, because it
   appends to the same pools. samples.js is loaded but only enters the display
   pools while demoMode is on. */
const SCRIPTS = [
  'data/taxonomy.js',
  'data/records.js',
  'data/records.generated.js',
  'data/samples.js',
  'assets/model.js'
];

/* Load the archive as of a given git revision, or from the working tree.
   `rev` is any commit-ish; null means the files on disk. */
function load(rev) {
  /* The sandbox's global object *is* `window`, exactly as in a browser. The
     data files open with `window.WGO = window.WGO || {}` and then refer to a
     bare `WGO`, which only resolves if the two are the same object. */
  const sandbox = { console };
  sandbox.window = sandbox;
  sandbox.self = sandbox;
  vm.createContext(sandbox);

  for (const rel of SCRIPTS) {
    const code = rev === undefined || rev === null
      ? fs.readFileSync(path.join(ROOT, rel), 'utf8')
      : readAt(rev, rel);
    /* A file absent at an older revision is not an error: the archive grew.
       records.generated.js did not exist before the source map was imported. */
    if (code === null) { continue; }
    try {
      vm.runInContext(code, sandbox, { filename: rel });
    } catch (err) {
      throw new Error(`${rel} failed to evaluate` + (rev ? ` at ${rev}` : '') + `: ${err.message}`);
    }
  }

  const WGO = sandbox.window.WGO;
  if (!WGO || !WGO.model) {
    throw new Error('archive loaded but WGO.model is missing' + (rev ? ` at ${rev}` : ''));
  }
  WGO.model.build();
  return WGO;
}

/* File contents at a revision, or null if the file did not exist there. */
function readAt(rev, rel) {
  const { spawnSync } = require('child_process');
  const out = spawnSync('git', ['show', `${rev}:${rel}`], { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  if (out.status !== 0) { return null; }
  return out.stdout;
}

/* Every published record, flattened to one comparable shape. The change feed
   and the export both need "the archive as a list of records"; keeping one
   definition of that means the feed can never describe a record the export
   does not contain. */
function records(WGO) {
  const m = WGO.model;
  const out = [];

  const add = (kind, list, map) => (list || []).forEach(rec => out.push(
    Object.assign({ kind, id: rec.id }, map(rec))
  ));

  add('Incident', m.incidents, i => ({
    title: i.title,
    state: i.incidentState,
    url: `investigation.html?id=${i.slug}`,
    fields: { place: i.place, date: i.date || null, dateState: i.dateState || null, summary: i.summary || null }
  }));

  add('Evidence', m.publishedEvidence, e => ({
    title: e.title,
    state: e.verification,
    url: `evidence.html?id=${e.id}`,
    fields: {
      type: e.type,
      incidentId: e.incidentId || null,
      dateOfItem: e.dateOfItem || null,
      establishes: e.establishes || null,
      doesNotEstablish: e.doesNotEstablish || null,
      sourceIds: e.sourceIds || []
    }
  }));

  add('Source', m.publishedSources, s => ({
    title: s.name,
    state: null,
    url: s.url || null,
    fields: {
      url: s.url || null,
      publisher: s.publisher || null,
      retrievedOn: s.retrievedOn || null,
      sha256: s.sha256 || null,
      archiveUrl: s.archiveUrl || null
    }
  }));

  add('Question', m.questions, q => ({
    title: q.text,
    state: q.state,
    url: `investigation.html?id=${incidentSlug(m, q.incidentId)}#${q.id}`,
    fields: { incidentId: q.incidentId || null, level: q.level || null, evidenceIds: q.evidenceIds || [] }
  }));

  /* Offices have no page of their own since chain.html was removed. `url:
     null` is handled: the change log renders the title as plain text rather
     than as a link to nowhere. */
  add('Office', m.offices, o => ({
    title: o.title,
    state: null,
    url: null,
    fields: { level: o.level, jurisdiction: o.jurisdiction || null, appliesTo: o.appliesTo || [] }
  }));

  add('Claim', m.claims, c => ({
    title: c.text,
    state: c.state,
    url: `investigation.html?id=${incidentSlug(m, c.incidentId)}#what-happened`,
    fields: { incidentId: c.incidentId || null, evidenceIds: c.evidenceIds || [] }
  }));

  add('RTI application', m.publishedRtis, r => ({
    title: r.subject,
    state: r.status,
    url: `rti.html#${r.id}`,
    fields: {
      office: r.office || null,
      filedOn: r.filedOn || null,
      period: r.period || 'STANDARD',
      referenceNo: r.referenceNo || null,
      outcome: r.outcome || null
    }
  }));

  add('Government response', m.publishedResponses, r => ({
    title: r.respondingOffice,
    state: null,
    url: `investigation.html?id=${incidentSlug(m, r.incidentId)}#evidence`,
    fields: { channel: r.channel || null, quote: r.quote || null }
  }));

  add('External work', m.publishedExternal, x => ({
    title: x.title,
    state: null,
    url: `others.html#${x.id}`,
    fields: { creator: x.creator || null, kind: x.kind || null }
  }));

  add('Order', m.orders, o => ({
    title: o.title,
    state: o.state,
    url: `investigation.html?id=${incidentSlug(m, o.incidentId)}#orders`,
    fields: { issuedBy: o.issuedBy || null, incidentId: o.incidentId || null }
  }));

  return out;
}

function incidentSlug(model, incidentId) {
  const inc = model.incident(incidentId);
  return inc ? inc.slug : '';
}

module.exports = { ROOT, load, records };
