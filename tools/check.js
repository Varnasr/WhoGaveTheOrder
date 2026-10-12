#!/usr/bin/env node
/* =============================================================================
   Integrity check, runnable without a browser
   -----------------------------------------------------------------------------
   These checks were written for an editorial console that only ran them when
   somebody opened it and looked. That console (admin.html) was removed on
   2026-09-23; the checks themselves live in assets/model.js and run here, on
   every push, which is where they were always worth having.

   Errors exit non-zero. Warnings are printed and do not fail the run: a record
   that renders honestly but is not finished is a normal state for a live
   archive, and a check that cannot tell the two apart is a check that gets
   switched off.

       node tools/check.js            # errors fail, warnings listed
       node tools/check.js --strict   # warnings fail too
   ========================================================================== */

'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { load, records } = require('./archive');

const ROOT = path.join(__dirname, '..');

const strict = process.argv.includes('--strict');

function main() {
  const WGO = load();
  const model = WGO.model;
  const problems = model.integrity().concat(structural(WGO), correctionLog(WGO), sweepRunsOnce());

  const errors = problems.filter(p => p.severity === 'error');
  const warnings = problems.filter(p => p.severity !== 'error');

  const counts = model.counts();
  console.log(
    `Archive: ${counts.incidents} incidents · ${counts.evidence} evidence · ` +
    `${counts.sources} sources · ${counts.questions} questions · ${counts.rtis} RTI applications`
  );

  report('Errors', errors);
  report('Warnings', warnings);

  if (errors.length) {
    console.error(`\nFAIL: ${errors.length} error${errors.length === 1 ? '' : 's'}.`);
    process.exit(1);
  }
  if (strict && warnings.length) {
    console.error(`\nFAIL (--strict): ${warnings.length} warning${warnings.length === 1 ? '' : 's'}.`);
    process.exit(1);
  }
  console.log(`\nOK: no errors.${warnings.length ? ` ${warnings.length} warning(s) above.` : ''}`);
}

function report(heading, list) {
  if (!list.length) { return; }
  console.log(`\n${heading} (${list.length})`);
  /* Grouped by message: 30 sources missing an archive copy is one finding about
     the archive's practice, not 30 findings about 30 sources. */
  const byMessage = new Map();
  for (const p of list) {
    if (!byMessage.has(p.message)) { byMessage.set(p.message, []); }
    byMessage.get(p.message).push(p.record);
  }
  for (const [message, ids] of byMessage) {
    console.log(`  ${message}`);
    console.log(`    ${ids.slice(0, 12).join(', ')}${ids.length > 12 ? ` … and ${ids.length - 12} more` : ''}`);
  }
}

/* Checks that belong to the repository rather than to the record model: things
   a browser cannot see because they are about the files, not the graph. */
function structural(WGO) {
  const found = [];
  const model = WGO.model;

  const seen = new Map();
  for (const rec of records(WGO)) {
    if (seen.has(rec.id)) {
      found.push({
        severity: 'error', record: rec.id, field: 'id', ref: seen.get(rec.id),
        message: `Duplicate record ID: also used by a ${seen.get(rec.id)} record`
      });
    }
    seen.set(rec.id, rec.kind);
  }

  /* Every state string the interface renders has to exist in the taxonomy. If
     it does not, ui.chip() falls back to printing the raw key, and the evidence
     grammar has quietly drifted. */
  const known = new Set([].concat(
    Object.keys(WGO.EVIDENCE_STATES || {}),
    Object.keys(WGO.QUESTION_STATES || {}),
    Object.keys(WGO.INCIDENT_STATES || {}),
    Object.keys(WGO.RTI_STATES || {})
  ));
  for (const rec of records(WGO)) {
    if (rec.state && !known.has(rec.state)) {
      found.push({
        severity: 'error', record: rec.id, field: 'state', ref: rec.state,
        message: 'State is not defined in taxonomy.js: it will render as a raw key'
      });
    }
  }

  /* The homepage leads on "no order authorising it has been found". If an order
     is ever added, that sentence stops being true and has to be rewritten
     rather than silently contradicted by the count beside it. */
  if (model.orders.length) {
    found.push({
      severity: 'warning', record: 'index.html', field: 'copy', ref: `${model.orders.length} orders`,
      message: 'Orders exist in the archive: check the homepage copy still matches the count'
    });
  }

  found.push(...pageLinks(WGO));
  found.push(...duplicateChromeLinks());
  found.push(...letterJoin(WGO));
  return found;
}

/* Every local page this site links to has to exist, or have a redirect.
   ------------------------------------------------------------------------
   Written on 2026-09-23, immediately after deleting four pages by hand and
   then finding eight references to them still in the tree: two search-result
   URL builders in model.js, a link in about.html, two in index.html, four
   deep links inside ui.js explainers, and six rows in the README. Not one of
   them would have failed anything. A dead internal link in an accountability
   archive is the same defect as a dangling record reference, and this file
   already refuses to merge one of those.

   Anything with a redirect in netlify.toml counts as resolving: that is what
   a redirect is for. So does an anchor into a page that exists. */
function pageLinks(WGO) {
  const found = [];

  const netlify = fs.readFileSync(path.join(ROOT, 'netlify.toml'), 'utf8');
  const redirected = new Set(
    [...netlify.matchAll(/^\s*from\s*=\s*"\/([^"*]+)"/gm)].map(m => m[1])
  );

  const files = fs.readdirSync(ROOT)
    .filter(f => /\.(html|js)$/.test(f))
    .concat(['assets', 'data', 'tools'].flatMap(d =>
      fs.readdirSync(path.join(ROOT, d))
        .filter(f => /\.(js|html)$/.test(f))
        .map(f => `${d}/${f}`)));

  /* Generated files are skipped. Their URLs are recomputed from
     tools/archive.js on every build, so they cannot be stale relative to the
     routes, and they store them as `"url": "..."` rather than as an href,
     which this pattern would not match in any case. */
  const skip = /\.generated\.js$/;

  for (const rel of files) {
    if (skip.test(rel)) { continue; }
    const text = fs.readFileSync(path.join(ROOT, rel), 'utf8');
    for (const m of text.matchAll(/(?:href=|withLang\()['"]([a-z0-9-]+\.html)(?:[#?][^'"]*)?['"]/g)) {
      const page = m[1];
      if (fs.existsSync(path.join(ROOT, page)) || redirected.has(page)) { continue; }
      found.push({
        severity: 'error', record: rel, field: 'link', ref: page,
        message: 'Links to a page that does not exist and has no redirect'
      });
    }
  }

  for (const item of WGO.NAV || []) {
    if (!fs.existsSync(path.join(ROOT, item.href))) {
      found.push({
        severity: 'error', record: 'data/taxonomy.js', field: 'NAV', ref: item.href,
        message: 'Primary navigation points at a page that does not exist'
      });
    }
  }

  return found;
}

/* No link appears twice in the same footer column, and no page twice in NAV.
   ------------------------------------------------------------------------
   A three-way merge on 2026-09-23 re-inserted "Send a preservation letter"
   into the Take part column alongside the copy already there. The footer
   rendered, both entries worked, and the only symptom was the same link
   listed twice four rows apart. Nothing that reads the site could have seen
   it, because both halves were individually correct. */
/* The sweep runs once, and the run that writes the log is the run that reports.
   ------------------------------------------------------------------------
   tools/sweep.js records every item it has seen, so a second run in the same
   job finds nothing new. The workflow used to take its human summary from a
   first run and its JSON from a second, and the issue is opened from the JSON,
   so every candidate was found by the run whose output went to a text file
   nobody reads.

   It reported "0 candidate(s)" on ten consecutive mornings, 13 to 22 September
   2026, while the seen-list grew by about fifteen items a day. Nothing errored,
   nothing was red, and the archive went a month out of date behind a green
   daily job. A sweep that cannot find anything and a quiet week file the same
   issue.

   Two things are pinned. That sweep.js is invoked once in the sweep step, and
   that the invocation which produces the JSON is not the one carrying
   --no-write. Either alone permits the other's version of the bug. */
function sweepRunsOnce() {
  const found = [];
  const wf = path.join(ROOT, '.github/workflows/sweep.yml');
  if (!fs.existsSync(wf)) { return found; }
  const yml = fs.readFileSync(wf, 'utf8');

  const calls = [...yml.matchAll(/node\s+tools\/sweep\.js([^\n|>]*)/g)].map(m => m[1]);
  if (calls.length > 1) {
    found.push({
      severity: 'error', record: '.github/workflows/sweep.yml', field: 'sweep', ref: `${calls.length} invocations`,
      message: 'tools/sweep.js is invoked more than once. The first run consumes the new items and the second reports none'
    });
  }
  for (const flags of calls) {
    if (/--json/.test(flags) && /--no-write/.test(flags)) {
      found.push({
        severity: 'error', record: '.github/workflows/sweep.yml', field: 'sweep', ref: flags.trim(),
        message: 'The sweep invocation that produces the JSON carries --no-write, so it reports against a log another run already wrote'
      });
    }
  }
  return found;
}

/* Corrections stay out of the Latest stream, and the log they move to exists.
   ------------------------------------------------------------------------
   An update carrying `correction: true` reports an error of this archive's.
   Those are published, and they are published in the corrections log rather
   than at the top of the homepage, where for most of September the first of
   the three Latest entries was the archive explaining a framing mistake of
   its own.

   Both halves need pinning, and the second is the one that bites. Flagging an
   entry hides it from the homepage immediately; the log that is supposed to
   carry it is a data-region on two pages and a handler in pages.js, and if any
   of those is missing the entry is not moved but deleted from the reader's
   view, with nothing to show for it. about.html had no handler in pages.js at
   all until the log was added, which is how its corrections policy came to
   promise a log for weeks with none on the site. */
function correctionLog(WGO) {
  const found = [];
  const updates = WGO.updates || [];
  const corrections = updates.filter(u => u.correction);

  const ui = fs.readFileSync(path.join(ROOT, 'assets/ui.js'), 'utf8');
  const pages = fs.readFileSync(path.join(ROOT, 'assets/pages.js'), 'utf8');

  if (!/ui\.correctionList\s*=/.test(ui)) {
    found.push({
      severity: 'error', record: 'assets/ui.js', field: 'correctionList', ref: null,
      message: 'Updates can be flagged as corrections but nothing renders them'
    });
  }

  for (const page of ['about.html', 'changes.html']) {
    const html = fs.readFileSync(path.join(ROOT, page), 'utf8');
    if (!/data-region="corrections"/.test(html)) {
      found.push({
        severity: 'error', record: page, field: 'corrections', ref: null,
        message: 'Page is meant to carry the corrections log and has no region for it'
      });
    }
    const handler = page.replace('.html', '');
    const re = new RegExp('pages\\.' + handler + '\\s*=[\\s\\S]*?data-region="corrections"');
    if (!re.test(pages)) {
      found.push({
        severity: 'error', record: 'assets/pages.js', field: 'pages.' + handler, ref: page,
        message: 'Page has a corrections region that no handler mounts anything into'
      });
    }
  }

  /* A correction with no record ID cannot be checked against the thing it
     corrected, which is the whole use of publishing it. */
  for (const u of corrections) {
    if (!u.recordId) {
      found.push({
        severity: 'error', record: 'data/records.js', field: 'updates', ref: u.title,
        message: 'Correction does not name the record it corrected'
      });
    }
  }

  if (!corrections.length && updates.length) {
    found.push({
      severity: 'warning', record: 'data/records.js', field: 'updates', ref: null,
      message: 'No update is flagged as a correction. Confirm nothing has been found wrong rather than that the flag was forgotten'
    });
  }
  return found;
}

function duplicateChromeLinks() {
  const found = [];
  const ui = fs.readFileSync(path.join(ROOT, 'assets/ui.js'), 'utf8');

  /* Each footer column is one "'<div><h4>' … '</ul></div>'" run. */
  for (const col of ui.match(/'<div><h4>'[\s\S]*?'<\/ul><\/div>'/g) || []) {
    const seen = new Set();
    for (const m of col.matchAll(/fl\('([^']+)',\s*'([^']+)'\)/g)) {
      const key = `${m[1]} | ${m[2]}`;
      if (seen.has(key)) {
        found.push({
          severity: 'error', record: 'assets/ui.js', field: 'footer', ref: key,
          message: 'The same link is listed twice in one footer column'
        });
      }
      seen.add(key);
    }
  }
  return found;
}

/* The incident-to-letter join, checked in both directions.
   ------------------------------------------------------------------------
   WGO.LETTERS_FOR_INCIDENT is the only hand-maintained edge between a record
   and an action. Broken one way, the incident page offers a letter that does
   not exist; broken the other, a drafted letter is reachable only by someone
   who already thought to open letters.html, which is the state this whole
   change exists to end. */
function letterJoin(WGO) {
  const found = [];
  const map = WGO.LETTERS_FOR_INCIDENT || {};

  const sandbox = { window: {} };
  sandbox.window.WGO = {};
  sandbox.WGO = sandbox.window.WGO;
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'data/letters.generated.js'), 'utf8'), sandbox);
  const letters = sandbox.WGO.letters || [];
  const ids = new Set(letters.map(l => l.id));

  const offered = new Set();
  for (const [incidentId, letterIds] of Object.entries(map)) {
    if (!WGO.model.incident(incidentId)) {
      found.push({
        severity: 'error', record: 'data/taxonomy.js', field: 'LETTERS_FOR_INCIDENT', ref: incidentId,
        message: 'Letters are mapped to an incident that does not exist'
      });
    }
    for (const id of letterIds) {
      offered.add(id);
      if (!ids.has(id)) {
        found.push({
          severity: 'error', record: 'data/taxonomy.js', field: 'LETTERS_FOR_INCIDENT', ref: id,
          message: 'Mapped to a letter that correspondence/ does not hold'
        });
      }
    }
  }

  for (const l of letters) {
    if (!offered.has(l.id)) {
      found.push({
        severity: 'error', record: l.id, field: 'LETTERS_FOR_INCIDENT', ref: l.district,
        message: 'A drafted letter no incident page offers: it is reachable only from letters.html'
      });
    }
  }

  return found;
}

main();
