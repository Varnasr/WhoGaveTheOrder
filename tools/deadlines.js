#!/usr/bin/env node
/* =============================================================================
   The deadline robot
   -----------------------------------------------------------------------------
   The register computes its clocks in the browser, which means they are only
   true for whoever happens to be looking. This runs the same clocks on a
   schedule and reports what has changed state overnight:

     · applications whose statutory period has expired while the record still
       says FILED — under section 7(2) that silence is a refusal, and the
       register should say so
     · appeal windows about to close
     · appeal windows that have closed unnoticed

   Prints a human-readable summary, and with --json emits the same findings for
   a workflow to turn into an issue. Exit code is 0 either way: a missed
   deadline is news, not a broken build.

       node tools/deadlines.js
       node tools/deadlines.js --json
       node tools/deadlines.js --within 7      # appeal windows closing in a week
   ========================================================================== */

'use strict';

const { load } = require('./archive');

const args = process.argv.slice(2);
const asJson = args.includes('--json');
const within = num('--within', 14);

function num(flag, fallback) {
  const i = args.indexOf(flag);
  if (i === -1 || !args[i + 1]) { return fallback; }
  const n = parseInt(args[i + 1], 10);
  return isNaN(n) ? fallback : n;
}

function main() {
  const WGO = load();
  const model = WGO.model;
  const findings = [];

  for (const rti of model.publishedRtis) {
    const clock = model.rtiClock(rti);
    if (!clock.known) {
      findings.push({
        kind: 'NO_FILING_DATE', id: rti.id, office: rti.office || null, subject: rti.subject || null,
        headline: `${rti.id} has no filing date — its clock cannot be computed`
      });
      continue;
    }

    /* The one that matters. An office that has said nothing has, in law, said
       no; a register that still reads "awaiting reply" is being more polite
       about it than the Act is. */
    if (rti.status === 'FILED' && clock.overdue) {
      findings.push({
        kind: 'DEEMED_REFUSAL', id: rti.id, office: rti.office || null, subject: rti.subject || null,
        filedOn: rti.filedOn, dueOn: clock.dueOn, overdueDays: clock.overdueDays,
        headline: `${rti.id} is ${clock.overdueDays} day${clock.overdueDays === 1 ? '' : 's'} past its statutory period — deemed refusal`,
        action: `Set status to LAPSED in data/records.js, and file the first appeal (draft on rti.html#${rti.id}).`
      });
    }

    const appeal = model.rtiAppeal(rti);
    if (!appeal.available || !appeal.deadlineOn) { continue; }

    if (appeal.expired && ['FIRST_APPEAL', 'SECOND_APPEAL', 'WITHDRAWN'].indexOf(rti.status) === -1) {
      findings.push({
        kind: 'APPEAL_WINDOW_CLOSED', id: rti.id, office: rti.office || null, subject: rti.subject || null,
        stage: appeal.stage, deadlineOn: appeal.deadlineOn, daysExpired: appeal.daysExpired,
        headline: `${rti.id}: the ${stageWords(appeal.stage)} window closed ${appeal.daysExpired} day${appeal.daysExpired === 1 ? '' : 's'} ago`,
        action: 'A late appeal may still be admitted for sufficient cause. Decide whether to file, and record the decision either way.'
      });
    } else if (!appeal.expired && appeal.daysLeft <= within) {
      findings.push({
        kind: 'APPEAL_WINDOW_CLOSING', id: rti.id, office: rti.office || null, subject: rti.subject || null,
        stage: appeal.stage, deadlineOn: appeal.deadlineOn, daysLeft: appeal.daysLeft,
        headline: `${rti.id}: ${appeal.daysLeft} day${appeal.daysLeft === 1 ? '' : 's'} left to file the ${stageWords(appeal.stage)}`,
        action: `Draft on rti.html#${rti.id}. Due by ${appeal.deadlineOn}.`
      });
    }
  }

  if (asJson) {
    process.stdout.write(JSON.stringify({
      checkedApplications: model.publishedRtis.length,
      findings
    }, null, 2) + '\n');
    return;
  }

  console.log(`Checked ${model.publishedRtis.length} published application(s).`);
  if (!findings.length) {
    console.log('Nothing has tipped over a deadline.');
    return;
  }
  for (const f of findings) {
    console.log(`\n· ${f.headline}`);
    if (f.office) { console.log(`  ${f.office}`); }
    if (f.action) { console.log(`  → ${f.action}`); }
  }
}

function stageWords(stage) {
  return stage === 'SECOND' ? 'second appeal' : 'first appeal';
}

main();
