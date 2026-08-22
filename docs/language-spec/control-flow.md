# Control flow

Conditions use `ọ bụrụ` with an optional `ọzọ` branch. The condition must be a
boolean; Kwechiri has no implicit truthiness.

```kwe
ọ bụrụ (afọ >= 18) {
    bipụta("Okenye")
} ọzọ {
    bipụta("Nwatakịrị")
}
```

`mgbe` is a pre-condition loop and may execute zero times. Its condition must
be boolean. Existing loop-carried variables may be updated but must retain
their value type. Names first assigned in the body remain local to that body.

**Status: Undecided** — `maka`, `kwụsị`, `gaa n'ihu`, logical operators,
infinite-loop shorthand, and general block-local shadowing.
