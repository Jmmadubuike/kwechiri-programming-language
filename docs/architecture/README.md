# Architecture index

The implemented pipeline is:

```text
Kwechiri source
  -> lexer and located tokens
  -> parser and typed AST
  -> semantic analysis and resolved nodes
  -> JavaScript code generation
  -> injected Kwechiri runtime
  -> Node.js host
```

Multi-file compilation first resolves and validates the module graph, then
passes deterministic source through the compiler pipeline.

Current documents:

- [Milestone 1 architecture](milestone-1.md) — historical initial slice
- [Runtime architecture](runtime.md) — current runtime boundary
- [CLI architecture](cli.md) — command parsing, orchestration, output, and exits

Architecture documentation still needed:

- compiler overview
- lexer and token model
- parser and AST
- semantic analysis and type representation
- code generation
- module graph loading
- diagnostics and source locations

These gaps do not authorize internal refactoring. Recorded architectural debt
is tracked in [technical debt](../roadmap/technical-debt.md).
