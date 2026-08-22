# ADR-006: Condition and comparison semantics

## Context

Milestone 4 needs canonical Igbo control-flow vocabulary, predictable boolean
behavior, comparison rules, and a safe interpretation of program-wide
variables assigned along different branches.

## Options considered

1. Inherit JavaScript truthiness, equality, and block scope.
2. Require booleans and perform Kwechiri-specific flow analysis.
3. Support conditions but prohibit assignments inside their branches.

## Decision

The project owner approved option 2:

- The canonical keywords are `ọ bụrụ`, `ọzọ`, `eziokwu`, and `ụgha`.
- Conditions require boolean values; there is no implicit truthiness.
- `==` and `!=` use value-and-type equality.
- `<`, `<=`, `>`, and `>=` accept numbers only.
- Arithmetic binds more tightly than comparisons.
- `ọzọ` is optional.
- Existing variables can be updated inside branches.
- A name created on only one path is unavailable after the condition.
- A name created on every path becomes available afterward when its value type
  agrees on every path.

## Consequences

The compiler performs definite-assignment and branch-type analysis. Generated
JavaScript declarations may be hoisted to preserve Kwechiri's program-wide
variable model without adopting JavaScript block scope. Truthiness, chained
comparisons, logical operators, block-local variables, and shadowing remain
outside this milestone.
