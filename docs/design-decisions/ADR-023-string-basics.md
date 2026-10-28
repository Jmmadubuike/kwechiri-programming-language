# ADR-023: Standard Library string basics

## Context

Batch 11A established `kwechiri:eriri` as a module of explicitly imported, pure
string predicates. The owner approved Batch 11B to add foundational string
length and concatenation without introducing collection generics, host
capabilities, or arbitrary JavaScript behavior.

## Options considered

1. Count UTF-16 code units.
2. Count Unicode code points.
3. Count extended grapheme clusters.
4. Reuse JavaScript string coercion for concatenation.

## Decision

Extend `kwechiri:eriri` with two provisionally named pre-1.0 APIs:

| Function | Signature | Meaning |
|---|---|---|
| `ogologoEriri` | `(string) -> number` | Count extended grapheme clusters |
| `jikọọEriri` | `(string, string) -> string` | Concatenate both strings exactly |

`ogologoEriri("")` returns `0`. Length follows extended grapheme-cluster
segmentation so a precomposed or canonically decomposed Igbo letter counts as
one user-perceived character, as do emoji sequences such as flags and
profession emoji containing joiners.

`jikọọEriri` concatenates the raw strings without coercion or normalization.
An NFC and NFD spelling that are not the same raw sequence remain different
after concatenation.

Both APIs are non-mutating and pure. They accept only the documented arity and
types. Wrong arity or statically known wrong argument types are located
semantic errors. Neither API introduces a runtime value error or platform
capability.

## Consequences

The APIs build on the existing `string` and `number` language types without
introducing generics, method syntax, aliases, or new globals.

Extended grapheme segmentation depends on the host's Unicode implementation.
This is acceptable for a provisional pre-1.0 API, but the 1.0 compatibility
review must verify cross-host consistency and decide whether to pin a Unicode
support policy. The public names remain provisional until the 1.0 terminology
review.
