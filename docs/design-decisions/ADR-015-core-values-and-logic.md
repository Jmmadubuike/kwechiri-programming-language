# ADR-015: Core values and logic

## Context

Kwechiri needs an explicit absence value and Boolean logic before its standard
library is designed. These rules must remain strict, predictable, Igbo-facing,
and independent of accidental JavaScript truthiness or operand-return behavior.

## Options considered

- Defer absence, model null and undefined separately, or define one absence value
- Preserve strict Booleans or introduce truthiness
- Return Boolean results or original operands from logical expressions
- Evaluate both operands or short-circuit
- Reject function fallthrough or give it a defined absence result

## Decision

`efu` is Kwechiri's explicit value for absence or no value. The initial
JavaScript backend represents it with `null`, but that is not its language
definition. `efu` is a reserved keyword and has semantic type `absence`.

Conditions remain Boolean-only. `na` and `maọbụ` require two Boolean operands,
always produce a Boolean, evaluate left-to-right, and short-circuit. Unary
`ọ bụghị` requires and produces a Boolean. Semantic validation checks both
operand types even when runtime short-circuiting would skip the right operand.

A called function that falls through returns `efu`. A concrete return type on
one reachable path and fallthrough on another is a type inconsistency; Kwechiri
does not add union types. Explicit `laghachi efu` is supported.

Kwechiri printing renders Booleans as `eziokwu` and `ụgha`, and absence as
`efu`, including inside printable arrays and objects.

Absence equality is strict: `efu == efu` is true, while equality with a
non-absence primitive is false. Arithmetic and ordering with `efu` are invalid.
Explicit `efu` values may appear in homogeneous arrays and object properties;
missing properties and invalid indexes remain errors.

Precedence from strongest to weakest is primary/postfix, unary, multiplicative,
additive, ordering, equality, `na`, `maọbụ`, then the assignment-statement
boundary. Unary operators associate right; arithmetic, `na`, and `maọbụ`
associate left; ordering and equality remain non-chainable within their tiers.

## Consequences

The words `efu`, `maọbụ`, and `bụghị` become reserved. Existing programs using
them as identifiers are incompatible. Boolean printing changes from host words
`true`/`false` to Kwechiri vocabulary. Called functions that previously failed
solely because they had no return can now yield `efu`. Ordering and equality
now occupy separate parser tiers, and logical syntax becomes available.

The backend must never expose JavaScript `undefined` as a Kwechiri value.
Collection redesign, union types, truthiness, Unicode escapes, and standard
library behavior remain outside this decision.
