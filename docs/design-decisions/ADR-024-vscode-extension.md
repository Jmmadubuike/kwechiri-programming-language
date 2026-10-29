# ADR-024: VS Code extension boundary

## Context

Milestone 13 needs editor registration, syntax highlighting, configuration,
diagnostics, and packaging. Reimplementing Kwechiri grammar or invoking an
arbitrary CLI would create drift and would make extension behavior depend on
shell configuration.

## Options considered

The milestone considered:

- static TextMate highlighting only;
- a VS Code extension that shells out to the CLI;
- a language server using Language Server Protocol;
- a bundled VS Code extension that imports the canonical compiler and lexer.

## Decision

Use a standalone extension package under `extensions/vscode/`. TextMate provides
fallback syntax coloring. A semantic-token provider uses the canonical lexer
for exact keyword, number, and string classification. A compile-only diagnostic
controller imports `compileFile` and bundles that implementation when the
extension is built.

The extension does not execute generated JavaScript. It does not provide a
formatter, completion, language-server transport, debugger, or marketplace
publication in this milestone.

## Consequences

Kwechiri keeps one authoritative lexer, parser, semantic analyzer, and module
loader. Extension builds snapshot that canonical source into a local bundle.
Unicode token identity and source locations follow existing compiler behavior.
Any future language-server, formatter, completion, or debugger work requires a
separate approved contract.
