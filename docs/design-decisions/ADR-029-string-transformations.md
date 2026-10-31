# ADR-029: Standard Library string transformations

## Context

Kwechiri 1.0 exposed exact matching, grapheme length, and concatenation in
`kwechiri:eriri`. The owner approved Batch 11C to add common text
transformations without changing the frozen language syntax or introducing
host-specific behavior.

## Decision

Extend `kwechiri:eriri` with four pure, non-mutating functions:

| Function | Signature | Meaning |
| --- | --- | --- |
| `wepuOghere` | `(string) -> string` | Remove leading and trailing Unicode White_Space |
| `okwuNta` | `(string) -> string` | Apply Unicode default, locale-independent lowercase mapping |
| `okwuNnukwu` | `(string) -> string` | Apply Unicode default, locale-independent uppercase mapping |
| `dochieEriri` | `(string, string, string) -> string` | Replace every exact non-overlapping occurrence literally |

`wepuOghere` preserves interior whitespace and does not normalize the result.

Case mapping uses the host's Unicode default mapping and no locale selector. It
does not normalize input or output. The Unicode 15.0.0 portable baseline from
ADR-028 applies.

`dochieEriri` is literal and case-sensitive. It does not interpret regular
expressions or replacement patterns. An empty search string returns the input
unchanged. The replacement text is inserted literally and is not recursively
processed.

The functions use existing cataloged string signatures. Wrong arity and static
type mismatches use `KWE-STD-003` and `KWE-STD-004`; no new diagnostic or
runtime error code is introduced.

## Consequences

The additions are compatible under the 1.x semver policy and require release
`1.1.0`. Slicing, splitting, character access, number conversion, collection
operations, and host capabilities remain unsupported.

The CLI, browser playground, and VS Code extension must share the same catalog
and intrinsic implementation.
