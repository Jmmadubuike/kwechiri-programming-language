# Functions

Named functions use `ọrụ`, parameters, and `laghachi`:

```kwe
ọrụ gbakọọ(a, b) {
    laghachi a + b
}
```

Functions are named declarations permitted only at module top level. They must
be declared before use. Declarations inside functions, conditions, loops, or
other nested blocks are errors.

Calls require the exact argument count. The first successfully analyzed call
establishes one inferred parameter signature for the function. Every later call
must use that same signature. Kwechiri does not implicitly specialize one
function for multiple signatures, and this inference is not generics.

Every function receives eager structural validation, including uncalled
functions. This validates rules that do not depend on inferred parameter types:
placement, names, scope, call order and arity, unsupported recursion, and
same-block reachability. Expressions whose validity depends on parameter types
are analyzed when the function signature is established. Consequently, an
uncalled function does not receive invented parameter types.

Parameters and assigned variables are function-local, and module variables
cannot be captured. A parameter or local may reuse a module-level name because
the function scope is isolated. Nested control-flow blocks continue to use the
ordinary flow rules and do not introduce general shadowing.

A function that reaches the end of its body returns `efu`. A concrete return on
one reachable path and fallthrough on another is rejected as an inconsistent
return type. All reachable concrete returns must agree on one type. Explicit
`laghachi efu` is valid, and `laghachi` exits the entire function. A statement
unconditionally following a return in the same block is an error.

Duplicate function names and parameter names are errors. Direct recursion,
mutual recursion, and recursive module dependency graphs are unsupported.
Functions are not first-class values: they cannot be assigned, passed, or
returned. Nested functions, closures, and default parameters are unsupported.

Arrays and objects are passed and returned by reference. Calls and returns do
not implicitly copy collections, so mutation through a parameter or returned
alias is observable through other aliases.

**Deferred beyond 1.0** — recursion, nested and first-class functions, closures,
default parameters, annotations, generics, and general function overloading.
