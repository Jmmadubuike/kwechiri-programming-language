# Supported environments

Status: Approved direction; release-candidate verification remains open
Evidence date: 2026-10-30

The compiler, website, and VS Code extension have separate environment
requirements. A successful build for one does not establish support for the
others.

## Compiler and CLI

The declared minimum is Node.js 20 or newer on a 64-bit operating system.

Direct Windows 11 Pro x64 evidence:

| Node.js | Unicode data reported by runtime | Compiler tests |
| --- | --- | --- |
| 20.20.2 | 17.0 | 199 passed |
| 22.23.4 | 17.0 | 199 passed |
| 24.19.0 | 17.0 | 199 passed |

Each run used the same test suite, including CLI process tests, module loading,
Unicode and astral identifiers, diagnostics, runtime checks, and source-file
UTF-8 failures.

Linux has historical Node.js 20 and 24 CI evidence from earlier closed
milestones. The quality workflow now defines Linux and Windows jobs for Node.js
20, 22, and 24. The Milestone 14 changes have not yet been verified by remote
CI because the current working tree is not committed and the GitHub CLI is not
authenticated in this session.

macOS is not claimed as supported. No direct or CI evidence exists for it.

The guaranteed Unicode identifier baseline is 15.0.0 under ADR-028. The
current tested Node.js patch releases expose Unicode 17.0, so the portable
baseline is intentionally lower than the tested host data.

## Website

The website declares Node.js 22.23.4 or newer. It produced a static build on
Windows with Node.js 24.19.0, and its seven Playwright Chromium tests passed.

The website host is Vercel. Compiler support does not imply website build
support below its separate Node.js minimum. A live release-candidate deployment
has not been verified for this milestone.

## VS Code extension

The extension declares VS Code 1.100.0 or newer. The extension-host suite
passed on Windows against VS Code 1.100.0 with Node.js 24.19.0 as the build
runtime.

Linux extension-host evidence exists from earlier closed milestones. The
milestone candidate still requires the release CI gate.

## Final support claims

Before a 1.0 release, the final candidate must either:

- pass the compiler suite on every claimed operating system and Node.js major
  version;
- or narrow the published support matrix so it does not claim unverified
  environments.

Publication remains blocked until the owner approves the verified matrix.
