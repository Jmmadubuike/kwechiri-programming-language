# Kwechiri 1.2.0 release notes

Status: Released 2026-11-16

Kwechiri 1.2.0 adds multiline string literals. It is a minor release under the
compatibility policy because the existing language surface and single-line
string behaviour are preserved.

## Added

Multiline strings are delimited by three double quotes:

```kwe
mpempe = """ahịrị mbụ
ahịrị abụọ"""
bipụta(mpempe)
```

Physical line feeds are preserved in the value. The five existing escapes
(`\n`, `\t`, `\r`, `\\`, and `\"`) decode exactly as in single-line strings.
An unterminated multiline string produces located lexical error `KWE-LEX-006`.

The module loader and browser single-source boundary ignore comment and
import/export markers inside multiline strings, so embedded examples cannot be
misread as module directives.

## Compatibility

- Existing single-line strings, including `""` as the empty string, are
  unchanged.
- Multiline strings are ordinary string values.
- No type-system, runtime, or module API change is required.
- `KWE-LEX-006` is added to the stable diagnostic catalog.

## Known limitations

- A backslash immediately before a physical line feed remains an unknown
  escape, consistent with single-line strings.
- The feature is not a general template or interpolation syntax.

## Verification

- Canonical compiler gate: 215 tests passed, including lexer, compiler,
  browser-boundary, and module-loader coverage; linting, strict source and test
  type checking, and the production build passed.
- Website: 25 pages built; 15 example snapshots verified; all seven Chromium
  and accessibility tests passed.
- VS Code extension: `0.2.2` type-checked, bundled, verified, packaged, and
  extension-host tested.
- npm: `kwechiri@1.2.0` published as `latest`; registry SHA-1
  `144143939efe69e413b9cf23e95b4cadc5d7a30b`; clean registry installation
  reproduced the multiline example output.
- GitHub: tagged `v1.2.0` at
  `7455da3aa770a3ad2ffb8aac5e9c636e1597b919`; GitHub release published.
- Marketplace: `kwechiri.kwechiri-language v0.2.2` published through trusted
  publishing.
