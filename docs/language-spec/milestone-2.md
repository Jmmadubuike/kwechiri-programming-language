# Milestone 2: Variables

## Status

Approved development specification for Kwechiri 0.1.0.

## Assignment

The first assignment creates a program-wide mutable variable:

```kwe
aha = "Uche"
afọ = 36
```

A later assignment to the same name changes its value. A value may currently be
a string, a base-10 number, or a previously assigned variable. Decimal numbers
use a period, such as `2.5`; exponent notation and numeric separators are not
yet supported.

## Reading variables

Variables can be passed to `bipụta`:

```kwe
bipụta(aha)
bipụta(afọ)
```

Reading a variable before its first assignment is a compile-time error with a
source location. Unicode Igbo letters are valid in variable names.

Block scope, shadowing, immutable bindings, explicit declaration keywords, and
identifier normalization are outside this milestone.
