# ADR-022: Standard Library signatures and errors

## Context

Standard APIs need predictable typing and diagnostics without JavaScript
coercion, uncontrolled exceptions, generic user functions, or host leakage.

## Options considered

1. Validate calls only in JavaScript at runtime.
2. Treat standard exports as ordinary inferred Kwechiri functions.
3. Give cataloged exports exact compiler-known signatures and intrinsic
   identities.

## Decision

The internal catalog records module, public name, arity, parameter types, return
type, mutation behavior, and intrinsic identity. Semantic analysis validates
known arity and types at the call location before code generation.

Batch 11A functions each have signature `(string, string) -> boolean`, mutate
nothing, perform no coercion, and use exact case-sensitive string-sequence
matching without normalization. Wrong arity or type is a located Kwechiri
semantic error. Unknown official modules and exports are controlled module
errors.

## Consequences

The operations cannot receive arbitrary JavaScript values or leak host errors.
This is a private intrinsic signature mechanism, not public generics,
overloading, callbacks, or first-class functions. Later runtime value and
platform error categories require separate approved extensions.
