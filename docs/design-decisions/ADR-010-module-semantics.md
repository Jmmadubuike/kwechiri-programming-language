# ADR-010: Module semantics

## Context

Milestone 8 introduces multi-file programs and therefore needs explicit Igbo
vocabulary, visibility, resolution, initialization, and cycle rules.

## Options considered

1. Adopt JavaScript module syntax and resolution.
2. Add a small Kwechiri named-module system.
3. Delay modules until package management exists.

## Decision

The project owner approved option 2. `webata` imports named bindings, `bupụ`
exports declarations, and `site na` identifies the source module. Only relative
`.kwe` files within the entry project directory are resolved. Imports are
read-only and must precede other statements. Modules initialize once in
dependency order, private names remain isolated, and cycles are errors.

## Consequences

The compiler now loads and validates a module graph before ordinary compilation.
Aliases, wildcard and dynamic imports, re-exports, packages, remote modules, and
cross-project paths remain future decisions.
