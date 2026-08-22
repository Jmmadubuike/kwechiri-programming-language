# Variables

The first assignment creates a mutable variable:

```kwe
aha = "Uche"
```

A later assignment updates it. Reading before first assignment is a located
compile-time error. Program variables are available from their first assignment
onward.

Conditional flow uses definite assignment: a new name is available afterward
only when every branch creates it with the same value type. A name created only
inside a `mgbe` body is unavailable after the loop because the loop may execute
zero times.

Function parameters and assignments are local to that function and cannot
capture program variables.

**Status: Undecided** — immutable declarations, explicit declaration syntax,
general block scope, and shadowing.
