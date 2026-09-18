#!/usr/bin/env node
/* =============================================================================
   Generated artefacts: the change log, the feed, and the export
   -----------------------------------------------------------------------------
   Three things a live record owes its readers and cannot produce from the
   browser alone:

     data/changes.generated.js  what changed, when, and in which commit
     feed.xml                   the same, as Atom, for people who follow rather
                                than revisit
     data/export/*              the archive as JSON and CSV, so somebody else
                                can build on it

   The change log is derived from git history rather than from a stored
   snapshot. The repository is already the audit trail — every record arrives
   through a reviewed commit — so a second copy of "what the archive used to
   say" would be a second thing to keep honest.

       node tools/build.js
       node tools/build.js --limit 50    # how far back to walk
   ========================================================================== */

'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { ROOT, load, records } = require('./archive');

const args = process.argv.slice(2);
const LIMIT = num('--limit', 200);

function num(flag, fallback) {
  const i = args.indexOf(flag);
  if (i === -1 || !args[i + 1]) { return fallback; }
  const n = parseInt(args[i + 1], 10);
  return isNaN(n) ? fallback : n;
}

function git(...argv) {
  return execFileSync('git', argv, { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
}

function main() {
  assertFullHistory();

  const WGO = load();
  const config = WGO.config || {};
  const siteUrl = String(config.siteUrl || '').replace(/\/$/, '');

  const history = buildHistory();
  writeChanges(history);
  writeFeed(history, siteUrl, config);
  writeExport(WGO, config);

  console.log(`Change log: ${history.length} entr${history.length === 1 ? 'y' : 'ies'}.`);
}

/* --- the change log ------------------------------------------------------- *
   Walk the commits that touched the record store, load the archive on either
   side of each one, and diff the record sets. Slow in principle, unnoticeable
   in practice at this size — and exact, because it compares what the site
   would actually have rendered rather than what a diff of the file looks like.
   ========================================================================== */

/* A shallow clone is the one input that makes this function lie rather than
   fail. Git reports no parents for the commit at a shallow boundary, so the
   loop below treats it as a root commit and every record in the archive reads
   as added by it. That is not hypothetical: `actions/checkout` defaults to
   fetch-depth 1, and the daily sweep ran `node tools/build.js` on that depth
   and committed the result with [skip ci]. The published change log was a
   single entry claiming a sweep-log commit had created all 201 records, and
   the Atom feed said the same to anyone subscribed. Nothing errored.

   An accountability archive whose change log is wrong is worse than one with
   no change log, so this refuses to write rather than writing a false history.
   Whoever hits this wants `fetch-depth: 0` on the checkout step. */
function assertFullHistory() {
  const shallow = git('rev-parse', '--is-shallow-repository').trim();
  if (shallow === 'true') {
    console.error(
      'tools/build.js: refusing to run in a shallow clone.\n' +
      '  The change log is derived by diffing each commit against its parent. In a\n' +
      '  shallow clone the boundary commit has no parent, so every record would be\n' +
      '  recorded as added by it and the published history would be false.\n' +
      '  Fix: set `fetch-depth: 0` on the actions/checkout step, or run\n' +
      '  `git fetch --unshallow` locally.');
    process.exit(1);
  }
}

/* Git's %cI carries the commit's own UTC offset, so the same commit can
   serialise as +00:00 or Z depending on how it was made. That is a spurious
   diff in a committed, CI-compared file. Normalise to one canonical form. */
function isoUtc(value) {
  const d = new Date(value);
  return isNaN(d.getTime()) ? value : d.toISOString().replace(/\.\d{3}Z$/, 'Z');
}

function buildHistory() {
  const log = git('log', `--max-count=${LIMIT}`, '--format=%H\t%cI\t%P\t%s', '--', 'data/')
    .trim().split('\n').filter(Boolean);

  const entries = [];
  const cache = new Map();

  const at = rev => {
    if (!cache.has(rev)) {
      try { cache.set(rev, index(records(load(rev)))); }
      catch (err) { cache.set(rev, null); }
    }
    return cache.get(rev);
  };

  for (const line of log) {
    const [commit, date, parents, ...rest] = line.split('\t');
    const subject = rest.join('\t');

    const after = at(commit);
    if (!after) { continue; }
    /* The root commit has no parent to compare against. Everything in it is an
       addition, which is what a root commit is. On a merge, compare against the
       first parent — the branch the work landed on. */
    const parent = (parents || '').trim().split(/\s+/).filter(Boolean)[0] || null;
    const before = parent ? at(parent) : new Map();
    if (!before) { continue; }

    const diff = compare(before, after);
    if (!diff.added.length && !diff.removed.length && !diff.changed.length) { continue; }

    entries.push({
      commit: commit.slice(0, 10),
      date: isoUtc(date),
      subject,
      added: diff.added,
      removed: diff.removed,
      changed: diff.changed,
      summary: summarise(diff)
    });
  }

  return entries;
}

function index(list) {
  const map = new Map();
  for (const rec of list) { map.set(rec.id, rec); }
  return map;
}

function compare(before, after) {
  const added = [];
  const removed = [];
  const changed = [];

  for (const [id, rec] of after) {
    const was = before.get(id);
    if (!was) {
      added.push(brief(rec));
      continue;
    }
    const fields = changedFields(was, rec);
    if (fields.length) { changed.push(Object.assign(brief(rec), { fields })); }
  }

  for (const [id, rec] of before) {
    if (!after.has(id)) { removed.push(brief(rec)); }
  }

  return { added, removed, changed };
}

function brief(rec) {
  return { id: rec.id, kind: rec.kind, title: rec.title || null, state: rec.state || null, url: rec.url || null };
}

/* A state moving is the change that matters most on this site — it is the only
   thing that turns a question into an answer — so it is reported first and
   separately from an edit to a description. */
function changedFields(was, now) {
  const out = [];
  if ((was.state || null) !== (now.state || null)) {
    out.push({ field: 'state', from: was.state || null, to: now.state || null });
  }
  if ((was.title || null) !== (now.title || null)) {
    out.push({ field: 'title', from: was.title || null, to: now.title || null });
  }
  const fieldsA = was.fields || {};
  const fieldsB = now.fields || {};
  for (const key of new Set([...Object.keys(fieldsA), ...Object.keys(fieldsB)])) {
    const a = JSON.stringify(fieldsA[key] === undefined ? null : fieldsA[key]);
    const b = JSON.stringify(fieldsB[key] === undefined ? null : fieldsB[key]);
    if (a !== b) { out.push({ field: key, from: trim(fieldsA[key]), to: trim(fieldsB[key]) }); }
  }
  return out;
}

/* Field values go into a page and a feed, so a 2,000-character summary is
   trimmed here rather than in three places downstream. */
function trim(value) {
  if (value === null || value === undefined) { return null; }
  if (Array.isArray(value)) { return value.join(', ') || null; }
  const s = String(value);
  return s.length > 240 ? s.slice(0, 237) + '…' : s;
}

/* `state`, but also `dateState`: where the model stores a state does not change
   the fact that one has moved, and the summary should not call it an edit. */
function isStateField(name) {
  return /(^|[a-z])state$/i.test(String(name));
}

function summarise(diff) {
  const bits = [];
  const states = diff.changed.filter(c => c.fields.some(f => isStateField(f.field))).length;
  if (diff.added.length) { bits.push(`${diff.added.length} record${diff.added.length === 1 ? '' : 's'} added`); }
  if (states) { bits.push(`${states} state${states === 1 ? '' : 's'} changed`); }
  const edits = diff.changed.length - states;
  if (edits > 0) { bits.push(`${edits} record${edits === 1 ? '' : 's'} edited`); }
  if (diff.removed.length) { bits.push(`${diff.removed.length} record${diff.removed.length === 1 ? '' : 's'} removed`); }
  return bits.join(' · ');
}

function writeChanges(history) {
  const out = [
    '/* GENERATED by tools/build.js — do not edit by hand.',
    '   Derived from the git history of data/. Regenerate with `node tools/build.js`. */',
    '',
    'window.WGO = window.WGO || {};',
    '',
    'WGO.changes = ' + JSON.stringify(history, null, 2) + ';',
    ''
  ].join('\n');
  fs.writeFileSync(path.join(ROOT, 'data/changes.generated.js'), out);
}

/* --- the feed ------------------------------------------------------------- */

function writeFeed(history, siteUrl, config) {
  const entries = history.slice(0, 50).map(entry => {
    const lines = []
      .concat(entry.added.map(r => `Added ${r.kind} ${r.id}: ${r.title || ''}`))
      .concat(entry.changed.map(r => {
        const state = r.fields.find(f => isStateField(f.field));
        return state
          ? `${r.kind} ${r.id} moved from ${state.from || 'nothing'} to ${state.to || 'nothing'}: ${r.title || ''}`
          : `Edited ${r.kind} ${r.id}: ${r.title || ''}`;
      }))
      .concat(entry.removed.map(r => `Removed ${r.kind} ${r.id}: ${r.title || ''}`));

    return [
      '  <entry>',
      `    <title>${xml(entry.summary)}</title>`,
      `    <id>tag:whogavetheorder.in,2026:change/${xml(entry.commit)}</id>`,
      `    <updated>${xml(entry.date)}</updated>`,
      `    <link href="${xml(siteUrl)}/changes.html#${xml(entry.commit)}"/>`,
      '    <content type="html">',
      `      ${xml('<p>' + escapeHtml(entry.subject) + '</p><ul>' +
        lines.map(l => '<li>' + escapeHtml(l) + '</li>').join('') + '</ul>')}`,
      '    </content>',
      '  </entry>'
    ].join('\n');
  });

  const updated = history.length ? history[0].date : isoUtc(new Date());
  const feed = [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<feed xmlns="http://www.w3.org/2005/Atom">',
    `  <title>${xml(config.siteName || 'WhoGaveTheOrder.in')} — changes to the record</title>`,
    '  <subtitle>Every record that has been added, moved between states, or edited.</subtitle>',
    `  <id>tag:whogavetheorder.in,2026:feed</id>`,
    `  <updated>${xml(updated)}</updated>`,
    `  <link href="${xml(siteUrl)}/"/>`,
    `  <link rel="self" href="${xml(siteUrl)}/feed.xml"/>`,
    `  <rights>${xml((config.licence || {}).name || 'Reuse with attribution')}</rights>`,
    entries.join('\n'),
    '</feed>',
    ''
  ].join('\n');

  fs.writeFileSync(path.join(ROOT, 'feed.xml'), feed);
}

function xml(value) {
  return String(value === null || value === undefined ? '' : value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function escapeHtml(value) {
  return String(value === null || value === undefined ? '' : value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* --- the export ----------------------------------------------------------- *
   Every record has a permanent ID and the site is built on the idea that other
   people should be able to check it. That is not really true until the archive
   can be taken away and read without this website in the loop.
   ========================================================================== */

function writeExport(WGO, config) {
  const dir = path.join(ROOT, 'data/export');
  fs.mkdirSync(dir, { recursive: true });

  const all = records(WGO);
  const kinds = new Map();
  for (const rec of all) {
    const slug = rec.kind.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (!kinds.has(slug)) { kinds.set(slug, []); }
    kinds.get(slug).push(rec);
  }

  const siteUrl = String(config.siteUrl || '').replace(/\/$/, '');
  const files = [];

  for (const [slug, list] of kinds) {
    const flat = list.map(rec => Object.assign(
      { id: rec.id, kind: rec.kind, title: rec.title, state: rec.state, url: rec.url ? absolute(rec.url, siteUrl) : null },
      rec.fields
    ));
    write(path.join(dir, `${slug}.json`), JSON.stringify(flat, null, 2) + '\n');
    write(path.join(dir, `${slug}.csv`), csv(flat));
    files.push({ kind: list[0].kind, records: flat.length, json: `data/export/${slug}.json`, csv: `data/export/${slug}.csv` });
  }

  write(path.join(dir, 'archive.json'), JSON.stringify({
    archive: config.siteName || 'WhoGaveTheOrder.in',
    question: config.question || null,
    url: siteUrl,
    /* No generation timestamp. It would change on every run, so the freshness
       check in CI would fail on a rebuild that changed nothing, and the commit
       date already records when this was produced. */
    licence: config.licence || null,
    note: 'A record is only as good as its source. Evidence records carry sourceIds; resolve them against sources.json before relying on anything here.',
    records: all.length,
    files
  }, null, 2) + '\n');

  const listed = files.map(f => `  ${f.kind}: ${f.records}`).join('\n');
  console.log(`Export: ${all.length} records\n${listed}`);
}

function absolute(url, siteUrl) {
  return /^https?:/.test(url) ? url : `${siteUrl}/${url}`;
}

function write(file, contents) {
  fs.writeFileSync(file, contents);
}

function csv(rows) {
  if (!rows.length) { return ''; }
  const columns = [];
  for (const row of rows) {
    for (const key of Object.keys(row)) {
      if (columns.indexOf(key) === -1) { columns.push(key); }
    }
  }
  const cell = value => {
    if (value === null || value === undefined) { return ''; }
    const s = Array.isArray(value) ? value.join(' ') : String(value);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  };
  return [columns.join(',')]
    .concat(rows.map(row => columns.map(c => cell(row[c])).join(',')))
    .join('\n') + '\n';
}

main();
