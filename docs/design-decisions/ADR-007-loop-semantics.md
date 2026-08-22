# ADR-007: Loop semantics

## Context

Milestone 5 needs a minimal loop whose behavior remains compatible with
Kwechiri's strict boolean and program-wide variable rules.

## Options considered

1. Copy JavaScript `while`, including truthiness and block behavior.
2. Add a strict pre-condition `mgbe` loop with flow validation.
3. Introduce several loop forms together.

## Decision

The project owner approved option 2:

- `mgbe` is the canonical keyword.
- The condition is checked before each iteration and must be boolean.
- The loop may execute zero times.
- Existing variables may be updated but must retain their value type.
- Variables first assigned in the body are local to that loop body and are not
  available after the loop.
- No implicit iteration limit changes program behavior.

## Consequences

The compiler validates loop-carried variable types and preserves the
zero-iteration path. `kwụsị`, `gaa n'ihu`, `maka`, infinite-loop shorthand,
block-local shadowing, and iteration safety controls remain future decisions.
