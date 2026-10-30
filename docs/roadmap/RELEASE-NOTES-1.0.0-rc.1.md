# Kwechiri 1.0.0-rc.1 release notes

Status: Published to npm

Candidate date: 2026-10-30
Published commit: `a307675`

This release candidate freezes the Kwechiri 1.0 language surface and
establishes the compatibility, diagnostic, Unicode, packaging, and release
contracts. It is published as an npm prerelease and tagged in Git.

## Language

- Frozen syntax, keywords, operators, and semantics from the
  [1.0 language surface inventory](KWECHIRI-1.0-SURFACE-INVENTORY.md).
- Stable Unicode code-point identifier scanning, including astral letters.
- Unicode 15.0.0 as the guaranteed portable identifier baseline.
- NFC, case-sensitive name identity with no ASCII aliases.
- Valid UTF-8 source required; malformed byte sequences are rejected.
- The five `kwechiri:eriri` functions form the complete 1.0 Standard Library.

Recursion, closures, nested or first-class functions, `maka` iteration,
multiline strings, typed empty arrays, collection methods, import aliases,
packages, and host I/O remain outside 1.0.

## Diagnostics

- Stable public codes use `KWE-<CATEGORY>-<NNN>`.
- Located diagnostics include filename, line, column, code, and message.
- Source coordinates use UTF-16 code units.
- VS Code exposes the code separately through `Diagnostic.code`.
- The complete catalog is in the
  [diagnostic catalog](../language-spec/error-catalog.md).

Existing `0.x` consumers that match the entire diagnostic text will need to
account for the inserted code.

## Compatibility

[ADR-027](../design-decisions/ADR-027-1.0-compatibility-and-diagnostics.md)
defines semantic versioning, public contracts, deprecation, and diagnostic-code
stability. Generated JavaScript remains an internal compiler artifact rather
than a separately supported source contract.

## Supported environments

- Windows 11 x64: Node.js 20.20.2, 22.23.4, and 24.19.0 verified locally with
  the complete 199-test suite.
- Linux: Node.js 20, 22, and 24 jobs are defined; remote evidence is pending.
- macOS: not claimed.
- Website: Node.js 22.23.4 or newer; static build and Chromium tests passed on
  Windows.
- VS Code: version 1.100.0 or newer; extension-host tests passed locally.

See the [support matrix](../development/support-matrix.md) for the distinction
between verified, configured, and unclaimed environments.

## Verification

Local candidate evidence includes:

- canonical compiler gate with linting, strict type checking, 199 tests, and
  production build;
- complete suite under Node.js 20, 22, and 24 on Windows;
- 23-page website build and seven Chromium regression/accessibility tests;
- VS Code build, package, and extension-host checks;
- clean installation of the packed compiler artifact and binary execution;
- zero-vulnerability compiler, website, and extension dependency audits.

CI run `41124819384` passed on Ubuntu and Windows for Node.js 20, 22, and 24.
The Ubuntu Node.js 24 job also passed website, Chromium accessibility, and VS
Code extension checks.

npm authentication is verified as `jmmadubuike` with `auth-and-writes`
two-factor authentication enabled. The package is owned by that account.

## Distribution status

- Compiler package: [`kwechiri@1.0.0-rc.1`](https://www.npmjs.com/package/kwechiri/v/1.0.0-rc.1),
  published with public access.
- npm dist-tags: `latest` and `next` both point to `1.0.0-rc.1` because npm
  assigns both on the first publication of a package.
- Registry SHA-1: `4c4bd419c02355c13d849a4400a0d259f912d1d3`.
- VS Code extension: `0.2.0` is public in the Marketplace and installed from a
  clean profile.
- Website: candidate content is not deployed by this release-note change.
- Git tag: annotated `v1.0.0-rc.1` at `a307675`.

The compiler package publication was explicitly approved by the owner.

## Known limitations

- Only five Standard Library string functions exist.
- No recursion, closures, first-class functions, collection iteration, or
  advanced collection APIs.
- No formatter, completion, hover, rename, or debugging integration.
- No host filesystem, network, input, date/time, or production untrusted-code
  API in Kwechiri source.
- npm 2FA, package ownership, and publication approval remain pending.
