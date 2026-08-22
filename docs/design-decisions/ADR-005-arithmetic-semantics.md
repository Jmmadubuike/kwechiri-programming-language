# ADR-005: Arithmetic expression semantics

## Context

Milestone 3 introduces arithmetic. Operator precedence, accepted operand types,
negative values, and division by zero must behave as Kwechiri language rules
rather than accidental JavaScript behavior.

## Options considered

1. Copy JavaScript arithmetic, including coercion and `Infinity`.
2. Support number-only arithmetic with explicit Kwechiri validation.
3. Delay arithmetic until a complete numeric type system exists.

## Decision

The project owner approved option 2:

- `+`, `-`, `*`, and `/` accept numbers only.
- Multiplication and division bind more tightly than addition and subtraction.
- Parentheses override precedence.
- Unary `-` creates a negative numeric value.
- Division by zero produces a Kwechiri runtime error.
- `+` does not concatenate strings or perform implicit conversion.

## Consequences

Arithmetic is predictable and beginner-friendly. The initial number
representation remains JavaScript-compatible floating point. Modulo,
exponentiation, implicit conversion, and advanced numeric types are outside
this decision.
