# ADR-017: Pre-1.0 function semantics

## Context

ADR-008 introduced named functions with call-driven parameter inference and an
isolated local scope. The pre-1.0 foundation audit found that completely lazy
analysis allowed invalid uncalled or nested declarations to escape validation,
while analyzing one function independently for several call signatures created
accidental generic-like behavior. The current language has neither parameter
annotations nor the return-type information required for predictable recursion.

## Options considered

- preserve fully lazy analysis and per-call signature specialization;
- require complete eager typechecking, which would require inventing parameter
  types or adding an unapproved annotation or inference system;
- eagerly validate type-independent structure, then establish one inferred
  signature when parameter-dependent analysis becomes possible.

The audit also considered recursion, nested and first-class functions, closures,
default parameters, implicit capture, general shadowing, and relaxed arity.

## Decision

Choose eager structural validation with one call-established signature.

Functions are named declarations at module top level only and must be declared
before use. Every declaration is structurally validated even when uncalled.
This validation covers declaration placement, duplicate names, isolated scope,
call order and arity, structurally detectable recursion, unsupported constructs,
and same-block statements made unreachable by `laghachi`. It does not claim to
typecheck parameter-dependent expressions before a signature exists.

The first successful parameter-dependent analysis establishes exactly one
inferred parameter signature and one return type. Every later call must match
the parameter signature. Arity is exact. No missing argument becomes JavaScript
`undefined`, and no implicit multi-signature specialization or generics exists.

Function parameters and assignments occupy an isolated function scope and do
not capture module bindings. Parameters and locals may reuse module-level names.
General block shadowing is not introduced.

Fallthrough returns `efu`. Reachable concrete returns must agree on one type,
and concrete return combined with reachable fallthrough is invalid. Collections
retain shared reference identity through calls and returns.

Direct recursion, mutual recursion, recursive module dependency graphs, nested
functions, first-class functions, closures, and default parameters are
unsupported for 1.0.

## Consequences

Invalid uncalled declarations that violate type-independent rules now fail.
Programs that previously called the same function with different inferred types
now fail after the first signature is established. Valid uncalled functions may
still contain parameter-dependent expressions whose types cannot be decided
without a call; this limitation is explicit rather than treated as full eager
typechecking.

No runtime representation, compiler public API, dependency, annotation syntax,
generic type, closure mechanism, or JavaScript-like argument behavior is added.
Recursion and the other excluded function features require a later owner-approved
design before implementation.
