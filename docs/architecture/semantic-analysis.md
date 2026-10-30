# Semantic analysis

Semantic analysis turns the parsed AST into resolved nodes. Generated JavaScript
consumes only these resolved nodes, so identifier resolution, type rules, and
control-flow checks are not repeated during code generation.

## Responsibilities

The stage validates and resolves:

- top-level function placement and duplicate declarations;
- function names, parameter names, call order, recursion, and arity;
- variable definition, scopes, and flow-based availability;
- primitive, function-return, array, object, and absence types;
- array element homogeneity, object shapes, and collection mutation;
- index bounds when statically known;
- conditions, operators, return types, and unreachable statements;
- Standard Library arity, argument types, and intrinsic bindings.

Analysis is synchronous and returns a `ResolvedProgram` or throws a located
`KwechiriError`.

## Two semantic passes

The first structural pass validates rules that do not require a function's
inferred parameter types. It checks function placement, names, local structure,
call order and arity, unsupported recursion, and same-block reachability. This
guarantees that uncalled functions still receive structural validation.

The resolution pass then creates typed resolved expressions and statements.
When a function is called, its parameter signature and return type are inferred
from that first successfully analyzed call. Later calls must use the same
signature. Uncalled functions receive no invented parameter types and do not
produce generated functions.

## Symbols and scopes

Semantic names are case-sensitive NFC identities. Each program name maps to an
internal generated name. Kwechiri names are never used directly as JavaScript
identifiers.

The first assignment creates a binding. A later assignment resolves to the same
generated identifier. Conditional branches merge a name only when both branches
create it with the same type. Loop-created names do not escape the loop because
the body may execute zero times.

Function parameters and locals start in an isolated map. Module variables are
not captured. Conditional hoisting adds JavaScript declarations before the
branch when a same-type name must remain available afterward.

## Type representation

Types are strings:

- `string`, `number`, `boolean`, and `absence`;
- arrays as `array|{"element":...}`;
- objects as `object|{"field":...}`.

Collection types use JSON text recursively. The parser does not expose this
encoding as Kwechiri syntax. Array length is not part of the semantic type, but
known literal length may be retained to reject constant out-of-range indexes.

## Functions and returns

The first analyzed call establishes one parameter signature. Return types are
inferred from reachable returns. If execution can reach the end of the function,
its fallthrough result is `absence`; a concrete return on one path and
fallthrough on another is rejected as an inconsistent return type.

Unconditional control transfer marks the remainder of the same block
unreachable. Branches transfer only when every branch transfers. Loops do not
guarantee execution, so they do not make following statements unreachable.

## Current limitations

- The analyzer file concentrates flow and type responsibilities; this is
  recorded technical debt.
- Collection types are encoded strings rather than a dedicated algebra.
- No explicit public type syntax exists.
- No generic, overload, closure, capture, recursion, or first-class-function
  analysis is defined.
