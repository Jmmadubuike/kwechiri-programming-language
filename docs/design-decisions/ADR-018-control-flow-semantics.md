# ADR-018: Pre-1.0 control-flow semantics

## Context

ADR-007 established `mgbe` as a strict Boolean pre-condition loop with
flow-based binding rules. Before the module-hardening phase and Standard
Library, Kwechiri needs explicit nearest-loop exit and continuation behavior,
including their interaction with functions, reachability, Unicode vocabulary,
and nested loops.

## Options considered

- leave loops without explicit early control;
- add nearest-loop break and continue while preserving `mgbe` and existing
  binding flow;
- add `maka`, labeled control, or a new lexical block-scope model at the same
  time.

## Decision

Add `kwụsị` and the multiword statement `gaa n'ihu`.

`kwụsị` exits the nearest enclosing loop. `gaa n'ihu` begins the next iteration
of the nearest enclosing loop. Each is valid only within a loop, including in a
condition nested within that loop, and produces a controlled located diagnostic
outside loops. Neither statement is labeled. `kwụsị` does not exit a function;
`laghachi` continues to exit the entire function from any nested control flow.

An unconditional `laghachi`, `kwụsị`, or `gaa n'ihu` makes later statements in
the same block unreachable and therefore invalid. A transfer confined to a
conditional path does not make following code unreachable unless every branch
unconditionally transfers control.

Existing `mgbe` behavior and strict Boolean conditions remain unchanged.
Existing bindings remain the same bindings through branches and loops. New
same-type bindings from both conditional branches may flow outward; names from
only one branch or first introduced in a loop do not. No general block
shadowing is added.

`kwụsị`, `gaa`, and the contextual apostrophe-bearing component `n'ihu` become
reserved, case-sensitive vocabulary with the established NFC identity rules.
No ASCII aliases are added. `maka` is not implemented or newly reserved.

## Consequences

Nested loops have deterministic nearest-loop control, and unreachable code
after an unconditional transfer is diagnosed before JavaScript execution. The
backend may use native `break` and `continue`, but those constructs do not
define the Kwechiri contract.

Programs that previously used the new reserved vocabulary as names may no
longer parse as assignments. Statements following unconditional break or
continue now fail rather than being silently accepted.

`maka`, collection iteration syntax, labeled control, switch or matching,
exceptions, general block shadowing, and all module or Standard Library work
remain deferred.
