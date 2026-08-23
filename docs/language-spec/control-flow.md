# Control flow

Conditions use `ọ bụrụ` with an optional `ọzọ` branch. The condition must be a
boolean; Kwechiri has no implicit truthiness.

Logical expressions do not weaken this rule: numbers, strings, collections,
and `efu` are invalid conditions unless an explicit comparison produces a
Boolean.

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

`kwụsị` exits the nearest enclosing loop. `gaa n'ihu` continues at the next
iteration of the nearest enclosing loop. Both are valid only inside loops,
including conditions nested inside a loop, and neither targets an outer loop
when a nearer loop exists. `kwụsị` does not exit a function. `laghachi` remains
distinct: it exits the entire current function even from nested loops.

An unconditional `laghachi`, `kwụsị`, or `gaa n'ihu` makes following statements
in the same block unreachable, which is a semantic error. A transfer in only a
conditional path does not by itself make subsequent statements unreachable.

Control-flow blocks retain the flow-based binding model. Existing bindings stay
the same bindings. A same-type name introduced in both conditional branches may
be available afterward; one-branch and loop-created names are not. General
block shadowing is not supported.

**Deferred beyond 1.0** — `maka`, collection iteration syntax, infinite-loop
shorthand, labeled loop control, and general block-local shadowing.
