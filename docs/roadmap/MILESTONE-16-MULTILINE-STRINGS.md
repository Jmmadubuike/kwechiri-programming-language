# Milestone 16 - Multiline strings

Status: Implemented locally; awaiting owner review and release decision

Last updated: 2026-11-13
Owner approval: 2026-11-13

## Purpose

Add multiline string literals as a language-surface extension while preserving
the frozen 1.0 string, type, runtime, and module behaviour.

## Syntax

A multiline string is delimited by three double quotes (`"""`):

```kwe
mpempe = """ahịrị mbụ
ahịrị abụọ"""
bipụta(mpempe)
```

## Semantics

- Physical line feeds inside the delimiters are preserved in the value.
- The five single-line escapes (`\n`, `\t`, `\r`, `\\`, `\"`) decode the same
  way inside a multiline string.
- The string ends at the next unescaped `"""`; single and double quotes inside
  are literal content.
- An unterminated multiline string is lexical error `KWE-LEX-006`.
- Multiline strings are ordinary string values. The module loader and the
  browser single-source boundary ignore comment and import/export markers
  inside them so embedded examples cannot be misread.

## Validation

- Lexer, compiler, browser-boundary, and module-loader tests cover embedded
  quotes, escapes, comment markers, import/export-resembling content, and the
  unterminated-string diagnostic.
- The canonical local gate (`npm run check`) passes.
- A direct CLI probe confirmed multiline output.

## Known limitations

- A backslash immediately before a physical line feed is an unknown escape,
  consistent with single-line strings.
- No new website example file was added in this contract; website examples
  remain unchanged.

## Language behaviour changes

- New syntax: `"""..."""` multiline string literals.
- New lexical diagnostic: `KWE-LEX-006`.
