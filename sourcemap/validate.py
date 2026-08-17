#!/usr/bin/env python3
"""
Validate the archive against the rules in CLAUDE.md.

Reports failures. Does not fix them. A silent repair in an evidence archive is
indistinguishable from a fabrication, so every finding here is printed and the
data files are opened read-only.

Checks:
  1. every `confidence` value is one of the six states
  2. every VERIFIED item has >= 1 source with source_type "primary"
  3. every CORROBORATED item has >= 2 sources
  4. no duplicate IDs, within or across files
  5. every ID referenced in a `blocks` or `resolves` field exists

Plus field-discipline checks that follow directly from CLAUDE.md:
  6. source_url present but empty/placeholder
  7. sources missing retrieved_on
  8. source_type outside {primary, secondary, tertiary}
  9. volatility: high flagged for re-verification before use
"""

import json
import pathlib
import re
import sys
from collections import Counter, defaultdict

# Resolve data files against this script rather than the working directory, so
# the validator runs the same from anywhere in the repo.
HERE = pathlib.Path(__file__).resolve().parent

STATES = {"VERIFIED", "CORROBORATED", "REPORTED", "DISPUTED", "UNVERIFIED", "UNKNOWN"}
SOURCE_TYPES = {"primary", "secondary", "tertiary"}

FILES = ["evidence-items.json", "open-questions.json", "filing-queue.json"]

failures = []          # hard rule violations
observations = []      # things to look at, not rule breaches


def fail(check, record_id, detail):
    failures.append((check, record_id, detail))


def observe(check, record_id, detail):
    observations.append((check, record_id, detail))


def load(name):
    with open(HERE / name) as fh:
        return json.load(fh)


def main():
    data = {f: load(f) for f in FILES}
    evidence = data["evidence-items.json"]
    questions = data["open-questions.json"]
    queue = data["filing-queue.json"]

    # ---- 4. duplicate IDs, within and across files --------------------------
    all_ids = defaultdict(list)
    for fname, records in data.items():
        seen = Counter(r.get("id") for r in records)
        for rid, n in seen.items():
            if n > 1:
                fail("duplicate-id", rid, f"appears {n} times in {fname}")
        for r in records:
            all_ids[r.get("id")].append(fname)
    for rid, files in all_ids.items():
        if len(files) > 1:
            fail("duplicate-id-across-files", rid, f"appears in {', '.join(files)}")

    known_ids = set(all_ids)

    # ---- 1, 2, 3, 6, 7, 8, 9. evidence-item rules ---------------------------
    for item in evidence:
        rid = item.get("id", "<no id>")
        conf = item.get("confidence")
        sources = item.get("sources") or []

        if conf not in STATES:
            fail("bad-confidence", rid, f"confidence={conf!r} is not one of the six states")

        if conf == "VERIFIED":
            primary = [s for s in sources if s.get("source_type") == "primary"]
            if not primary:
                fail("verified-without-primary", rid,
                     f"VERIFIED with {len(sources)} source(s), none source_type=primary")

        if conf == "CORROBORATED" and len(sources) < 2:
            fail("corroborated-under-two-sources", rid,
                 f"CORROBORATED with {len(sources)} source(s)")

        for i, s in enumerate(sources):
            st = s.get("source_type")
            if st not in SOURCE_TYPES:
                fail("bad-source-type", rid, f"sources[{i}].source_type={st!r}")

            url = s.get("url")
            if url is not None:
                if not isinstance(url, str) or not url.strip():
                    fail("empty-url", rid, f"sources[{i}].url is present but empty")
                elif not re.match(r"^https?://", url):
                    fail("malformed-url", rid, f"sources[{i}].url={url!r}")
                elif re.search(r"(example\.com|TODO|PLACEHOLDER|\bsearch\?|/search/)", url, re.I):
                    fail("placeholder-url", rid, f"sources[{i}].url looks like a placeholder or search: {url!r}")

            if not s.get("retrieved_on"):
                observe("missing-retrieved-on", rid, f"sources[{i}] has no retrieved_on")

        if item.get("volatility") == "high":
            observe("high-volatility", rid, "must be re-verified before supporting a published claim")

    # ---- 5. referential integrity: blocks / resolves -------------------------
    for q in questions:
        for ref in q.get("blocks") or []:
            if ref not in known_ids:
                fail("dangling-blocks-ref", q.get("id"), f"blocks {ref!r}, which does not exist")

    for t in queue:
        for ref in t.get("resolves") or []:
            if ref not in known_ids:
                fail("dangling-resolves-ref", t.get("id"), f"resolves {ref!r}, which does not exist")

    # ---- exposure-risk surfacing -------------------------------------------
    for t in queue:
        if t.get("exposure_risk") is True:
            observe("exposure-risk", t.get("id"), "must not be auto-executed; surface to the operator")

    # ---- report -------------------------------------------------------------
    print("=" * 72)
    print("VALIDATION AGAINST CLAUDE.md")
    print("=" * 72)
    for fname, records in data.items():
        print(f"  {fname:24s} {len(records):>4} records")
    print()

    if failures:
        print(f"FAILURES: {len(failures)}")
        by_check = defaultdict(list)
        for check, rid, detail in failures:
            by_check[check].append((rid, detail))
        for check in sorted(by_check):
            print(f"\n  [{check}] — {len(by_check[check])}")
            for rid, detail in by_check[check]:
                print(f"    {rid}: {detail}")
    else:
        print("FAILURES: none. Every hard rule in CLAUDE.md holds.")

    print()
    if observations:
        by_check = defaultdict(list)
        for check, rid, detail in observations:
            by_check[check].append((rid, detail))
        print(f"OBSERVATIONS (not rule breaches): {len(observations)}")
        for check in sorted(by_check):
            items = by_check[check]
            print(f"\n  [{check}] — {len(items)}")
            for rid, detail in items[:12]:
                print(f"    {rid}: {detail}")
            if len(items) > 12:
                print(f"    ... and {len(items) - 12} more")

    print()
    print("=" * 72)
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
