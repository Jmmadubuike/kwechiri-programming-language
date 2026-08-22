# Values and types

Implemented primitive values are strings, JavaScript-compatible floating-point
numbers, and booleans (`eziokwu` and `ụgha`). Implemented collection values are
homogeneous arrays and objects with known property shapes.

Kwechiri does not perform implicit conversion for arithmetic or conditions.
Ordering requires numbers. Equality compares value and type for supported
primitive values. Collection equality is not defined.

Function parameter types are checked from actual calls against their use, and
return types are inferred for reachable functions.

**Status: Undecided** — `efu`, explicit type annotations, advanced numeric
types, empty-array typing, collection equality, and a public type syntax.
