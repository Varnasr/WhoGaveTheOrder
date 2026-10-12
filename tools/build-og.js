#!/usr/bin/env node
/* =============================================================================
   Share images
   -----------------------------------------------------------------------------
   Renders the 1200x630 card each page and incident shows when its link is
   pasted into WhatsApp, X, LinkedIn or a message. What each card says comes
   from og/cards.json, which tools/build-seo.js writes from the same data as
   the page, so a card cannot describe an incident differently from its page.

   This needs a browser, so it is not run in CI. CI checks instead that every
   card has an image and that the image was drawn from the words now in
   cards.json: og/manifest.json records the hash each image was drawn from.

       node tools/build-seo.js      # writes og/cards.json
       node tools/build-og.js       # draws what is missing or out of date
       node tools/build-og.js --all # redraws everything

   Playwright is found through WGO_PLAYWRIGHT (a path to the module, defaulting to
   where the build sandbox keeps it). The browser is Playwright's own unless
   CHROMIUM names an executable.
   ========================================================================== */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ALL = process.argv.includes('--all');
const PLAYWRIGHT = process.env.WGO_PLAYWRIGHT || '/opt/node-tools/node_modules/playwright';
const CHROMIUM = process.env.CHROMIUM || '';

const STATE = {
  CORROBORATED:        { fg: '#0b4f6c', bg: '#e2eff5', br: '#a4c9d9' },
  REPORTED:            { fg: '#7c5300', bg: '#fbf1dc', br: '#dfc9a0' },
  UNDER_INVESTIGATION: { fg: '#6b5000', bg: '#fdf0c8', br: '#e6cf7a' },
  DISPUTED:            { fg: '#7a2e0e', bg: '#fae7de', br: '#e0b7a4' },
  VERIFIED:            { fg: '#0f5132', bg: '#e6f2ea', br: '#a9cfba' }
};

function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

function size(title) {
  const n = title.length;
  return n <= 38 ? 76 : n <= 64 ? 64 : n <= 100 ? 54 : 46;
}

function html(c) {
  const st = STATE[c.state] || { fg: '#16232e', bg: '#eef2f5', br: '#b3c2ce' };
  const incident = c.kind === 'incident';
  const chips = incident
    ? `<span class="chip" style="color:${st.fg};background:${st.bg};border-color:${st.br}">${esc(c.stateLabel.toUpperCase())}</span>` +
      `<span class="chip ${/^No order/.test(c.order) ? 'unknown' : ''}">${esc(c.order.toUpperCase())}</span>` +
      `<span class="chip plain">${c.count} EVIDENCE ITEM${c.count === 1 ? '' : 'S'}</span>`
    : '';
  return `<!doctype html><meta charset="utf-8"><style>
    * { box-sizing: border-box; margin: 0; }
    body { width: 1200px; height: 630px; background: #f8f9fa; color: #16232e; position: relative; overflow: hidden;
      font-family: "Helvetica Neue", Arial, "Liberation Sans", "DejaVu Sans", sans-serif; }
    .bar { position: absolute; left: 0; top: 0; bottom: 0; width: 28px; background: #3d8dc4; }
    .tab { position: absolute; left: 28px; top: 0; width: 120px; height: 10px; background: #f5c518; }
    .wrap { position: absolute; left: 92px; right: 80px; top: 64px; bottom: 56px; display: flex; flex-direction: column; }
    .kicker { font-family: "DejaVu Sans Mono", Menlo, Consolas, monospace; font-size: 24px; letter-spacing: 0.14em; color: #5F6C76; }
    h1 { font-family: Georgia, "Iowan Old Style", "DejaVu Serif", "Times New Roman", serif; font-weight: 700; line-height: 1.12;
      letter-spacing: -0.01em; margin-top: 30px; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: ${incident ? 4 : 3}; overflow: hidden; }
    .line { margin-top: 26px; font-size: 30px; line-height: 1.35; color: #3d4c58; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: ${incident ? 1 : 3}; overflow: hidden; }
    .chips { margin-top: auto; display: flex; gap: 14px; flex-wrap: wrap; }
    .chip { font-family: "DejaVu Sans Mono", Menlo, Consolas, monospace; font-size: 21px; letter-spacing: 0.08em; padding: 9px 16px; border: 2px solid; }
    .chip.unknown { background: #101012; color: #fcfcfa; border-color: #101012; }
    .chip.plain { background: #fff; color: #3d4c58; border-color: #b3c2ce; }
    .foot { display: flex; justify-content: space-between; align-items: baseline; margin-top: 26px; padding-top: 20px; border-top: 3px solid #16232e; }
    .brand { font-family: Georgia, "DejaVu Serif", serif; font-weight: 700; font-size: 34px; }
    .tag { font-family: "DejaVu Sans Mono", Menlo, Consolas, monospace; font-size: 19px; color: #5F6C76; }
  </style>
  <div class="bar"></div><div class="tab"></div>
  <div class="wrap">
    <div class="kicker">WHOGAVETHEORDER.IN</div>
    <h1 style="font-size:${size(c.title)}px">${esc(c.title)}</h1>
    <div class="line">${esc(c.line)}</div>
    <div class="chips">${chips}</div>
    <div class="foot"><span class="brand">Who gave the order?</span><span class="tag">A public record of police use of force in India</span></div>
  </div>`;
}

async function main() {
  const cards = JSON.parse(fs.readFileSync(path.join(ROOT, 'og/cards.json'), 'utf8'));
  const manifestPath = path.join(ROOT, 'og/manifest.json');
  let manifest = {};
  try { manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')); } catch (err) { /* first run */ }

  const todo = cards.filter((c) => ALL || manifest[c.name] !== c.hash || !fs.existsSync(path.join(ROOT, c.file)));
  if (!todo.length) { console.log('Every share image is current.'); return; }

  const { chromium } = require(PLAYWRIGHT);
  const browser = await chromium.launch(CHROMIUM ? { executablePath: CHROMIUM } : {});
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  for (const c of todo) {
    await page.setContent(html(c), { waitUntil: 'load' });
    await page.screenshot({ path: path.join(ROOT, c.file), type: 'png' });
    manifest[c.name] = c.hash;
  }
  await browser.close();

  /* Keep the manifest to the cards that exist, in a stable order. */
  const names = new Set(cards.map((c) => c.name));
  const out = {};
  Object.keys(manifest).sort().forEach((k) => { if (names.has(k)) { out[k] = manifest[k]; } });
  fs.writeFileSync(manifestPath, JSON.stringify(out, null, 2) + '\n');
  console.log(`Drew ${todo.length} share image(s).`);
}

main().catch((err) => { console.error(err); process.exit(1); });
