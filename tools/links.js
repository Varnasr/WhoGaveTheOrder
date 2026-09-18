#!/usr/bin/env node
/* Are the sources still there?
   ==========================================================================

   Nothing in this repository asked that question until now. tools/fixity.js
   gets a source into the Internet Archive, but it only looks at sources with
   no archive_url yet: once a snapshot exists the URL is never revisited. So a
   source could rot indefinitely and the archive would keep citing it.

   It did. On 18 September 2026 the India Code URLs for the Delhi Police Act
   and the Bihar Police Act — the statutory basis of two of the three
   jurisdictions in the chain of command — had been returning 404 for an
   unknown length of time. India Code had migrated to indiacode.gov.in.

   WHY A STATUS CODE IS NOT ENOUGH

   The obvious implementation is to GET each URL and complain about anything
   that is not 200. That would have missed half of this and invented the other
   half, because the new host is a single-page application: indiacode.gov.in
   answers 200 with an identical 2,338-byte shell for every path, including
   paths that do not exist. A status check reports the whole host as healthy.

   So this probes a control URL — a path on the same origin that cannot exist —
   and compares it against the real response. If a host answers the nonsense
   path with the same body it gives the real one, its status codes carry no
   information and the source is reported as UNCHECKABLE rather than as either
   alive or dead. That is the honest answer, and it is the discipline this
   archive already applies to its records: "we could not look" is not the same
   as "we looked and it was empty".

   It also compares the content type against what the URL claims to be. A
   source recorded as a .pdf that comes back as text/html is the Maharashtra
   Police Act case: HTTP 302 to something that renders, carrying none of the
   document.

   This never edits a record. It reports, and a person decides. Assigning or
   removing a state is a judgement about what a document establishes, and a
   feed that could act on its own would be a route for laundering a change
   into the archive without anyone reading it.

   Usage:
     node tools/links.js                 human summary, exit 1 if anything is dead
     node tools/links.js --json          machine-readable
     node tools/links.js --limit 20      check the first N distinct URLs
     node tools/links.js --no-fail       report only, always exit 0
   ========================================================================== */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const FILE = path.join(ROOT, 'sourcemap', 'evidence-items.json');

const args = process.argv.slice(2);
const has = flag => args.includes(flag);
const num = (flag, fallback) => {
  const i = args.indexOf(flag);
  if (i === -1 || !args[i + 1]) { return fallback; }
  const n = parseInt(args[i + 1], 10);
  return isNaN(n) ? fallback : n;
};

const JSON_OUT = has('--json');
const NO_FAIL = has('--no-fail');
const LIMIT = num('--limit', 0);
const TIMEOUT_MS = num('--timeout', 30000);
const PAUSE_MS = 400;

/* A path no server should have a document at. Random so a host cannot have
   been configured to special-case it, and long enough not to collide. */
const CONTROL = () =>
  '/wgo-link-check-control-' + Math.random().toString(36).slice(2) + '-does-not-exist';

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function fetchUrl(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    /* No custom User-Agent. A polite crawler would name itself, and naming
       itself is what got this blocked: sending
       'WhoGaveTheOrder-link-check (+https://www.whogavetheorder.in)' to
       www.indiacode.nic.in returns 403 on URLs that serve 200 to curl's
       default agent. Every source that host holds would have been reported
       dead. */
    const res = await fetch(url, {
      redirect: 'follow',
      signal: ctrl.signal
    });
    const buf = Buffer.from(await res.arrayBuffer());
    return {
      status: res.status,
      type: (res.headers.get('content-type') || '').split(';')[0].trim(),
      bytes: buf.length,
      /* Only the head of the body is kept, and only to compare against the
         control response. Nothing is stored. */
      head: buf.subarray(0, 2048).toString('latin1'),
      finalUrl: res.url
    };
  } catch (err) {
    return { status: 0, error: err.name === 'AbortError' ? `timeout after ${TIMEOUT_MS}ms` : err.message };
  } finally {
    clearTimeout(timer);
  }
}

/* A second opinion, from a different HTTP client.

   Two clients do not always agree, and the disagreement is not academic: on
   https://www.indiacode.nic.in/bitstream/123456789/20340/1/bnss,_2023.pdf —
   a live source in this archive — curl returns 200 with a 2 MB PDF and Node's
   fetch returns 404 with a 686-byte error page, same URL, same user agent.
   Whatever the cause (the literal comma in the path is the obvious suspect),
   a verdict that depends on which library made the request is not a finding
   about the source.

   So a DEAD verdict is confirmed with curl before it is reported as DEAD. If
   the two disagree the verdict is CONFLICT, which does not fail the run: it
   says the archive could not establish whether the source is there, which is
   true, and is the same discipline the records use. */
function curlProbe(url) {
  try {
    const out = execFileSync('curl', [
      '-sS', '-L', '-o', '/dev/null',
      '--max-time', String(Math.ceil(TIMEOUT_MS / 1000)),
      '-w', '%{http_code} %{content_type}', url
    ], { encoding: 'utf8', timeout: TIMEOUT_MS + 5000 });
    const [code, type] = out.trim().split(/\s+/);
    return { available: true, status: parseInt(code, 10) || 0, type: (type || '').split(';')[0] };
  } catch (err) {
    return { available: false, error: err.message };
  }
}

/* One control probe per origin, cached: hosts are slow and this is the same
   answer every time for a given host. */
const controls = new Map();
async function controlFor(url) {
  let origin;
  try { origin = new URL(url).origin; } catch { return null; }
  if (!controls.has(origin)) {
    await sleep(PAUSE_MS);
    controls.set(origin, await fetchUrl(origin + CONTROL()));
  }
  return controls.get(origin);
}

function expectedType(url) {
  const p = (() => { try { return new URL(url).pathname.toLowerCase(); } catch { return ''; } })();
  if (p.endsWith('.pdf')) { return 'application/pdf'; }
  return null;
}

function classify(url, res, control) {
  if (res.status === 0) {
    return { verdict: 'UNREACHABLE', detail: res.error };
  }
  /* 4xx and 5xx are different findings. A 404 says the document is not at this
     URL any more, which is what this tool exists to catch. A 503 says the
     server is having a bad day, which it may not be having tomorrow, and
     reporting that as a dead citation would train the reader to ignore the
     report. Only 4xx can fail a run. */
  if (res.status >= 500) {
    return { verdict: 'TRANSIENT', detail: `HTTP ${res.status} — server error, not a missing document` };
  }
  if (res.status >= 400) {
    return { verdict: 'DEAD', detail: `HTTP ${res.status}` };
  }

  /* The catch-all test. If the origin answers a path that cannot exist with
     the same body it gave this URL, its status codes mean nothing here. */
  if (control && control.status >= 200 && control.status < 400 &&
      control.head && control.head === res.head && control.bytes === res.bytes) {
    return {
      verdict: 'UNCHECKABLE',
      detail: `origin answers a nonexistent path with the same ${res.bytes}-byte body ` +
              `(HTTP ${control.status}), so its status codes carry no information`
    };
  }

  const want = expectedType(url);
  if (want && res.type && res.type !== want) {
    return {
      verdict: 'WRONG_TYPE',
      detail: `URL claims ${want}, server returned ${res.type}` +
              (res.finalUrl && res.finalUrl !== url ? ` after redirect to ${res.finalUrl}` : '')
    };
  }

  return { verdict: 'OK', detail: `HTTP ${res.status} ${res.type || 'no content-type'} ${res.bytes}B` };
}

async function main() {
  const items = JSON.parse(fs.readFileSync(FILE, 'utf8'));

  /* One URL can be cited by many items. Check it once, report every citer. */
  const byUrl = new Map();
  for (const item of items) {
    for (const source of item.sources || []) {
      if (!source.url) { continue; }
      if (!byUrl.has(source.url)) { byUrl.set(source.url, { citedBy: [], archived: false }); }
      const entry = byUrl.get(source.url);
      entry.citedBy.push(item.id);
      if (source.archive_url) { entry.archived = true; }
    }
  }

  let urls = [...byUrl.keys()];
  if (LIMIT > 0) { urls = urls.slice(0, LIMIT); }

  const results = [];
  for (const url of urls) {
    const control = await controlFor(url);
    await sleep(PAUSE_MS);
    const res = await fetchUrl(url);
    let { verdict, detail } = classify(url, res, control);

    if (verdict === 'DEAD' || verdict === 'WRONG_TYPE') {
      const second = curlProbe(url);
      if (!second.available) {
        detail += '; not confirmed (curl unavailable), treat as provisional';
      } else if (second.status >= 200 && second.status < 400) {
        verdict = 'CONFLICT';
        detail = `fetch says ${detail}, curl says HTTP ${second.status} ` +
                 `${second.type || 'no content-type'}. Two clients disagree, so this ` +
                 `establishes nothing either way — open it by hand.`;
      } else {
        detail += `; confirmed by curl (HTTP ${second.status})`;
      }
    }

    const meta = byUrl.get(url);
    results.push({ url, verdict, detail, citedBy: meta.citedBy, archived: meta.archived });
    if (!JSON_OUT) {
      process.stdout.write(`  ${verdict.padEnd(12)} ${url}\n`);
    }
  }

  const by = v => results.filter(r => r.verdict === v);
  const dead = [...by('DEAD'), ...by('WRONG_TYPE')];

  if (JSON_OUT) {
    console.log(JSON.stringify({ checked: results.length, results }, null, 2));
  } else {
    console.log(`\n${results.length} distinct source URL(s) checked.`);
    for (const v of ['OK', 'DEAD', 'WRONG_TYPE', 'CONFLICT', 'TRANSIENT', 'UNCHECKABLE', 'UNREACHABLE']) {
      const n = by(v).length;
      if (n) { console.log(`  ${v.padEnd(12)} ${n}`); }
    }
    if (dead.length) {
      console.log('\nSources that no longer resolve to the document cited:');
      for (const r of dead) {
        console.log(`\n  ${r.url}`);
        console.log(`    ${r.detail}`);
        console.log(`    cited by: ${r.citedBy.join(', ')}`);
        console.log(`    archived copy on record: ${r.archived ? 'yes' : 'NO — this citation has no fallback'}`);
      }
      console.log('\nThese are not fixed automatically. Find where the document lives now, add the');
      console.log('new URL beside the old one rather than replacing it (the earlier retrieval did');
      console.log('happen), and record the date the old one was found dead.');
    }
    const conflict = by('CONFLICT');
    if (conflict.length) {
      console.log(`\n${conflict.length} URL(s) where two HTTP clients disagree:`);
      for (const r of conflict) { console.log(`  ${r.url}\n    ${r.detail}`); }
    }
    const unchk = by('UNCHECKABLE');
    if (unchk.length) {
      console.log(`\n${unchk.length} URL(s) are on hosts whose status codes carry no information.`);
      console.log('Reported as uncheckable rather than guessed at. Confirm these by opening them.');
    }
  }

  if (dead.length && !NO_FAIL) { process.exit(1); }
}

main().catch(err => { console.error('link check failed:', err.message); process.exit(2); });
