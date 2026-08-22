# Milestone 4: Conditions

## Status

Approved development specification for Kwechiri 0.1.0.

## Boolean values and comparisons

The boolean literals are `eziokwu` and `ụgha`. Equality operators are `==` and
`!=`; ordering operators are `<`, `<=`, `>`, and `>=`. Ordering accepts numbers
only, while equality compares both value and type.

## Conditional syntax

```kwe
afọ = 36
ọ bụrụ (afọ >= 18) {
    bipụta("Okenye")
} ọzọ {
    bipụta("Nwatakịrị")
}
```

The `ọzọ` branch is optional. The condition must be boolean; numbers and
strings are not treated as truthy or falsy.

Variables created on every branch with the same type are available after the
condition. A variable created on only one branch is not available afterward.
Block scope, shadowing, logical operators, and chained comparisons are not part
of this milestone.
