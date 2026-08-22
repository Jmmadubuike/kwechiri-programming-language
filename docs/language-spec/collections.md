# Collections

Arrays use `[...]`, are zero-indexed, non-empty, immutable, and homogeneous.
Known invalid indexes are compile-time errors; dynamic invalid indexes are
located runtime errors.

Objects use `{ key: value }`. Property names are unique Unicode identifiers and
are accessed with dot syntax. Missing properties are compile-time errors.
Nested coherent collections are supported.

`bipụta` formats collections in a stable JSON-like form.

**Status: Undecided** — empty arrays, element/property mutation, collection
equality, computed properties, spread syntax, and collection methods.
