# Milestone 6: Functions

## Status

Approved development specification for Kwechiri 0.1.0.

## Declaration and call

```kwe
ọrụ gbakọọ(a, b) {
    laghachi a + b
}

nsonaazụ = gbakọọ(10, 20)
bipụta(nsonaazụ)
```

Functions must be declared before they are called. Argument count is exact.
Parameters and variables assigned in a function are local to that function;
program variables cannot be captured. Calls can occur wherever an expression
is accepted.

Every reachable path must return a value with a consistent type. Parameter
types are checked from call arguments against their use in the body.

Recursion, closures, default parameters, anonymous and nested functions,
overloading, and implicit empty returns are not supported in this milestone.
