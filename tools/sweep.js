#!/usr/bin/env node
/* =============================================================================
   The daily sweep
   -----------------------------------------------------------------------------
   Goes to the places a document about these incidents could appear — court
   listings, the Commission's press page, the parliamentary library, legal
   reporting, news — and reports what is new since yesterday.

   THE SWEEP NEVER WRITES A RECORD. It writes candidates and a dated log, and a
   person decides what becomes evidence and at what confidence. That is not
   caution for its own sake. Assigning a state means judging whether two sources
   are actually independent, and what a document does and does not establish;
   a feed that could set a state would be a route for laundering an unsourced
   claim into a fact, which is the one thing this archive exists to prevent.

   What it does record, every run, is that it looked. A search that finds
   nothing is a dated negative, and this archive treats those as findings —
   PROC-BIH-001 and LEG-010 are both absences with a date on them.

       node tools/sweep.js                 # human summary
       node tools/sweep.js --json          # machine-readable, to stdout
       node tools/sweep.js --json-file F   # machine-readable to F, summary to stdout
       node tools/sweep.js --date 2026-09-11
       node tools/sweep.js --no-write      # do not touch the log

   --json-file exists so the workflow can take both outputs from ONE run. It
   used to take them from two:

       node tools/sweep.js | tee sweep.txt
       node tools/sweep.js --no-write --json > sweep.json

   The first run records every item it saw in the log. The second run therefore
   sees no new item, and sweep.json, the file the workflow opens its issue
   from, is empty by construction. Every candidate was found by the run whose
   output went to a text file nobody reads, and the issue was opened from the
   run that could not find anything.

   It ran that way for ten days, 13 to 22 September 2026, reporting
   "0 candidate(s)" every morning while the seen-list grew by about fifteen
   items a day and the Supreme Court quashed every protest FIR in the country.
   Nothing errored. A job that cannot find anything and a quiet week look
   identical in the issue it files.
   ========================================================================== */

'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { ROOT, load } = require('./archive');

const args = process.argv.slice(2);
const asJson = args.includes('--json');
const noWrite = args.includes('--no-write');
const jsonFile = flag('--json-file');
const DATE = flag('--date') || new Date().toISOString().slice(0, 10);

const WATCHLIST = path.join(ROOT, 'tools/watchlist.json');
const LOG = path.join(ROOT, 'sourcemap/watch-log.json');
const KEEP_DAYS = 90;
const TIMEOUT_MS = 30000;

function flag(name) {
  const i = args.indexOf(name);
  return i === -1 ? null : args[i + 1];
}

/* --- fetching ------------------------------------------------------------- *
   A polite identified agent, one retry, and a timeout. Everything here is a
   public page; nothing is fetched that a person could not open. */

async function fetchTarget(url) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
      const res = await fetch(url, {
        signal: controller.signal,
        redirect: 'follow',
        headers: {
          'User-Agent': 'WhoGaveTheOrder.in daily sweep (+https://www.whogavetheorder.in/about.html)',
          'Accept': '*/*'
        }
      });
      clearTimeout(timer);
      const buffer = Buffer.from(await res.arrayBuffer());
      return { ok: res.ok, status: res.status, buffer };
    } catch (err) {
      if (attempt) { return { ok: false, status: 0, error: err.message, buffer: Buffer.alloc(0) }; }
      await new Promise(r => setTimeout(r, 2000));
    }
  }
}

/* --- extraction ----------------------------------------------------------- */

function textFromHtml(buffer) {
  return buffer.toString('utf8')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/* Feeds are handled as items rather than as a blob, so a new article is
   reported once and never again. */
function itemsFromRss(buffer) {
  const xml = buffer.toString('utf8');
  const items = [];
  const blocks = xml.split(/<item[\s>]/i).slice(1);
  for (const block of blocks) {
    const title = tag(block, 'title');
    const link = tag(block, 'link') || tag(block, 'guid');
    const date = tag(block, 'pubDate');
    if (title || link) { items.push({ title: clean(title), link: clean(link), date: clean(date) }); }
  }
  return items;
}

function tag(block, name) {
  const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`, 'i'));
  return m ? m[1] : '';
}

function clean(value) {
  return String(value || '')
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'").replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

/* PDF text needs a reader. If one is not installed the sweep still works: it
   falls back to the checksum, which detects that the file changed without
   being able to say what matched. Saying which is which matters, so the
   finding records the method. */
function textFromPdf(buffer) {
  const tmp = path.join(require('os').tmpdir(), `sweep-${Date.now()}.pdf`);
  fs.writeFileSync(tmp, buffer);
  try {
    const out = execFileSync('python3', ['-c', `
import sys
sys.modules['cryptography'] = None
from pypdf import PdfReader
r = PdfReader(sys.argv[1])
print('\\n'.join((p.extract_text() or '') for p in r.pages))
`, tmp], { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] });
    return { text: out.replace(/\s+/g, ' ').trim(), extracted: true };
  } catch (err) {
    return { text: '', extracted: false };
  } finally {
    try { fs.unlinkSync(tmp); } catch (e) { /* nothing to clean up */ }
  }
}

function sha(value) {
  return require('crypto').createHash('sha256').update(value).digest('hex').slice(0, 16);
}

/* --- matching ------------------------------------------------------------- */

function matches(text, terms) {
  const hay = text.toLowerCase();
  const found = [];
  for (const term of terms) {
    const needle = term.toLowerCase();
    let at = hay.indexOf(needle);
    if (at === -1) { continue; }
    /* One snippet per term. The finding is a pointer to go and look, not a
       substitute for reading the document. */
    const from = Math.max(0, at - 100);
    found.push({ term, snippet: text.slice(from, at + needle.length + 160).trim() });
  }
  return found;
}

function expand(url, date) {
  const [Y, M, D] = date.split('-');
  return url
    .replace(/\{YYYY\}/g, Y).replace(/\{MM\}/g, M).replace(/\{DD\}/g, D)
    .replace(/\{DD\.MM\.YYYY\}/g, `${D}.${M}.${Y}`)
    .replace(/\{DDMMYYYY\}/g, `${D}${M}${Y}`);
}

/* --- the archive's own watch dates ---------------------------------------- *
   Terms come from the watchlist and from the records themselves, so a new
   incident or case number starts being watched without anyone remembering to
   update a list. */
/* A city or a state is not a search term. "New Delhi" matches every article
   filed from New Delhi and "Patna" matched a story about a job quota in the
   Patna High Court on the first run — a sweep that reports everything reports
   nothing. Only the specific sites are watched; the jurisdictions are already
   covered by the news queries in the watchlist, which pair them with a verb. */
const TOO_GENERIC = new Set([
  'delhi', 'new delhi', 'bihar', 'maharashtra', 'patna', 'india', 'union of india',
  'supreme court', 'high court', 'police'
]);

function termsFromArchive(WGO) {
  const terms = new Set();
  for (const inc of WGO.model.incidents) {
    if (inc.place && !/to be established/i.test(inc.place)) {
      inc.place.split(/[;,]/).forEach(p => {
        const place = p.trim();
        if (place.length > 4 && !TOO_GENERIC.has(place.toLowerCase())) { terms.add(place); }
      });
    }
  }
  /* Case numbers as they are written in the records. */
  for (const e of WGO.model.publishedEvidence) {
    const text = `${e.title || ''} ${e.establishes || ''}`;
    for (const m of text.matchAll(/\bW\.P\.\s*\(?(?:CRL|C)\)?\.?\s*-?\s*\d{1,5}\/\d{4}/gi)) {
      terms.add(m[0].replace(/\s+/g, ' ').trim());
    }
  }
  return [...terms];
}

/* --- main ----------------------------------------------------------------- */

async function main() {
  const config = JSON.parse(fs.readFileSync(WATCHLIST, 'utf8'));
  const WGO = load();
  const terms = [...new Set([...(config.terms || []), ...termsFromArchive(WGO)])];
  const log = fs.existsSync(LOG) ? JSON.parse(fs.readFileSync(LOG, 'utf8')) : { runs: [], seen: {} };
  log.seen = log.seen || {};

  const findings = [];
  const checked = [];

  for (const target of config.targets) {
    const url = expand(target.url, DATE);
    const res = await fetchTarget(url);
    const state = log.seen[target.id] || {};

    if (!res.ok) {
      /* A dated 404 on a cause list means nothing was listed that day, which is
         not a failure. Anything else is recorded as unreachable, with the date,
         because "we could not look" is different from "we looked and it was
         empty" and the archive should not blur them. */
      const expected404 = res.status === 404 && /\{/.test(target.url);
      checked.push({ id: target.id, url, status: res.status, outcome: expected404 ? 'nothing-published' : 'unreachable' });
      if (!expected404) {
        findings.push({
          kind: 'UNREACHABLE', target: target.id, label: target.label, url,
          detail: res.error || `HTTP ${res.status}`,
          note: 'Recorded rather than retried silently. If this persists the route needs replacing.'
        });
      }
      continue;
    }

    if (target.kind === 'rss') {
      const items = itemsFromRss(res.buffer);
      const seenLinks = new Set(state.items || []);
      /* First sight of a feed has no yesterday to compare with, so everything in
         it is "new" and the report would be a wall. The baseline run is capped
         and labelled; from the second run on, a finding is genuinely new. */
      const baseline = !state.items;
      const fresh = items.filter(i => i.link && !seenLinks.has(sha(i.link)));
      const allHits = fresh
        .map(i => ({ item: i, hits: matches(`${i.title} ${i.link}`, terms) }))
        .filter(x => x.hits.length);
      const hits = baseline ? allHits.slice(0, 8) : allHits;

      for (const { item, hits: h } of hits) {
        findings.push({
          kind: baseline ? 'BASELINE_ITEM' : 'NEW_ITEM', target: target.id, label: target.label,
          title: item.title, url: item.link, date: item.date,
          terms: h.map(x => x.term),
          note: target.why
        });
      }
      if (baseline && allHits.length > hits.length) {
        findings.push({
          kind: 'BASELINE_TRIMMED', target: target.id, label: target.label,
          detail: `${allHits.length - hits.length} further matching item(s) in the first run were not listed. From tomorrow only genuinely new items are reported.`
        });
      }
      if (!noWrite) {
        log.seen[target.id] = {
          items: [...new Set([...(state.items || []), ...items.map(i => sha(i.link || i.title))])].slice(-800),
          lastChecked: DATE
        };
      }
      checked.push({ id: target.id, url, status: res.status, outcome: 'ok', items: items.length, matched: hits.length });
      continue;
    }

    /* html and pdf: report when the matched text changes. */
    let outcome = null;
    let text = '';
    let method = target.kind;
    if (target.kind === 'pdf') {
      const out = textFromPdf(res.buffer);
      text = out.text;
      method = out.extracted ? 'pdf-text' : 'pdf-checksum';
      if (!out.extracted) { text = sha(res.buffer); }
    } else {
      text = textFromHtml(res.buffer);
    }

    const hits = matches(text, terms);
    const fingerprint = sha(hits.length ? hits.map(h => h.snippet).join('|') : text.slice(0, 20000));

    const firstSight = !state.fingerprint;
    if (hits.length && firstSight) {
      /* Nothing to compare against yet. The baseline is taken silently and
         reported as such in the outcome line, not as a finding. */
      outcome = 'baseline-taken';
    } else if (hits.length && fingerprint !== state.fingerprint) {
      findings.push({
        kind: 'CHANGED_MATCH', target: target.id, label: target.label, url,
        terms: hits.map(h => h.term),
        snippets: hits.slice(0, 4).map(h => h.snippet.slice(0, 300)),
        method,
        note: target.why
      });
    } else if (!hits.length && state.fingerprint && fingerprint !== state.fingerprint) {
      outcome = 'changed-no-match';
    }

    if (!noWrite) { log.seen[target.id] = { fingerprint, lastChecked: DATE, method }; }
    checked.push({
      id: target.id, url, status: res.status, method,
      outcome: outcome || (hits.length ? 'matched' : 'no-match')
    });
  }

  const run = {
    date: DATE,
    targets: config.targets.length,
    findings: findings.length,
    outcomes: checked.reduce((acc, c) => { acc[c.outcome] = (acc[c.outcome] || 0) + 1; return acc; }, {})
  };

  if (!noWrite) {
    log.runs = [...(log.runs || []).filter(r => r.date !== DATE), run].slice(-KEEP_DAYS);
    fs.writeFileSync(LOG, JSON.stringify(log, null, 2) + '\n');
  }

  const payload = JSON.stringify({ run, findings, checked }, null, 2) + '\n';

  if (jsonFile) { fs.writeFileSync(jsonFile, payload); }

  if (asJson) {
    process.stdout.write(payload);
    return;
  }

  console.log(`Sweep ${DATE} — ${config.targets.length} targets, ${terms.length} watch terms.`);
  /* The item counts are printed because "the feed was empty" and "the feed was
     full and nothing matched" are the same line without them, and one of those
     is a broken route. */
  for (const c of checked) {
    const seen = c.items === undefined ? '' : `  ${c.items} item(s), ${c.matched} matched`;
    console.log(`  ${c.outcome.padEnd(18)} ${c.id}${seen}`);
  }
  if (!findings.length) {
    console.log('\nNothing new. The date is logged: a search that found nothing is a finding.');
    return;
  }
  console.log(`\n${findings.length} thing(s) to look at:\n`);
  for (const f of findings) {
    console.log(`· [${f.kind}] ${f.label}`);
    if (f.title) { console.log(`  ${f.title}`); }
    if (f.url) { console.log(`  ${f.url}`); }
    if (f.terms) { console.log(`  matched: ${f.terms.join(', ')}`); }
    if (f.detail) { console.log(`  ${f.detail}`); }
    console.log('');
  }
}

main().catch(err => { console.error('sweep failed:', err.message); process.exit(1); });
