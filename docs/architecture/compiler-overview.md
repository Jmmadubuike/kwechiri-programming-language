# Compiler overview

The compiler is a host-neutral TypeScript pipeline. Runtime and platform
concerns enter through explicit boundaries rather than direct Node.js calls in
the compiler stages.

## Single-source pipeline

```text
source text
  -> tokenize(source)
  -> parse(tokens)
  -> analyze(program)
  -> generateJavaScript(resolvedProgram)
  -> JavaScript source text
```

`compile()` implements this path for a source string. Compilation does not
execute the result and does not write a file. The CLI owns execution and output
decisions.

The compiler is synchronous for a prepared source string. Lexical, syntax, and
semantic failures are thrown as `KwechiriError` values with source locations.

## File and module compilation

`compileFile()` has one asynchronous preprocessing step:

```text
entry .kwe path
  -> canonical module graph loading
  -> deterministic dependency-first source
  -> compileWithStandardBindings()
```

The module loader resolves paths, rejects invalid graphs, strips Kwechiri import
and export directives, assigns internal module namespaces, and supplies the
Standard Library bindings used by semantic analysis. See
[module graph architecture](modules.md).

## Browser single-source compilation

The playground uses a separate single-source preparation step. It accepts only
`kwechiri:` imports, validates imported names against the catalog, rewrites
them to internal bindings, and then calls the same compiler pipeline.
Filesystem imports are rejected before compilation. See
[browser playground architecture](browser-playground.md).

## Executable output

Generated JavaScript expects two injected values:

- `_kweRuntime`, implementing output, division, and checked index operations;
- `_kweStandardLibrary`, implementing approved Standard Library intrinsics.

`executeJavaScript()` wraps generated source in an isolated function and
provides those dependencies. Node.js uses `NodeKwechiriRuntime`; the browser
worker supplies an implementation with the same contract. See
[runtime architecture](runtime.md).

## Ownership boundaries

| Layer | Owns | Does not own |
| --- | --- | --- |
| Lexer | Token spelling, lexical validation, source locations | Parsing or name meaning |
| Parser | AST shape, grammar, operator precedence | Type rules or runtime checks |
| Semantic analysis | Names, scopes, types, call signatures, resolved nodes | Text output or host I/O |
| Code generation | JavaScript text from resolved nodes | Program execution or file writes |
| Runtime | Output, checked division and indexing | Parsing, typing, or module resolution |
| CLI | Commands, streams, exits, filesystem actions | Language semantics |
| Module loader | Graph identity and source namespace preparation | Semantic typing of program names |
| VS Code extension | Compiler invocation, conversion to editor diagnostics | Execution or separate language rules |

## Current limitations

- Generated JavaScript has no source map or bundled runtime.
- Compiled CLI artifacts require the Kwechiri installation that produced them.
- The parser and semantic analyzer are concentrated in single files; this is
  recorded technical debt and not an invitation for unrelated restructuring.
- Source offsets are UTF-16 code units for 1.0 while identifier scanning uses
  Unicode code points under
  [ADR-028](../design-decisions/ADR-028-unicode-identifier-profile.md).
