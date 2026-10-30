# Milestone 14 release-readiness record

Status: Local baseline recorded; Kwechiri 1.0 not ready

Evidence date: 2026-10-30

This record distinguishes verified local evidence from external release work.
It does not approve a version, compatibility policy, package publication, or
release.

## Baseline

| Item | Value |
| --- | --- |
| Foundation commit | `af28cd686f2fface9b43389cf922e7007307b26d` |
| Candidate commit | `7035d6e42ad7b1fa977f278d4ceb75db9db9dfdc` |
| Working tree | clean after CI verification update |
| Version | `1.0.0-rc.1`, candidate |
| Operating system | Windows 11 Pro x64 |
| Node.js | `v24.19.0` |
| npm | `11.17.0` |

The evidence below applies to the `1.0.0-rc.1` candidate. The final release, if
different, must be validated independently.

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
- `kwechiri-language-0.1.3.vsix` was packaged locally.

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

The generated VSIX was not reinstalled into a separate VS Code installation as
part of this evidence run.

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

`npm pack --dry-run --json` succeeded under the private development package.
The candidate contained 74 entries, including `LICENSE`, `README.md`,
`CHANGELOG.md`, package metadata, and the complete `dist/` compiler output.

A packed `kwechiri-1.0.0-rc.1.tgz` was installed in a clean temporary
consumer directory. Installation exited `0`, the installed `kwechiri` binary
reported version `1.0.0-rc.1`, ran a copied `hello.kwe`, and produced
`Ndewo Ụwa!`.

Candidate package identity:

| Item | Value |
| --- | --- |
| Filename | `kwechiri-1.0.0-rc.1.tgz` |
| Entries | 74 |
| Packed size | 224,253 bytes |
| SHA-1 | `abe83038230233a81ab0e86a04b254849cae18ff` |

No package was published and no workspace tarball was retained.

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
- installation of the generated VSIX into a separate editor installation;
- a live website deployment for the release candidate;
- provider publication or post-publication installation;
- npm 2FA, ownership, access, and publication;
- checksums or immutable artifact storage for the final release;
- final tag and explicit publication GO.

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

## Remaining release blockers

1. Enable npm two-factor authentication.
2. Confirm npm ownership and package access for `kwechiri`.
3. Obtain explicit approval for each publication target and verify the result.

## Evidence rule

This record is local platform evidence, not a release. It must not be used to
claim that Kwechiri 1.0, npm publication, Marketplace publication, or a live
website release has occurred.
