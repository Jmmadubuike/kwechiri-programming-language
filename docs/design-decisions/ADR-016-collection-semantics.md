# ADR-016: Collection semantics

## Context

Milestone 7 introduced immutable non-empty homogeneous arrays and fixed-shape
objects. Before the Standard Library, Kwechiri needs intentional rules for
array type identity, safe mutation, aliasing, module boundaries, invalid
access, equality, absence values, and display.

The previous internal array encoding included length in type identity. That
accidentally rejected coherent jagged arrays and treated arrays of the same
element type but different lengths as different types.

## Options considered

- Preserve length-based array identity or define array type only by element type
- Keep collections immutable or permit type-safe mutation
- Use reference semantics, implicit copying, or unspecified identity
- Add reference/deep equality or keep collection equality unsupported
- Return `efu` or report errors for missing and invalid access
- Treat imported collections as deeply immutable or preserve read-only bindings
  while allowing ordinary mutation of referenced values

## Decision

Arrays remain non-empty and homogeneous. Their semantic type is defined
recursively by element type; length is metadata for diagnostics and bounds
analysis, not part of type identity. Coherent jagged arrays are valid.

Existing array elements and fixed-shape object properties may be reassigned.
The target must exist, array indexes must be finite non-negative integers within
bounds, and the assigned value must exactly match the established element or
property type. Mutation cannot resize an array, add an object property, or make
another type implicitly accept `efu`.

Arrays and objects have reference semantics with no implicit copying during
assignment, calls, returns, imports, or exports. Imported bindings remain
read-only, but imported collection values are not transitively immutable.
Mutation through any alias is observable through all aliases.

Collection equality and inequality remain unsupported, including self
comparison. Missing properties and invalid indexes are errors rather than
`efu`. Negative and fractional indexes are invalid.

Duplicate object properties, including NFC-equivalent names, remain errors.
Unquoted properties follow ordinary reserved-word rules.

Collection output uses the compact Kwechiri collection display format. It uses
brackets and braces without optional whitespace, JSON-compatible string and
property-name quoting, construction-order properties, and recursive Kwechiri
spellings for Booleans and `efu`. This format is not JSON.

## Consequences

Arrays with the same recursive element type are compatible regardless of
length. Collection mutation is type-safe and bounds-checked, and reference
identity becomes observable and contractual. The runtime boundary gains a
checked index-mutation operation.

Typed empty construction, union and optional types, collection equality,
explicit copying, computed properties, resizing operations, collection
methods, and Standard Library terminology remain deferred.
