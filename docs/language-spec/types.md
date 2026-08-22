# Values and types

Implemented primitive values are strings, JavaScript-compatible floating-point
numbers, booleans (`eziokwu` and `ụgha`), and the explicit absence value `efu`.
`efu` means absence or no value in Kwechiri; its backend representation is not
its language definition. Implemented collection values are homogeneous arrays
and objects with known property shapes.

Kwechiri does not perform implicit conversion for arithmetic or conditions.
Ordering requires numbers. Equality compares value and type for supported
primitive values. Collection equality is not defined.

Function parameter types are checked from actual calls against their use, and
return types are inferred for reachable functions.

Kwechiri has no implicit truthiness. Logical operators require Booleans.

**Status: Undecided** — explicit type annotations, advanced numeric types,
empty-array typing, collection equality, and a public type syntax.
