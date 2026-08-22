# Milestone 3: Arithmetic expressions

## Status

Approved development specification for Kwechiri 0.1.0.

## Operators

Kwechiri supports number-only `+`, `-`, `*`, and `/` expressions. Standard
precedence applies, parentheses can group expressions, and unary `-` creates a
negative value.

```kwe
nsonaazụ = (10 + 20) * 2
bipụta(nsonaazụ)
```

This prints `60`. Expressions may occur in assignments or as the argument to
`bipụta`.

Using strings with arithmetic is a compile-time error. Dividing by zero is a
Kwechiri runtime error. String concatenation, modulo, exponentiation, implicit
conversion, and advanced numeric types are not supported in this milestone.
