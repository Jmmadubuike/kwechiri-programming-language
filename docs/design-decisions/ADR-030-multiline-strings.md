# ADR-030: Multiline strings

## Context

Kwechiri 1.0 strings use double quotes and cannot contain a physical line feed.
Long text, formatted examples, or generated markup therefore require awkward
concatenation or escaped newlines. A dedicated multiline form is needed for
beginner-friendly text while preserving the existing single-line string rules.

## Decision

A multiline string is delimited by three double quotes (`"""`).

- The opening and closing delimiters are exactly `"""`.
- The decoded value may contain physical line feeds, preserved as-is.
- The five existing escapes (`\n`, `\t`, `\r`, `\\`, `\"`) remain valid inside
  a multiline string and decode exactly as in single-line strings.
- A literal line feed is written directly; a backslash followed by a physical
  line feed remains an unknown escape.
- The string ends at the next unescaped `"""`; single and double quote
  characters inside are literal content.
- An unterminated multiline string is a located lexical error (`KWE-LEX-006`).
- String contents are never normalized, matching single-line strings.
- Multiline strings are ordinary string values everywhere a string is allowed.

The existing single-line string grammar is unchanged. `""` remains the empty
single-line string; `""""""` is an empty multiline string.

## Consequences

Multiline strings make long text and embedded markup readable without changing
the type system, runtime, parser, or code generator. The module loader and the
browser single-source boundary must ignore `//` comments and import/export
markers inside multiline strings so embedded examples cannot be misread. Line
and column coordinates continue to use UTF-16 code units and advance across
line feeds as before. Lexical error `KWE-LEX-006` is added to the stable
catalog.
