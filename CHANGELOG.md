# Changelog

All notable changes to Kwechiri are recorded here. Release dates and versions
are added only when the project owner approves a release.

## 1.2.0 - 2026-11-16

Adds multiline string literals while preserving the existing single-line
string, type, runtime, and module rules.

Published to npm as `latest` on 2026-11-16. Git tag: `v1.2.0`. VS Code
extension `0.2.2` was published to the Marketplace on 2026-11-16.

### Added

- `"""..."""` multiline string literals, including embedded physical line
  feeds and the five existing string escapes.
- Located lexical diagnostic `KWE-LEX-006` for unterminated multiline strings.
- VS Code extension `0.2.2` with the updated compiler bundle.

### Changed

- The module loader and browser single-source boundary ignore comment and
  import/export markers inside multiline strings.

## 1.1.0 - 2026-10-31

First post-1.0 Standard Library expansion.

Published to npm as `latest` on 2026-10-31. Git tag: `v1.1.0`.

### Added

- `wepuOghere` for Unicode-whitespace trimming.
- `okwuNta` and `okwuNnukwu` for locale-independent Unicode case mapping.
- `dochieEriri` for literal replacement of every exact occurrence.
- VS Code extension `0.2.1` with the expanded compiler catalog, published to
  the Marketplace on 2026-10-31.

## 1.0.0 - 2026-10-31

First stable Kwechiri release.

Published to npm as `latest` on 2026-10-31. Git tag: `v1.0.0`.

### Added

- Frozen Kwechiri 1.0 language surface and compatibility policy.
- Stable `KWE-<CATEGORY>-<NNN>` diagnostic codes.
- Strict UTF-8 source validation.
- Unicode code-point identifiers with the Unicode 15.0.0 portable baseline.
- Supported Windows and Linux matrix for Node.js 20, 22, and 24.
- Public `kwechiri` npm package and VS Code extension `0.2.0`.

### Changed

- npm `latest` now identifies the stable compiler release.

## 1.0.0-rc.1 - 2026-10-30

Published to npm on 2026-10-30. Because this was the package's first
publication, npm assigned both `latest` and `next` to this prerelease.

### Added

- Milestone 14 release contract and release procedure.
- Release-readiness decision register.
- Stable `KWE-<CATEGORY>-<NNN>` public diagnostic codes.
- Approved 1.0 compatibility and deprecation policy.
- Strict UTF-8 validation for Kwechiri source files.
- Unicode code-point identifier scanning, including astral letters.
- Approved Unicode 15.0.0 portable baseline.
- Windows Node.js 20, 22, and 24 compiler verification.
- Windows/Linux CI matrix for supported Node.js versions.
- Compiler package identity and release metadata.
- `1.0.0-rc.1` compiler and website candidate version metadata.

### Changed

- Located diagnostics now include a stable code between the source location and
  message.
- VS Code extension `0.2.0` adds the stable diagnostics and Unicode compiler
  updates. It is public in the Marketplace and verified by clean installation.

## 0.1.0-development - 2026-10-30

Current development baseline, not a published compiler release.

### Added

- Igbo-first Kwechiri language and TypeScript-to-JavaScript compiler.
- Unicode `.kwe` source, located diagnostics, variables, arithmetic,
  conditions, loops, functions, collections, and modules.
- Explicit Kwechiri runtime boundary with Node.js and browser implementations.
- `kwechiri:eriri` Standard Library functions from Batches 11A and 11B.
- Compatible and explicit CLI `run`, `check`, and `compile` commands.
- Local browser playground with isolated worker execution.
- Public Kwechiri VS Code extension with syntax highlighting and diagnostics.
