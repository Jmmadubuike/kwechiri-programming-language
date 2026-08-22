# Milestone 7: Collections

## Status

Approved development specification for Kwechiri 0.1.0.

## Arrays

```kwe
ahaNdị = ["Uche", "Ada", "Obi"]
bipụta(ahaNdị[0])
```

Arrays are zero-indexed, non-empty, immutable, and contain one coherent value
type. A known invalid index is a compile-time error; a dynamic invalid index is
a Kwechiri runtime error.

## Objects

```kwe
mmadụ = { aha: "Uche", afọ: 36 }
bipụta(mmadụ.aha)
```

Object properties are unique Unicode identifiers and use dot access. Missing
properties are compile-time errors. Nested arrays and objects are supported.

Printing a collection uses stable JSON-like formatting. Collection equality,
empty arrays, mutation, computed properties, spread syntax, and collection
methods are outside this milestone.
