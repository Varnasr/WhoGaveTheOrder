#!/usr/bin/env node
/* =============================================================================
   The preservation letters, as data the site can compose from
   -----------------------------------------------------------------------------
   correspondence/*.md is where the four Bihar preservation representations are
   written and reviewed. letters.html has to put the same text into a mail
   window with the placeholders filled in, and the one thing that must not
   happen is the page sending a letter that differs from the letter in the
   repository. So the page does not carry its own copy: this parses the
   markdown into data/letters.generated.js, and CI fails if the two drift.

       node tools/build-letters.js
       node tools/build-letters.js --check    # exit 1 if the generated file is stale

   The markdown is the source. If a letter needs changing, change the markdown.
   ========================================================================== */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'correspondence');
const OUT = path.join(ROOT, 'data', 'letters.generated.js');

/* The placeholders the drafts leave blank rather than invent. README.md step 1
   is "fill every [ ] before use", and a letter posted with "[sender name]" in
   it is worse than no letter, so the page has to know which fields these are
   rather than guess from the text. A placeholder in a draft that is not in this
   table fails the build: it would otherwise reach a mail window unfilled. */
const FIELDS = {
  '[sender name]': 'name',
  '[sender address]': 'address',
  '[email]': 'email',
  '[telephone]': 'telephone',
  '[date]': 'date',
};

/* Lines that belong to the draft's own apparatus rather than to the letter.
   "By speed post / by email" is a despatch instruction on a printed page and
   reads as an error inside an email; the postal-address placeholder is a note
   to whoever sends it, and contacts.md says so at length. */
const DROP_LINE = [
  /^\*\*By speed post \/ by email\*\*$/,
  /^\[postal address[^\]]*\]$/,
  /^\*\(contacts verified [^)]*\)\*$/,
  /^Email:\s*\S+\s*·\s*Tel:/,
];

function plain(md) {
  return md
    .replace(/\*\*(.+?)\*\*/gs, '$1')
    .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/gs, '$1')
    .replace(/`([^`]+)`/g, '$1');
}

function parse(file) {
  const raw = fs.readFileSync(path.join(SRC, file), 'utf8');
  const parts = raw.split(/^---\s*$/m);
  if (parts.length < 3) { throw new Error(`${file}: expected a header, an address block and a body separated by ---`); }

  const header = parts[0];
  const addressBlock = parts[1];
  const body = parts[2];

  const title = (header.match(/^#\s+(.+)$/m) || [])[1];
  if (!title) { throw new Error(`${file}: no level-one heading`); }
  const district = (title.split(':')[1] || '').trim();
  if (!district) { throw new Error(`${file}: heading does not name a district after a colon`); }

  /* The addressee is everything between "To," and the contact line. Munger is
     the only one of the four with a postal address, because munger.nic.in
     publishes one and the other three district sites were returning 503 when
     contacts.md was written. The page offers the postal route for Munger alone
     rather than inventing three addresses. */
  const toLines = [];
  let postal = '';
  for (const line of addressBlock.split('\n')) {
    const t = line.trim();
    if (!t || t === 'To,') { continue; }
    if (/^Email:/.test(t)) { break; }
    if (/^\[postal address/.test(t)) { continue; }
    toLines.push(plain(t));
  }
  if (!toLines.length) { throw new Error(`${file}: no addressee between "To," and the contact line`); }
  const addressee = toLines[0];
  if (toLines.length > 1) { postal = toLines.slice(1).join(', '); }

  const contact = addressBlock.match(/^Email:\s*(\S+)\s*·\s*Tel:\s*([^·]+?)(?:\s*·\s*Fax:\s*(.+))?$/m);
  if (!contact) { throw new Error(`${file}: no "Email: … · Tel: …" contact line`); }

  const subject = (body.match(/^\*\*Subject:\s*([\s\S]+?)\*\*$/m) || [])[1];
  if (!subject) { throw new Error(`${file}: no bold Subject line in the body`); }

  /* The letter as it will be sent: the address block without the despatch
     apparatus, then the body from the salutation down, with the trailing
     "Copy to" note dropped: that note is a decision for the sender, and the
     page asks for the decision instead of mailing the question. */
  const keep = (block) => block
    .split('\n')
    .filter((l) => !DROP_LINE.some((re) => re.test(l.trim())))
    .join('\n');

  let letterBody = keep(body).replace(/^\s*Subject:\s*[\s\S]+?\n/m, '');
  letterBody = plain(letterBody).split(/\n\*Copy to:/)[0].split(/\n\*Note before sending:/)[0];

  const text = (plain(keep(addressBlock)).trim() + '\n\n' + letterBody.trim())
    .replace(/\n{3,}/g, '\n\n')
    .trim() + '\n';

  const used = Object.keys(FIELDS).filter((p) => text.includes(p));
  const unknown = (text.match(/\[[^\]]+\]/g) || []).filter((p) => !FIELDS[p]);
  if (unknown.length) {
    throw new Error(`${file}: placeholder(s) the page cannot fill: ${[...new Set(unknown)].join(', ')}`);
  }

  return {
    id: file.replace(/\.md$/, ''),
    district,
    addressee,
    postal,
    email: contact[1],
    tel: contact[2].trim(),
    fax: (contact[3] || '').trim(),
    subject: plain(subject).replace(/\s+/g, ' ').trim(),
    fields: used.map((p) => FIELDS[p]),
    text,
    source: `correspondence/${file}`,
  };
}

function render(letters) {
  return `/* GENERATED by tools/build-letters.js: do not edit by hand.

   The four Bihar preservation representations, parsed out of correspondence/*.md
   so letters.html composes the letter the repository holds rather than a second
   copy of it. Change the markdown, then run:

       node tools/build-letters.js
*/

window.WGO = window.WGO || {};

WGO.letters = ${JSON.stringify(letters, null, 2)};
`;
}

function main() {
  const files = fs.readdirSync(SRC)
    .filter((f) => /^bihar-preservation-.+\.md$/.test(f))
    .sort();
  if (!files.length) { throw new Error('no preservation drafts found in correspondence/'); }

  const letters = files.map(parse);
  const out = render(letters);

  if (process.argv.includes('--check')) {
    const have = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
    if (have !== out) {
      console.error('FAIL: data/letters.generated.js is stale.');
      console.error("        Run 'node tools/build-letters.js' and commit the result.");
      process.exit(1);
    }
    console.log(`OK: ${letters.length} letter(s), generated file matches correspondence/.`);
    return;
  }

  fs.writeFileSync(OUT, out);
  for (const l of letters) {
    console.log(`  ${l.district.padEnd(9)} ${l.email.padEnd(24)} ${String(l.text.length).padStart(5)} chars, fields: ${l.fields.join(', ')}`);
  }
  console.log(`Wrote data/letters.generated.js: ${letters.length} letters.`);
}

main();
