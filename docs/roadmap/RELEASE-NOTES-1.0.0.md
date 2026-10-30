# Kwechiri 1.0.0 release notes

Status: Stable release

Release date: 2026-10-31

Kwechiri 1.0 is the first stable release of the Igbo-first programming
language. It freezes the implemented language surface and establishes the
compatibility, diagnostic, Unicode, distribution, and support contracts.

## Install

```sh
npm install --global kwechiri@1.0.0
kwechiri hello.kwe
```

Expected output:

```text
Ndewo Ụwa!
```

The VS Code extension is published separately as
`kwechiri.kwechiri-language@0.2.0`.

## Language

- Strings, numbers, Booleans, and explicit `efu` absence.
- Mutable variables, arithmetic, comparisons, and Boolean logic.
- `ọ bụrụ`/`ọzọ`, `mgbe`, `kwụsị`, and `gaa n'ihu`.
- Named `ọrụ` functions and `laghachi`.
- Homogeneous arrays, typed objects, checked access, and reference identity.
- Named relative modules using `webata`, `bupụ`, and `site na`.
- The five `kwechiri:eriri` Standard Library functions.
- Unicode NFC identity, no ASCII aliases, and no implicit truthiness or
  coercion.

Recursion, closures, nested or first-class functions, `maka` iteration,
multiline strings, typed empty arrays, collection methods, import aliases,
packages, and host I/O remain outside 1.0.

## Tooling

- CLI commands `run`, `check`, and `compile`, with stable exit codes.
- Stable diagnostic codes and located diagnostics.
- UTF-16 source coordinates.
- Strict UTF-8 input validation.
- Unicode 15.0.0 portable identifier baseline.
- VS Code syntax highlighting, semantic tokens, and compile-only diagnostics.

## Supported environments

- Windows and Linux.
- Node.js 20, 22, and 24 for the compiler and CLI.
- Node.js 22.23.4 or newer for the website.
- VS Code 1.100.0 or newer for the extension.

macOS is not claimed for 1.0. See the
[support matrix](../development/support-matrix.md).

## Compatibility

[ADR-027](../design-decisions/ADR-027-1.0-compatibility-and-diagnostics.md)
defines semantic versioning, public contracts, deprecation, and diagnostic-code
stability.

## Known limitations

- Only five Standard Library string functions exist.
- No recursion, closures, first-class functions, or collection iteration.
- No formatter, completion, hover, rename, or debugging integration.
- No host filesystem, network, input, date/time, or production untrusted-code
  API in Kwechiri source.
- macOS is not verified or claimed.
