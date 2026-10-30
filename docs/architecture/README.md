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
- [Compiler overview](compiler-overview.md) — stages, boundaries, and output
- [Lexer and token model](lexer-and-tokens.md) — source scanning and tokens
- [Parser and AST](parser-and-ast.md) — grammar, precedence, and node shape
- [Semantic analysis](semantic-analysis.md) — symbols, flow, and types
- [Code generation](code-generation.md) — resolved nodes to JavaScript
- [Diagnostics and source locations](diagnostics.md) — failures and locations
- [Runtime architecture](runtime.md) — current runtime boundary
- [Browser playground architecture](browser-playground.md) — single-source
  browser compilation, worker isolation, runtime, and limits
- [Module graph architecture](modules.md) — canonical resolution, identity,
  caching, ordering, and cycles
- [Standard Library architecture](../standard-library/README.md) — reserved
  modules, pure APIs, signatures, and diagnostics
- [CLI architecture](cli.md) — command parsing, orchestration, output, and exits
- [VS Code extension architecture](vscode-extension.md) — registration,
  highlighting, canonical compiler bundling, and diagnostics

Recorded architectural debt is tracked in
[technical debt](../roadmap/technical-debt.md). Documentation of current
structure does not authorize internal refactoring.
