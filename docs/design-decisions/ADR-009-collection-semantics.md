# ADR-009: Collection semantics

## Context

Milestone 7 needs approachable arrays and objects without inheriting mutable
JavaScript references, reference equality, or unstable console formatting.

## Options considered

1. Reuse JavaScript collection behavior directly.
2. Use familiar punctuation with strict Kwechiri collection rules.
3. Invent unfamiliar collection punctuation solely for visual distinction.

## Decision

The project owner approved option 2:

- Arrays use `[...]` and zero-based indexing.
- Arrays are non-empty and homogeneous in this milestone.
- Objects use `{ key: value }` and dot property access.
- Object keys are unique Unicode identifiers.
- Collections are immutable; only their containing variable can be reassigned.
- Missing properties and invalid indexes are Kwechiri errors.
- Nested coherent collections are supported.
- Collection equality is not yet defined.
- `bipụta` uses stable JSON-like collection formatting.

## Consequences

The syntax is familiar while its type, safety, equality, and diagnostic rules
belong to Kwechiri. Empty arrays, element/property mutation, computed
properties, spread syntax, and collection methods remain future decisions.
