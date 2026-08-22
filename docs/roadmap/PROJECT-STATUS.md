# Kwechiri project status and remaining roadmap

Last updated: 2026-08-23
Current version: `0.1.0-development`  
Current implemented milestone: Milestone 10 — Professional CLI

Certification state: Milestone 10 certified and closed at
`60944dc77b7a5529a217c4474e56ecd3bb8150ef`; Lexical Foundations certified and
closed at `f248fe0f9c6b561d8c2e73a317aee3c103f24512`.

Current post-milestone work: Core Values & Logic implemented locally and
awaiting owner review and certification.

Next roadmap milestone: Milestone 11 — Standard library (not begun or authorized)

## Purpose

This document is the operational starting point for future Kwechiri development
sessions. Before implementing new roadmap work, read `AGENTS.md`, this file,
the relevant milestone specification, and the applicable ADRs.

The project must continue one approved and verified milestone at a time. The
project owner remains the final authority for language terminology, syntax,
semantics, public interfaces, licensing, and releases.

## Current verified capabilities

Kwechiri currently supports:

- UTF-8 `.kwe` source files and Igbo Unicode identifiers
- `bipụta` output
- strings, numbers, booleans, and explicit `efu` absence
- Kwechiri-facing Boolean and absence printing
- Boolean-only `na`, `maọbụ`, and `ọ bụghị` with short-circuit evaluation
- mutable program variables
- arithmetic, precedence, grouping, and unary minus
- strict comparisons and boolean conditions
- `ọ bụrụ` and optional `ọzọ`
- `mgbe` loops
- `ọrụ` functions, parameters, calls, and `laghachi`
- homogeneous arrays and typed objects
- checked array indexing and object property access
- named multi-file modules using `webata`, `bupụ`, and `site na`
- an explicit Kwechiri runtime boundary with a Node.js implementation
- located compile-time and runtime diagnostics
- the compatible command `kwechiri <file.kwe>`
- explicit `run`, execution-free `check`, and directly runnable `compile`
- stable CLI stdout/stderr and exit-code contracts

At the end of Milestone 9, the complete local gate passed with 55 automated
tests, TypeScript type checking, build validation, CLI success probes, and
located runtime-error probes.

Before Milestone 10, repository stabilization established concise governance,
documentation indexes, a consolidated current specification, foundational
ADRs, linting, strict source/test type checking, explicit Vitest configuration,
EditorConfig, and Node 20/24 GitHub Actions CI. The local canonical gate passes.
The new CI workflow is not confirmed remotely until its first GitHub run.

## Completed milestones

### Milestone 0 — Foundation

Completed:

- Git, npm, TypeScript, and Vitest foundation
- layered compiler structure
- README and initial documentation

### Milestone 1 — Hello World

Completed and documented in `docs/language-spec/milestone-1.md`:

```kwe
bipụta("Ndewo Ụwa!")
```

### Milestone 2 — Variables

Completed and governed by ADR-004:

- first assignment creates a mutable variable
- later assignment updates it
- undefined reads are compile-time errors

### Milestone 3 — Arithmetic expressions

Completed and governed by ADR-005:

- `+`, `-`, `*`, and `/`
- precedence, grouping, and unary minus
- number-only arithmetic
- checked division by zero

### Milestone 4 — Conditions

Completed and governed by ADR-006:

- `eziokwu` and `ụgha`
- comparisons
- strict boolean conditions
- `ọ bụrụ` and `ọzọ`
- flow-aware branch assignment

### Milestone 5 — Loops

Completed and governed by ADR-007:

- pre-condition `mgbe` loops
- boolean conditions
- loop-carried type stability
- loop-local first assignments

### Milestone 6 — Functions

Completed and governed by ADR-008:

- `ọrụ` declarations
- parameters and calls
- `laghachi`
- local-only scope and guaranteed returns
- no recursion, closures, defaults, or nested functions yet

### Milestone 7 — Collections

Completed and governed by ADR-009:

- homogeneous non-empty arrays
- zero-based checked indexing
- typed objects and Unicode properties
- immutable collection access
- stable JSON-like printing

### Milestone 8 — Modules

Completed and governed by ADR-010:

- named imports and exports
- relative `.kwe` resolution
- private namespacing
- read-only imports
- dependency ordering and cycle detection

### Milestone 9 — Runtime boundary

Completed and governed by ADR-011:

- injectable `KwechiriRuntime`
- initial `NodeKwechiriRuntime`
- runtime-owned output, formatting, division, and indexing
- categorized and located runtime errors
- isolated program execution

## Latest completed milestone

### Milestone 10 — Professional CLI

Status: certified, committed, pushed, and closed at
`60944dc77b7a5529a217c4474e56ecd3bb8150ef`.

Implemented commands:

```text
kwechiri hello.kwe
kwechiri run hello.kwe
kwechiri check hello.kwe
kwechiri compile hello.kwe
kwechiri compile hello.kwe --out build/hello.js --force
kwechiri --version
kwechiri --help
```

Implemented contract:

- preserve `kwechiri <file.kwe>` as the shorthand for `run`
- `run` compiles and executes
- `check` validates the complete module graph without executing
- `compile` writes JavaScript without executing
- default `compile` output to a sibling `.js` file
- permit one explicit lowercase `.js` output through `--out`
- emit directly runnable Node.js with an existing-runtime bootstrap
- require `--force` before overwriting an existing output file
- send program output to stdout and diagnostics to stderr
- use exit code `0` for success
- use exit code `1` for Kwechiri source, semantic, module, or runtime errors
- use exit code `2` for invalid CLI usage
- use exit code `3` for filesystem or host failures
- use exit code `4` for unexpected internal failures
- reject unknown commands and unsupported options
- do not add watch mode, a REPL, telemetry, networking, or interactive prompts

Certification validation:

- tests for every command
- tests for every exit-code category
- direct compatibility probe for `kwechiri hello.kwe`
- output overwrite protection tests
- module-graph checks through `run`, `check`, and `compile`

Milestone 11 has not begun and requires a separate approved contract.

The Milestone 10 local implementation gate passes with 67 automated tests,
linting, strict source/test type checking, a production build, and direct
`run`/`check`/`compile` plus generated-artifact probes on Node.js 20 and 24.

## Remaining roadmap milestones

### Milestone 11 — Standard library

Not designed or approved.

Required decisions include:

- first standard-library scope
- canonical Igbo names
- string, number, boolean, collection, and utility operations
- pure versus runtime-backed APIs
- error behavior and documentation structure

Do not add standard-library functions until their terminology and semantics are
approved.

### Milestone 12 — Browser playground

Not designed or approved.

Expected work includes:

- browser-compatible compiler and runtime boundary
- safe execution isolation
- editor, output, errors, and example programs
- responsive mobile and desktop interface
- no server or framework choice without approval

### Milestone 13 — VS Code support

Not designed or approved.

Expected work includes:

- `.kwe` language registration
- syntax highlighting
- brackets and comments configuration
- diagnostics integration
- formatting and completion decisions
- extension packaging and verification

### Milestone 14 — Kwechiri 1.0

Not ready.

Required release work includes:

- stable language specification
- final keyword and Igbo terminology review
- backward-compatibility policy
- complete error catalog
- tutorials and reference documentation
- supported Node.js and operating-system matrix
- package naming and publication decision
- licensing decision
- release checklist and explicit owner approval

## Cross-cutting work still unresolved

These items are not authorized merely because they appear here. Each requires
the appropriate owner decision and milestone placement.

### Language design

- multiline strings
- `kwụsị`, `gaa n'ihu`, and `maka`
- empty arrays
- collection equality and mutation
- computed properties, spread syntax, and collection methods
- recursion, closures, default parameters, and anonymous functions
- module aliases, re-exports, wildcard imports, packages, and remote modules

### Engineering and operations

- choose and add a license
- add formal tutorials beyond the executable examples
- add remaining architecture topic documents
- add cross-platform verification beyond Linux CI
- finalize the supported Node.js policy beyond the current `>=20` declaration
- audit bilingual diagnostic consistency
- decide npm publication and package ownership
- define release and changelog procedures

The npm package remains technically publishable. No publication safeguard was
added because choosing whether the package should be private is a public-package
policy decision requiring owner approval. Do not publish while licensing and
publication policy remain undecided.

## Session-start checklist

Every future development session should:

1. Read `AGENTS.md` and this document.
2. Run `git status` and preserve unrelated work.
3. Confirm the current completed milestone from Git and the relevant docs.
4. Verify that the next milestone contract has explicit owner approval.
5. Read its applicable specification and ADRs.
6. Implement only that milestone.
7. Add positive, negative, Unicode, location, and regression tests.
8. Run `npm run check` and direct CLI probes appropriate to the change.
9. Report implementation, tests, changed files, limitations, and the next gate.
10. Commit only after owner approval.

## Exact resume point

The approved Core Values & Logic implementation is awaiting owner review and a
separate final certification. Do not begin the next design packet or the
standard library until each receives its own approved contract.
