# WhoGaveTheOrder

Shared engineering standard: @.claude/engineering-standards.md. It applies to all work in this repository. This file adds what is specific to the project, and wins where the two disagree.

A citizen-led accountability archive at www.whogavetheorder.in: when state
power is used against citizens, who authorised it. Split out of
`Varnasr/Experiments` on 17 August 2026. Served by Netlify.

The rule the README states first governs everything: nothing renders as a fact
without a source, including in the seed data. A field with no source reads
`UNKNOWN`. `SOURCING.md` sets out how sources are judged.

## Commands

```bash
node tools/check.js
python3 sourcemap/validate.py
node tools/build-seo.js --check
node tools/build-letters.js --check
node tools/build.js
```

`sweep.yml` runs daily and `translate.yml` pushes commits; both are builds
on the Netlify site.
