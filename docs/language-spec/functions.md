# Functions

Named functions use `ọrụ`, parameters, and `laghachi`:

```kwe
ọrụ gbakọọ(a, b) {
    laghachi a + b
}
```

Functions must be declared before use. Calls require the exact argument count.
Parameters and assigned variables are function-local, and program variables
cannot be captured. Argument types are checked against parameter use. A called
function that reaches the end of its body returns `efu`. A concrete return on
one reachable path and fallthrough on another is rejected as an inconsistent
return type. Explicit `laghachi efu` is valid.

Duplicate function names and parameter names are errors.

Arrays and objects are passed and returned by reference. Calls and returns do
not implicitly copy collections, so mutation through a parameter or returned
alias is observable through other aliases.

**Status: Undecided** — recursion, closures, default parameters, anonymous or
nested functions, and overloading.
