# ADR-004: Variable semantics

## Context

Kwechiri needs a beginner-friendly variable model for Milestone 2. The charter
already proposes assignment syntax such as `aha = "Uche"`, but it does not
settle whether first assignment declares a name or whether reassignment is
allowed.

## Options considered

1. Introduce separate mutable and immutable declaration keywords now.
2. Make every variable immutable after its first assignment.
3. Let first assignment create a variable and later assignment update it.

## Decision

The project owner approved option 3 for Kwechiri 0.1:

- `aha = "Uche"` creates `aha` when the name does not exist.
- A later `aha = "Ada"` updates the same variable.
- Reading a name before its first assignment is a compile-time Kwechiri error.
- Variables are program-wide and available from their first assignment onward.
- Unicode Igbo names are supported.
- No declaration or immutability keywords are introduced.
- Generated JavaScript names are internal and independent of Kwechiri names.

## Consequences

The initial model is small and readable, and JavaScript reserved words can be
valid Kwechiri variable names. Block scope, shadowing, immutability, identifier
normalization, and declarations inside future control-flow constructs remain
future language-design decisions.
