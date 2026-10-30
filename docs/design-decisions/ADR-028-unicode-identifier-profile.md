# ADR-028: Unicode identifier profile

## Context

Kwechiri identifiers must handle Igbo text, NFC-equivalent spellings, combining
marks, and Unicode letters beyond the Basic Multilingual Plane. Source
coordinates also need a stable unit for diagnostics and editors.

## Decision

The Kwechiri 1.0 identifier profile is:

- the lexer advances by Unicode code point, not isolated UTF-16 code units;
- an identifier begins with `_` or a Unicode Letter (`\p{L}`);
- subsequent characters may be `_`, a Unicode Letter, a Mark (`\p{M}`), or a
  Number (`\p{N}`);
- keywords and names use NFC identity and remain case-sensitive;
- raw source spelling and raw offsets remain available to diagnostics and
  module rewriting;
- no ASCII aliases are introduced;
- `ID_Start` and `ID_Continue` are not adopted for 1.0; the existing
  Letter/Mark/Number categories remain the language contract;
- Unicode 15.0.0 is the guaranteed portable baseline; a supported host may
  expose later Unicode data, but characters added after 15.0.0 are not
  guaranteed across hosts;
- line, column, and offset remain measured in UTF-16 code units as decided in
  ADR-027.

Malformed UTF-8 is rejected before lexing. Source text is not otherwise
normalized, and string contents, module paths, and filesystem paths remain raw.

## Consequences

Astral letters can form identifiers, while diagnostics continue to report
stable UTF-16 coordinates. A character accepted by a newer runtime may not be
portable to an older supported runtime until the baseline is raised through a
compatibility decision. Tooling must preserve code points and must not split
surrogate pairs while scanning identifiers.
