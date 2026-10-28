# Architecture index

The implemented pipeline is:

```text
Kwechiri source
  -> lexer and located tokens
  -> parser and typed AST
  -> semantic analysis and resolved nodes
  -> JavaScript code generation
  -> injected Kwechiri runtime
  -> Node.js host or isolated browser worker
```

Multi-file compilation first resolves and validates the module graph, then
passes deterministic source through the compiler pipeline.

Current documents:

- [Milestone 1 architecture](milestone-1.md) — historical initial slice
- [Runtime architecture](runtime.md) — current runtime boundary
- [Browser playground architecture](browser-playground.md) — single-source
  browser compilation, worker isolation, runtime, and limits
- [Module graph architecture](modules.md) — canonical resolution, identity,
  caching, ordering, and cycles
- [Standard Library architecture](../standard-library/README.md) — reserved
  modules, pure APIs, signatures, and diagnostics
- [CLI architecture](cli.md) — command parsing, orchestration, output, and exits

Architecture documentation still needed:

- compiler overview
- lexer and token model
- parser and AST
- semantic analysis and type representation
- code generation
- diagnostics and source locations

These gaps do not authorize internal refactoring. Recorded architectural debt
is tracked in [technical debt](../roadmap/technical-debt.md).
