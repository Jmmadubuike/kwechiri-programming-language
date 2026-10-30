# Diagnostics and source locations

Kwechiri preserves source context for failures in every compiler and runtime
layer. Current errors carry a message and, where available, a filename and
source location.

## Error classes

`KwechiriError` covers lexical, syntax, semantic, module, Standard Library, and
playground preparation failures. Its displayed message is:

```text
<filename>:<line>:<column>: <code>: <message>
```

The filename is omitted when it is unavailable. `KwechiriRuntimeError` adds a
runtime category and always carries a filename. Its current categories are
`DIVISION_BY_ZERO` and `INDEX_OUT_OF_RANGE`.

Both inherit from JavaScript `Error`, but their public message contract is the
formatted Kwechiri diagnostic, not an uncontrolled host stack trace.
Compile-time errors expose `KwechiriError.code`; runtime errors expose
`KwechiriRuntimeError.code` while retaining their runtime category.

## Source locations

Locations contain:

- one-based `line`;
- one-based `column`;
- zero-based `offset` into the current JavaScript string.

The lexer advances through UTF-16 code units. For Kwechiri 1.0, line, column,
and offset are defined as UTF-16 code-unit measurements. Identifier scanning
uses code points under
[ADR-028](../design-decisions/ADR-028-unicode-identifier-profile.md), but
diagnostics retain UTF-16 coordinate units.

## Layer ownership

| Layer | Typical diagnostics |
| --- | --- |
| Lexer | Unknown characters, malformed strings, bad escapes |
| Parser | Missing delimiters, invalid grammar forms, comparison chaining |
| Module preparation | Import order, path shape, missing modules or exports, cycles, read-only imports |
| Semantic analysis | Undefined names, type errors, invalid control placement, duplicate declarations, unreachable code |
| Standard Library | Unknown modules or exports, arity, static argument types |
| Runtime | Division by zero and dynamic invalid indexes |
| CLI | Usage, filesystem, entry, and internal failures |
| VS Code | Converts compiler diagnostics to editor locations without executing source |

Expected CLI language failures are reported without raw Node.js stack traces.
Unexpected internal failures are separately categorized.

## Presentation

Messages commonly include an Igbo statement and an English parenthetical
explanation. Coverage is not yet uniform. Public codes and their compatibility
rules are defined in the
[diagnostic catalog](../language-spec/error-catalog.md) and
[ADR-027](../design-decisions/ADR-027-1.0-compatibility-and-diagnostics.md).
Automatic suggestions remain unimplemented.
