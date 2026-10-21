# Contributing

WhoGaveTheOrder.in asks one question: when state power is used against
citizens, who authorised it? The rule that governs every contribution is that
nothing renders as a fact without a source. A field with no source reads
`UNKNOWN`, and a claim without a source ID does not appear on the site.

## What helps most

- **A correction.** Write to corrections@whogavetheorder.in with the record ID
  and what the source says. A pull request that fixes a record must cite the
  source in the same change.
- **Evidence.** Documents, orders, RTI replies and court records go to
  evidence@whogavetheorder.in or through the submission page, not through this
  repository. Contributor details never enter the repository.
- **Code and tooling.** Bug fixes, accessibility fixes and checks are welcome as
  pull requests.

## Rules for any change to the records

- Every factual claim carries a source ID. If you cannot source it, leave the
  field as `UNKNOWN`. Do not write plausible placeholders.
- Do not name a private individual, a complainant or a victim. Name an official
  only in the capacity in which the source names them.
- Say what the source says and no more. An allegation is attributed to whoever
  makes it. Do not state intent.
- Judge sources as `SOURCING.md` describes.
- Do not ask anyone to break a law, a service rule or a confidentiality
  obligation, and do not ask a source to photograph a document where they could
  be identified.

## Running the checks

```bash
node tools/check.js
python3 sourcemap/validate.py
node tools/build-seo.js --check
node tools/build-letters.js --check
node tools/build.js
```

`node tools/build.js` regenerates the change log, the feed and `data/export/`
from git history. It skips the latest commit, so a later commit may make its
output differ. Run `git fetch --unshallow` first if your clone is shallow, and
commit what it writes.

## Licence

Code is MIT. Text and data are CC BY 4.0, with credit to Varna Sri Raman and
WhoGaveTheOrder.in. See [LICENSE](LICENSE).
