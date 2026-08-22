# ADR-008: Function semantics

## Context

Milestone 6 needs functions without prematurely introducing annotations,
closures, recursion, or implicit return behavior.

## Options considered

1. Copy JavaScript function scope and coercion.
2. Add explicit parameter and return type annotations.
3. Infer types from calls while keeping function scope isolated.

## Decision

The project owner approved option 3:

- `ọrụ` declares a named function and `laghachi` returns a value.
- Functions must be declared before use and argument count must match.
- Parameters and assignments are local to the function.
- Functions cannot capture program-wide variables.
- Argument types are checked against parameter usage.
- Return types are inferred, and every reachable path must return.
- Duplicate function and parameter names are errors.

## Consequences

No type annotations are needed for the initial syntax. Recursion, closures,
default parameters, anonymous functions, overloading, nested functions, and
implicit empty returns remain future decisions.
