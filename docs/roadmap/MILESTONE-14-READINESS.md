# Milestone 14 release-readiness record

Status: Kwechiri 1.0.0 published and tagged

Evidence date: 2026-10-30

This record distinguishes verified local evidence from external release work.
It does not approve a version, compatibility policy, package publication, or
release.

## Baseline

| Item | Value |
| --- | --- |
| Foundation commit | `af28cd686f2fface9b43389cf922e7007307b26d` |
| Published commit | `d5f92d31b1bba1f63a81de0ac35b2e9b78271ded` |
| Release tag | annotated `v1.0.0` |
| Working tree | clean after publication update |
| Version | `1.0.0`, stable |
| Operating system | Windows 11 Pro x64 |
| Node.js | `v24.19.0` |
| npm | `11.17.0` |

The evidence below applies to the published `1.0.0` stable release.

## Verified locally

### Compiler

Command:

```text
npm run check
```

Result: exit code `0`.

- lint passed;
- strict source and test type checking passed;
- 15 test files passed;
- 199 tests passed;
- production compiler build passed.

The complete 199-test suite also passed under Node.js `20.20.2` and
`22.23.4` on Windows. Detailed support evidence is in the
[support matrix](../development/support-matrix.md).

### Website

Command:

```text
npm run website:check
```

Result: exit code `0`.

- 13 website example snapshots matched repository examples;
- production security headers and canonical redirect checks passed;
- Astro checked 41 files with zero errors, warnings, or hints;
- 23 static pages built successfully;
- sitemap generation completed.

Command:

```text
npm run website:e2e
```

Result: exit code `0`.

- all 7 Chromium playground tests passed;
- automated WCAG A/AA checks passed;
- narrow-viewport overflow checks passed;
- source/output/timeout controls and diagnostics passed.

### VS Code extension

Command:

```text
npm run vscode:check
```

Result: exit code `0`.

- extension type checking passed;
- bundled extension built;
- manifest, grammar, language configuration, and bundle verification passed;
- `kwechiri-language-0.2.0.vsix` was packaged locally.

Command:

```text
npm run vscode:test
```

Result: exit code `0` against the cached VS Code `1.100.0` runtime.

- activation and `.kwe` segmentation passed;
- located compiler diagnostics and correction clearing passed;
- semantic tokens passed;
- explicit check command passed;
- missing-module diagnostic passed.

One earlier run launched concurrently with the browser suite and package
installation timed out waiting for the extension host; it was not counted as
success. The suite passed when repeated alone.

The `0.2.0` VSIX installed successfully into an isolated VS Code 1.133.0
profile and was listed as `kwechiri.kwechiri-language@0.2.0`.
The trusted publishing run succeeded, the public Marketplace feed advanced to
`0.2.0`, and an exact-version install from Marketplace succeeded.

### Dependencies

The compiler, website, and extension audits each reported:

```text
found 0 vulnerabilities
```

### Diagnostics

Targeted diagnostic tests passed:

- stable code uniqueness, format, documentation, and source usage;
- located compiler and runtime message format;
- CLI usage, language, filesystem, and internal code routing;
- VS Code problem conversion with separate diagnostic codes;
- malformed UTF-8 rejection for both entry and imported source files.
- astral identifiers through lexing, compilation, and module import/export;
- stable diagnostic codes exposed separately by the VS Code extension.

The implementation uses `KWE-<CATEGORY>-<NNN>` codes and the compatibility
rules approved in
[ADR-027](../design-decisions/ADR-027-1.0-compatibility-and-diagnostics.md).

### Compiler package

`npm pack --dry-run --json` succeeded for the published package. It contained
74 entries, including `LICENSE`, `README.md`,
`CHANGELOG.md`, package metadata, and the complete `dist/` compiler output.

A packed `kwechiri-1.0.0.tgz` was installed in a clean temporary
consumer directory. Installation exited `0`, the installed `kwechiri` binary
reported version `1.0.0`, ran a copied `hello.kwe`, and produced
`Ndewo Ụwa!`.

Published package identity:

| Item | Value |
| --- | --- |
| Filename | `kwechiri-1.0.0.tgz` |
| Entries | 74 |
| Packed size | 224,490 bytes |
| Registry SHA-1 | `00e77881804fecac76217ad2a35f02e4b5e4d07d` |
| Integrity | `sha512-WzEJdoFxSthEi5Ht8rHWVX901ZPls2FOa6p1ourDLFd8a42ak0hpqpyigrhH610AU7NDXThpH8CUbcSmAMa36A==` |

A public registry install of `kwechiri@1.0.0` succeeded, reported the
correct version, and ran `hello.kwe` successfully.

### CLI

Direct probes from a temporary directory all exited `0`:

- `run hello.kwe`;
- `check hello.kwe`;
- `compile hello.kwe --out hello.js`;
- `node hello.js`.

### Documentation

All local Markdown-link targets in the repository resolved during a read-only
link audit.

## Not yet verified

- macOS, which is not currently claimed;
- a live website deployment verification for 1.0.0.

## CI history

Run `41099721451` for `0bc3b1d` completed with Linux success and Windows
failure. The Linux Node.js 20, 22, and 24 jobs passed, including the website,
Chromium, and VS Code extension checks. All three Windows compiler jobs failed
on two test portability defects:

- the license test expected LF after Git checked out `LICENSE` with CRLF;
- the malformed-UTF-8 test compared a short Windows temp path with the loader's
  canonical long path.

Commit `a0b474d` normalizes the license line endings and compares against
canonical paths. The complete 199-test suite passes locally after the fix. Run
`41101489627` for the fix commit was queued but did not start because GitHub
Actions reported degraded performance.

Run `41124819384` for candidate commit `7035d6e` completed with all six jobs
successful:

- Node.js 20, 22, and 24 on Ubuntu;
- Node.js 20, 22, and 24 on Windows;
- Ubuntu Node.js 24 additionally passed website build, Chromium accessibility,
  VS Code extension packaging, and extension-host tests.

Run `41128115799` for the published commit `a307675` also passed all six jobs.
Marketplace trusted-publishing run `41135011283` passed for VS Code extension
`0.2.0`; the public gallery and a clean exact-version installation were then
verified.

## Remaining release blockers

1. Complete a live website deployment verification for 1.0.0.

## Evidence rule

This record covers the published release candidate. It must not be used to
claim that stable Kwechiri 1.0, a new Marketplace release, or a live website
deployment has occurred.
