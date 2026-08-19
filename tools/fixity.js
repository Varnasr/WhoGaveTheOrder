#!/usr/bin/env node
/* =============================================================================
   Fixity: get every source into a public web archive
   -----------------------------------------------------------------------------
   A link is not a citation. News sites edit stories after publication, move
   them behind paywalls, and take them down. When that happens a record here
   still says "source: Bar & Bench" and the reader has no way to check it.

   This asks the Internet Archive whether a snapshot of each source URL exists,
   and requests one where it does not. The snapshot URL is written back into
   sourcemap/evidence-items.json as archive_url, which import.py already carries
   through to the site, where the record page prints it.

   It writes nothing else. It does not touch a claim, a state or a source's
   identity, only the archived copy of a URL that is already recorded.

       node tools/fixity.js                # up to 10 sources
       node tools/fixity.js --limit 50
       node tools/fixity.js --dry-run
   ========================================================================== */

'use strict';

const fs = require('fs');
const path = require('path');
const { ROOT } = require('./archive');

const args = process.argv.slice(2);
const LIMIT = num('--limit', 10);
const DRY = args.includes('--dry-run');
const FILE = path.join(ROOT, 'sourcemap/evidence-items.json');

/* The Internet Archive throttles hard, and a save can take a minute. Slow and
   finishing over several days beats fast and getting blocked. */
const PAUSE_MS = 5000;
const SAVE_TIMEOUT_MS = 90000;
const CHECK_TIMEOUT_MS = 30000;

function num(flag, fallback) {
  const i = args.indexOf(flag);
  const v = i === -1 ? NaN : parseInt(args[i + 1], 10);
  return isNaN(v) ? fallback : v;
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function get(url, timeout, extraHeaders) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: Object.assign(
        { 'User-Agent': 'WhoGaveTheOrder.in fixity (+https://www.whogavetheorder.in/about.html)' },
        extraHeaders || {})
    });
    const text = await res.text();
    return { status: res.status, text, url: res.url };
  } catch (err) {
    return { status: 0, error: err.message, text: '' };
  } finally {
    clearTimeout(timer);
  }
}

/* Is there already a snapshot? Cheaper than asking for one, and most news URLs
   have been captured by somebody already. */
async function existingSnapshot(target) {
  const res = await get(`https://archive.org/wayback/available?url=${encodeURIComponent(target)}`, CHECK_TIMEOUT_MS);
  if (res.status === 429) { return { throttled: true }; }
  if (res.status !== 200) { return { error: res.error || `HTTP ${res.status}` }; }
  try {
    const closest = JSON.parse(res.text).archived_snapshots?.closest;
    return closest && closest.available ? { url: closest.url, timestamp: closest.timestamp } : {};
  } catch (err) {
    return { error: 'availability response was not JSON' };
  }
}

/* Ask for a capture. The save endpoint redirects to the snapshot it made, so
   the final URL is the answer.

   Anonymous saves are often refused with 403. The Internet Archive issues free
   S3-style keys for this; set IA_ACCESS_KEY and IA_SECRET_KEY and the request
   is authenticated. Without them the tool still does the useful half of the
   job, which is finding the snapshots that already exist. */
async function requestSnapshot(target) {
  const headers = {};
  if (process.env.IA_ACCESS_KEY && process.env.IA_SECRET_KEY) {
    headers.Authorization = `LOW ${process.env.IA_ACCESS_KEY}:${process.env.IA_SECRET_KEY}`;
  }
  const res = await get(`https://web.archive.org/save/${target}`, SAVE_TIMEOUT_MS, headers);
  if (res.status === 429) { return { throttled: true }; }
  if (res.url && /web\.archive\.org\/web\/\d+/.test(res.url)) { return { url: res.url }; }
  if (res.status === 403) {
    return { refused: true, error: 'capture refused (403). Set IA_ACCESS_KEY and IA_SECRET_KEY to request captures.' };
  }
  return { error: res.error || `save returned HTTP ${res.status}` };
}

async function main() {
  const items = JSON.parse(fs.readFileSync(FILE, 'utf8'));

  /* One URL can be cited by many items. Collect the distinct ones so a URL is
     archived once and the result written everywhere it appears. */
  const pending = new Map();
  for (const item of items) {
    for (const source of item.sources || []) {
      if (source.url && !source.archive_url) {
        if (!pending.has(source.url)) { pending.set(source.url, [] ); }
        pending.get(source.url).push(source);
      }
    }
  }

  const urls = [...pending.keys()];
  console.log(`${urls.length} source URL(s) with no archived copy.`);
  if (!urls.length) { return; }

  const todo = urls.slice(0, LIMIT);
  if (todo.length < urls.length) {
    console.log(`Doing ${todo.length} this run; the rest wait for the next one.`);
  }

  let saved = 0, found = 0, failed = 0, refused = 0;
  const today = new Date().toISOString().slice(0, 10);

  for (const url of todo) {
    let result = await existingSnapshot(url);
    let how = 'existing';
    let askedForCapture = false;

    if (result.throttled) {
      console.log('\nThe Internet Archive is throttling us. Stopping here; the rest keep for tomorrow.');
      break;
    }
    if (!result.url && !result.error) {
      await sleep(PAUSE_MS);
      result = await requestSnapshot(url);
      askedForCapture = true;
      how = 'saved';
      if (result.throttled) {
        console.log('\nThrottled while requesting a capture. Stopping here.');
        break;
      }
    }

    if (result.url) {
      for (const source of pending.get(url)) {
        source.archive_url = result.url;
        source.archived_on = today;
      }
      if (how === 'saved') { saved++; } else { found++; }
      console.log(`  ${how === 'saved' ? 'captured' : 'already had'}  ${url}`);
    } else if (result.refused) {
      refused++;
    } else {
      failed++;
      console.log(`  failed     ${url}  (${result.error})`);
    }
    /* A lookup is cheap; a capture request is not. Only wait after the latter. */
    await sleep(askedForCapture ? PAUSE_MS : 500);
  }

  console.log(`\n${found} already archived, ${saved} newly captured, ${refused} capture refused, ${failed} failed.`);
  if (refused) {
    console.log('Captures were refused. The Internet Archive issues free keys: set IA_ACCESS_KEY and IA_SECRET_KEY.');
  }

  if (DRY) { console.log('Dry run: nothing written.'); return; }
  if (found + saved) {
    fs.writeFileSync(FILE, JSON.stringify(items, null, 2) + '\n');
    console.log('Wrote archive_url into sourcemap/evidence-items.json.');
    console.log('Run python3 sourcemap/import.py && node tools/build.js to carry it through.');
  }
}

main().catch(err => { console.error('fixity failed:', err.message); process.exit(1); });
