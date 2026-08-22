# Functions

Named functions use `ọrụ`, parameters, and `laghachi`:

```kwe
ọrụ gbakọọ(a, b) {
    laghachi a + b
}
```

Functions must be declared before use. Calls require the exact argument count.
Parameters and assigned variables are function-local, and program variables
cannot be captured. Argument types are checked against parameter use. Every
reachable path must return a consistent value type.

Duplicate function names and parameter names are errors.

**Status: Undecided** — recursion, closures, default parameters, anonymous or
nested functions, overloading, and implicit empty returns.
