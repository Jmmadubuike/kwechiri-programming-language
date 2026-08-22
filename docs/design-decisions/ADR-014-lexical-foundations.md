# ADR-014: Lexical foundations

## Context

Kwechiri needs comments and basic string escapes for practical source files,
and it needs a deliberate identity rule for canonically equivalent Unicode
spellings. The rule must support Igbo text without corrupting source locations,
diagnostics, string data, or filesystem paths.

## Options considered

- Single-line comments only, or single-line plus block comments
- A small fixed escape set, or a broader JavaScript-style escape system
- Raw spelling identity, whole-source normalization, or per-name NFC identity
- Case folding or ASCII keyword aliases

## Decision

`//` starts a comment outside strings and runs to LF or EOF. Comments emit no
tokens. `/` remains division in every other lexical context. Block and nested
comments are not supported.

Double-quoted strings recognize exactly `\n`, `\t`, `\r`, `\\`, and `\"`.
Unknown escapes are located lexical errors. Actual line feeds remain invalid
inside strings.

Keywords and program names use NFC identity. This includes variables,
functions, parameters, object-property identifiers, imports, and exports.
Tokens retain raw spelling and raw offsets; parsing and symbol resolution use
the canonical identity. Rewriters slice using raw offsets and lengths.

The source as a whole is not normalized. String contents, module path strings,
and filesystem paths are not normalized. Identity remains case-sensitive;
there is no case folding and no ASCII alias set.

## Consequences

Canonically equivalent names resolve consistently, including across modules,
while diagnostics and source transformations can still refer to the original
text. Users get a deliberately small, teachable escape system and line-comment
syntax without committing Kwechiri to block-comment or JavaScript escape
semantics.

The final identifier character profile, astral/code-point iteration, Unicode
version, strict UTF-8 policy, and stable coordinate units remain deferred for a
separate pre-1.0 decision.
