# Expressions

Arithmetic operators are `+`, `-`, `*`, and `/`. Multiplication and division
bind more tightly than addition and subtraction. Parentheses override
precedence, and unary `-` negates a number. Arithmetic accepts numbers only;
`+` does not concatenate strings.

Comparison operators are `==`, `!=`, `<`, `<=`, `>`, and `>=`. Ordering accepts
numbers only. Equality is strict for supported primitive values. Chained
comparisons and collection equality are unsupported.

Expressions may contain literals, variables, calls, array indexes, object
properties, arrays, and objects. Division by zero is a located runtime error.

**Status: Undecided** — logical operators, modulo, exponentiation, implicit
conversion, string concatenation, and collection equality.
