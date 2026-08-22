# Milestone 5: Loops

## Status

Approved development specification for Kwechiri 0.1.0.

## Syntax

`mgbe` is a pre-condition loop:

```kwe
ọnụọgụ = 1
mgbe (ọnụọgụ <= 5) {
    bipụta(ọnụọgụ)
    ọnụọgụ = ọnụọgụ + 1
}
```

The condition must be boolean. Existing variables can be updated in the body
but cannot change value type. A variable first assigned in the body is
available later in that body but not after the loop, because the loop may run
zero times.

Break, continue, `maka`, infinite-loop shorthand, and implicit iteration limits
are not part of this milestone.
