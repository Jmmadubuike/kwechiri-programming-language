# Expressions

Arithmetic operators are `+`, `-`, `*`, and `/`. Multiplication and division
bind more tightly than addition and subtraction. Parentheses override
precedence, and unary `-` negates a number. Arithmetic accepts numbers only;
`+` does not concatenate strings.

Comparison operators are `==`, `!=`, `<`, `<=`, `>`, and `>=`. Ordering accepts
numbers only. Equality is strict for supported primitive values, including
`efu`; it never performs coercion. Ordering and equality are separate
non-chainable precedence tiers. Collection equality is unsupported.

`na` is Boolean conjunction, `maọbụ` is Boolean disjunction, and `ọ bụghị` is
Boolean negation. Their operands must be Boolean and their results are Boolean.
`na` and `maọbụ` evaluate left-to-right and short-circuit.

Precedence from strongest to weakest is: primary/postfix, unary `-` and
`ọ bụghị`, `*` and `/`, `+` and `-`, ordering, equality, `na`, then `maọbụ`.
Unary operators associate right. Arithmetic, `na`, and `maọbụ` associate left.

Expressions may contain literals, variables, calls, array indexes, object
properties, arrays, and objects. Division by zero is a located runtime error.

**Status: Undecided** — modulo, exponentiation, implicit conversion, string
concatenation, and collection equality.
