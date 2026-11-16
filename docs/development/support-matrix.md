# Supported environments

Status: Verified and published as 1.2.0
Evidence date: 2026-11-16

The compiler, website, and VS Code extension have separate environment
requirements. A successful build for one does not establish support for the
others.

## Compiler and CLI

The declared minimum is Node.js 20 or newer on a 64-bit operating system.

Direct Windows 11 Pro x64 evidence:

| Node.js | Unicode data reported by runtime | Compiler tests |
| --- | --- | --- |
| 20.20.2 | 17.0 | 215 passed |
| 22.23.4 | 17.0 | 215 passed |
| 24.19.0 | 17.0 | 215 passed |

Each run used the same test suite, including CLI process tests, module loading,
Unicode and astral identifiers, diagnostics, runtime checks, and source-file
UTF-8 failures.

CI run `43877679706` passed all nine compiler jobs for release commit
`7455da3`:

| Operating system | Node.js 20 | Node.js 22 | Node.js 24 |
| --- | --- | --- | --- |
| Ubuntu | Pass | Pass | Pass |
| Windows | Pass | Pass | Pass |
| macOS arm64 | Pass | Pass | Pass |

macOS arm64 is verified through GitHub's `macos-latest` runner. Intel macOS is
not separately verified or claimed.

The guaranteed Unicode identifier baseline is 15.0.0 under ADR-028. The
current tested Node.js patch releases expose Unicode 17.0, so the portable
baseline is intentionally lower than the tested host data.

## Website

The website declares Node.js 22.23.4 or newer. It produces a 25-page static
build, verifies 15 example snapshots, and passes its seven Playwright Chromium
and accessibility tests. The live site is verified serving version `1.2.0`.

The website host is Vercel. The Ubuntu Node.js 24 CI job passed the website
example checks, static build, Chromium accessibility suite, and VS Code
extension checks. Compiler support does not imply website build support below
its separate Node.js minimum.

## VS Code extension

The extension declares VS Code 1.100.0 or newer. Version `0.2.2` passed the
extension-host suite on Windows against VS Code 1.100.0, the Ubuntu Node.js 24
CI job, and macOS arm64 CI before publication through trusted publishing.

## Final support claims

The `1.2.0` release has passed the compiler suite on every claimed
operating system and Node.js major version. Intel macOS remains unverified.
The stable compiler release is published.
