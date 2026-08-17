#!/usr/bin/env node
/* =============================================================================
   Integrity check, runnable without a browser
   -----------------------------------------------------------------------------
   The editorial console has run these checks since the archive was built, but
   only when somebody opened admin.html and looked. This runs the same checks —
   the same code, loaded out of assets/model.js — on every push.

   Errors exit non-zero. Warnings are printed and do not fail the run: a record
   that renders honestly but is not finished is a normal state for a live
   archive, and a check that cannot tell the two apart is a check that gets
   switched off.

       node tools/check.js            # errors fail, warnings listed
       node tools/check.js --strict   # warnings fail too
   ========================================================================== */

'use strict';

const { load, records } = require('./archive');

const strict = process.argv.includes('--strict');

function main() {
  const WGO = load();
  const model = WGO.model;
  const problems = model.integrity().concat(structural(WGO));

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
    console.error(`\nFAIL — ${errors.length} error${errors.length === 1 ? '' : 's'}.`);
    process.exit(1);
  }
  if (strict && warnings.length) {
    console.error(`\nFAIL (--strict) — ${warnings.length} warning${warnings.length === 1 ? '' : 's'}.`);
    process.exit(1);
  }
  console.log(`\nOK — no errors.${warnings.length ? ` ${warnings.length} warning(s) above.` : ''}`);
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
        message: `Duplicate record ID — also used by a ${seen.get(rec.id)} record`
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
        message: 'State is not defined in taxonomy.js — it will render as a raw key'
      });
    }
  }

  /* The homepage leads on "no order authorising it has been found". If an order
     is ever added, that sentence stops being true and has to be rewritten
     rather than silently contradicted by the count beside it. */
  if (model.orders.length) {
    found.push({
      severity: 'warning', record: 'index.html', field: 'copy', ref: `${model.orders.length} orders`,
      message: 'Orders exist in the archive — check the homepage copy still matches the count'
    });
  }

  return found;
}

main();
