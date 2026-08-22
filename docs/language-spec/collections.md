# Collections

Arrays use `[...]`, are zero-indexed, non-empty, immutable, and homogeneous.
Known invalid indexes are compile-time errors; dynamic invalid indexes are
located runtime errors.

Objects use `{ key: value }`. Property names are unique Unicode identifiers and
are accessed with dot syntax. Missing properties are compile-time errors.
Nested coherent collections are supported.

Explicit `efu` values may be stored in arrays when the homogeneous element rule
is satisfied and in object properties. Missing properties and invalid indexes
remain errors; they do not evaluate to `efu`.

`bipụta` formats collections in a stable JSON-like form using Kwechiri
`eziokwu`, `ụgha`, and `efu` spellings for nested core values.

**Status: Undecided** — empty arrays, element/property mutation, collection
equality, computed properties, spread syntax, and collection methods.
