# ADR-002: Kwechiri source extension

## Context

Kwechiri source files require a stable extension for the CLI, tooling, modules,
editors, and documentation.

## Options considered

The founding charter established `.kwe` before implementation. Alternatives
were not reconsidered during stabilization.

## Decision

Kwechiri source files use the `.kwe` extension.

## Consequences

The compiler, module resolver, examples, and future editor tooling recognize
`.kwe`. Changing it requires explicit owner approval and compatibility planning.
