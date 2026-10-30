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
capture module variables. A parameter or local may reuse a module-level name
because these scopes are isolated. Nested control-flow blocks do not introduce
general shadowing.

Immutable declarations, explicit declaration syntax, and general block
shadowing are deferred beyond 1.0.
