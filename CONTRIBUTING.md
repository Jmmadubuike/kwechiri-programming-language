# Contributing to Kwechiri

Kwechiri is an Igbo-first programming language. Contributions are welcome from
developers, Igbo language educators, researchers, technical writers, learners,
and users. This guide explains how to propose and submit work while preserving
the language contract and the project's approval process.

## Before you begin

Please read:

- [`AGENTS.md`](AGENTS.md);
- [`docs/README.md`](docs/README.md);
- [`docs/roadmap/PROJECT-STATUS.md`](docs/roadmap/PROJECT-STATUS.md);
- the current language specification, architecture document, or ADR relevant
  to your change;
- the [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).

Search existing issues and pull requests before opening a new one. For a
security vulnerability, follow [`SECURITY.md`](SECURITY.md) instead of opening a
public issue.

## Project authority and scope

The human project owner is the final authority for language identity, Igbo
terminology, syntax, semantics, public APIs, licensing, compatibility,
priorities, and releases.

Language changes are not accepted as unreviewed drive-by pull requests. A
proposed syntax, keyword, semantic, or Standard Library change requires:

1. a clear problem statement and proposed behaviour;
2. owner approval of the language design;
3. a documented decision, normally an ADR;
4. implementation and tests for the approved contract; and
5. updated specification, examples, and tutorials where applicable.

Do not add, remove, or rename syntax or keywords, or change established
behaviour, before that approval exists. Small documentation corrections,
regression tests, and implementation fixes that preserve the approved contract
can be proposed directly.

## Development setup

The compiler and tooling require Node.js 20 or newer. The website declares a
newer minimum in [`website/package.json`](website/package.json).

Install locked dependencies and run the canonical compiler gate:

```sh
npm ci
npm run check
```

The gate runs linting, strict source and test type checking, the test suite, and
a production build. Use the separate commands for the website and VS Code
extension when your change affects them:

```sh
npm ci --prefix website
npm run website:check

npm ci --prefix extensions/vscode
npm run vscode:check
```

The extension-host suite is separate and can be run with:

```sh
npm run vscode:test
```

Text files use UTF-8, LF line endings, and a final newline. Preserve Igbo
characters such as `ị`, `ọ`, and `ụ` in source, tests, examples, documentation,
and diagnostics.

## Tests and validation

Add tests for new behaviour and for confirmed regressions. Relevant coverage
includes valid programs, invalid input, edge cases, Unicode handling, source
locations, diagnostics, runtime failures, and module behaviour.

Do not report a build, test run, browser run, or provider check as successful
unless the command completed and produced an actual result. A build alone is
not proof that user-visible behaviour works.

Avoid unrelated fixes in the same pull request. If you find a separate defect,
open a focused issue or mention it to the maintainer.

## Pull requests

A pull request should:

- explain the problem and the smallest coherent solution;
- link the relevant issue or approved milestone;
- state whether language or public behaviour changes;
- identify the files and validation performed;
- include tests and documentation updates where required;
- avoid generated `dist/`, `node_modules/`, coverage, logs, and packaged VSIX
  artifacts;
- preserve existing Unicode, source locations, and diagnostic categories; and
- contain no credentials, private keys, personal data, or unlicensed
  third-party material.

The project owner reviews and approves changes. Passing automation does not
replace owner approval for language design, public APIs, licensing, or release
decisions.

## Licensing of contributions

Kwechiri is distributed under the MIT License. Unless a contribution is
explicitly marked otherwise, contributions are accepted under the same MIT
terms so the project can continue to distribute the combined work consistently.
Contributors retain copyright in their original contributions.

If your employer or another organisation owns work you want to contribute,
obtain permission before submitting it. Do not contribute code, images, fonts,
documentation, or other material unless you have the right to license it under
these terms.

## Community

Participation is governed by the [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).
Please be constructive, specific, and respectful, especially when discussing
Igbo terminology or beginner-facing design.
