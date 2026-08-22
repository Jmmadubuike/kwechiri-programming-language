# ADR-011: Runtime boundary

## Context

Generated Kwechiri programs previously called `console.log` and embedded helper
functions directly. That coupled language behavior to JavaScript and prevented
runtime failures from consistently carrying Kwechiri source information.

## Options considered

1. Continue embedding JavaScript and Node behavior in generated programs.
2. Route language operations through an explicit Kwechiri runtime interface.
3. Build a complete standard library and host abstraction immediately.

## Decision

The project owner approved option 2. Generated programs receive a
`KwechiriRuntime` dependency. Output, division, checked indexing, collection
formatting, and runtime-error construction belong to that interface. The first
implementation targets Node.js, while compiler stages remain independent of
Node APIs.

## Consequences

Runtime failures now have stable categories and source locations, execution is
isolated, and another host can implement the interface later. Filesystem, HTTP,
database, clock, input, environment, and package APIs remain outside this
runtime milestone.
