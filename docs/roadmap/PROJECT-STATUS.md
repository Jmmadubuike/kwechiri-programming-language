# Kwechiri project status and remaining roadmap

Last updated: 2026-10-30
Current version: `1.0.0-rc.1`, candidate; not published

Current completed milestone: Milestone 13 — VS Code support
Current VS Code release: `0.1.3`, public

Certification state: Milestone 10 certified and closed at
`60944dc77b7a5529a217c4474e56ecd3bb8150ef`; Lexical Foundations certified and
closed at `f248fe0f9c6b561d8c2e73a317aee3c103f24512`; Core Values & Logic certified
and closed at `4f57130e58f961684a2b76f8b6e605f5eb86d263`; Collections certified and
closed at `cf0ef1e831e4e938ecc4161506fffe528eb681fb`; Functions certified and closed
at `c27d353e7589cf541f0054958c33f72c4803389b`; Control Flow certified and
closed at `ce14e04c56271b756742d29a57cb717ec0e27803`; Modules certified and closed
at `67ebd7384468c91a6eedaa5427c6fc3bef4bd9f3`; Milestone 11 Batch 11A
certified and closed at `d147ccf2f84ee36261b97b4dca602d95ad34304a`; Batch 11B
certified and closed at `8655631f4f9fbb0508447713371e534bee418582`; Milestone
12 Batch 12A certified and closed at
`693c5e09c1988cabd94133ee0d3f4af125278466`; Batch 12B certified and closed at
`f4fc5b40ac3a002563da60bae170d06e60963b7e`; Milestone 13 certified and
closed at `a78d42102d3a672f1bc13535c652300c92f25318`.

The pre-1.0 Language Foundations phase is closed. Milestone 11 Batches 11A and
11B are closed; later Standard Library batches remain unauthorized.

Current roadmap milestone: Milestone 14 — Kwechiri 1.0, not ready
Contract: [Milestone 14 release contract](MILESTONE-14-KWECHIRI-1.0.md),
approved 2026-10-30 and in progress

Readiness: [local evidence and remaining gaps](MILESTONE-14-READINESS.md)

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
- nearest-loop `kwụsị` and `gaa n'ihu`
- `ọrụ` functions, parameters, calls, and `laghachi`
- homogeneous arrays and typed objects
- recursively structural array types independent of length
- type-safe existing-element and existing-property mutation
- collection reference identity without implicit copying
- checked array indexing and object property access
- named multi-file modules using `webata`, `bupụ`, and `site na`
- explicit `kwechiri:eriri` imports with `nwereEriri`, `maliteNa`, and
  `kwụsịNa`
- an explicit Kwechiri runtime boundary with Node.js and browser-worker
  implementations
- a local `/playground/` for one source file, certified `kwechiri:` imports,
  verified examples, and located diagnostics
- automated Chromium regression and WCAG A/AA checks for the playground
- production security headers and audited compiler/website dependency locks
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

The certified pre-1.0 Functions batch adds eager structural validation,
module-top-level-only declarations, one inferred signature per function,
explicit recursion and first-class-function exclusions, and same-block
unreachable-return diagnostics. It was closed at
`c27d353e7589cf541f0054958c33f72c4803389b`; the historical Milestone 6 record
remains unchanged.

### Pre-1.0 Control Flow

The Control Flow batch adds nearest-loop `kwụsị` and `gaa n'ihu`,
controlled invalid-placement diagnostics, and same-block reachability errors.
It preserves strict `mgbe` conditions and the established flow-based binding
model. It was certified and closed at
`ce14e04c56271b756742d29a57cb717ec0e27803`.

### Pre-1.0 Modules Hardening

Status: certified, committed, pushed, and closed at
`67ebd7384468c91a6eedaa5427c6fc3bef4bd9f3`.

The approved batch adds canonical filesystem containment and identity,
once-only dependency-first execution, cycle-chain diagnostics, consistent
import/local collision rejection, explicit-export visibility, and shared
mutable imported collections. Import aliases, dedicated re-exports, packages,
and packages remain unstarted. This closure completes the pre-1.0 Language
Foundations phase.

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

At Milestone 10 closure, Milestone 11 had not begun and required a separate
approved contract. Batch 11A has since received that contract.

The Milestone 10 local implementation gate passes with 67 automated tests,
linting, strict source/test type checking, a production build, and direct
`run`/`check`/`compile` plus generated-artifact probes on Node.js 20 and 24.

## Remaining roadmap milestones

### Milestone 11 — Standard Library

Status: Batches 11A and 11B certified and closed. Batch 11A closed at
`d147ccf2f84ee36261b97b4dca602d95ad34304a`; Batch 11B closed at
`8655631f4f9fbb0508447713371e534bee418582`.

Batch 11A establishes the reserved `kwechiri:` namespace, explicit imported
standard functions, an internal signature catalog, portable pure
implementations, and exactly three string predicates, provisional at the time
of that batch:

- `nwereEriri`
- `maliteNa`
- `kwụsịNa`

Batch 11B adds `ogologoEriri` for extended grapheme-cluster length and
`jikọọEriri` for exact raw-string concatenation. All five names are now frozen
for 1.0 by ADR-027 in the same `kwechiri:eriri` module.

Later string operations, numbers, collections, conversions, JSON, I/O, network,
randomness, and date/time remain unapproved.

Batch 11A certification validation:

- 156 automated tests spanning the compiler, modules, CLI, runtime, and
  Standard Library
- positive and negative predicate cases with Unicode, normalization, case, and
  source-location coverage
- direct `run`, `check`, and `compile` probes for `kwechiri:eriri`
- linting, strict source/test type checking, and the production build
- GitHub Actions run `40557024578` passed on Node.js 20 and Node.js 24 at
  `7f80f6036cb7065553a0a8b278a0cc8241123a9e`

Batch 11B certification validation:

- 162 automated tests, including grapheme counting for precomposed and
  decomposed Igbo text, flags, and joined emoji
- exact raw-string concatenation with case, Unicode, and empty-string coverage
- located diagnostics for invalid argument counts and types
- direct CLI `run`, `check`, and `compile` coverage for all five string APIs
- GitHub Actions run `40607333973` passed on Node.js 20 and Node.js 24
- compiler, Astro, and Vercel builds passed
- public Standard Library documentation verified at `kwechiri.dev`

### Milestone 12 — Browser playground

Status: Batches 12A and 12B certified and closed. Batch 12A closed at
`693c5e09c1988cabd94133ee0d3f4af125278466`; Batch 12B closed at
`f4fc5b40ac3a002563da60bae170d06e60963b7e`.

Batch 12A provides:

- a host-neutral single-source compiler boundary;
- a browser implementation of `KwechiriRuntime`;
- isolated Web Worker execution with a two-second timeout;
- 64 KiB source and bounded-output controls;
- a verified-example selector, source editor, output, and diagnostics;
- local-only execution with no source upload, analytics, or persistence;
- responsive desktop and mobile browser review.

The [Batch 12A contract](MILESTONE-12-BROWSER-PLAYGROUND.md) records the
approved limits and its separation from hardened cross-origin execution.

Batch 12B adds:

- seven Chromium regression tests covering every example and failure boundary;
- automated WCAG A/AA and narrow-viewport checks;
- Content Security Policy and related production headers;
- zero-vulnerability compiler and website dependency locks, including Astro
  7.4.3;
- CI browser installation, Chromium tests, and compiler/website dependency
  auditing.

The [Batch 12B hardening record](MILESTONE-12-BATCH-12B-HARDENING.md) documents
its evidence and remaining limitations.

Certification validation on 2026-10-29:

- the canonical gate passed linting, strict source/test type checking, 175
  automated tests, and the production build;
- `npm run website:check` passed example and deployment-configuration checks,
  Astro check with zero diagnostics, and the 23-page static build;
- seven Playwright Chromium tests passed, including WCAG A/AA and narrow-viewport
  coverage;
- the compiler and website dependency audits both reported zero vulnerabilities;
- the live Vercel deployment returned the configured security headers and
  preserved the permanent `www.kwechiri.dev` redirect to `kwechiri.dev`;
- the GitHub Actions run for Batch 12B was not independently inspected because
  the GitHub CLI was not authenticated in this session.

Still deferred:

- relative filesystem modules and multiple editable files;
- saved or shared programs;
- syntax highlighting and autocomplete;
- DOM, network, input, or other host APIs;
- production-grade execution of one person's code on behalf of another.

### Milestone 13 — VS Code support

Status: Certified and closed on 2026-10-29 at
`a78d42102d3a672f1bc13535c652300c92f25318`.

Expected work includes:

- `.kwe` language registration
- syntax highlighting
- brackets and comments configuration
- diagnostics integration
- formatting and completion decisions
- extension packaging and verification

Implemented foundation:

- `.kwe` language registration, TextMate highlighting, canonical-lexer
  semantic tokens, comments, brackets, indentation, and Unicode word
  navigation;
- compile-only diagnostics on open and save plus an explicit
  `Kwechiri: Check Current File` command;
- location-aware conversion for compiler and module errors without executing
  user programs;
- a versioned VSIX package built from the canonical compiler source;
- manifest, grammar, Unicode, diagnostic, packaging, and VS Code
  extension-host tests.

Formatting and completion remain undecided and unimplemented. The extension is
published publicly as version `0.1.3` at
`https://marketplace.visualstudio.com/items?itemName=kwechiri.kwechiri-language`.

Milestone 13 certification validation:

- `npm run check` passed with 185 automated tests, linting, strict source/test
  type checking, and the production build;
- `npm run vscode:check` passed extension type checking, bundling, manifest and
  grammar verification, and local VSIX packaging;
- `npm run vscode:test` passed against pinned VS Code 1.100.0, covering
  activation, segmentation into the `.kwe` language, semantic tokens, located
  diagnostics, correction clearing, manual command execution, and missing
  module diagnostics;
- the generated VSIX installed successfully into VS Code 1.133.0;
- the extension dependency audit reported zero vulnerabilities.

### Milestone 14 — Kwechiri 1.0

Approved and in progress. The detailed scope, acceptance conditions, and
owner-decision register are in the
[Milestone 14 release contract](MILESTONE-14-KWECHIRI-1.0.md).

Completed release work:

- stable language specification and language surface freeze
- final keyword and Igbo terminology inventory
- backward-compatibility policy
- complete error catalog
- compiler architecture documentation
- release procedure and local Windows readiness evidence
- Windows Node.js 20, 22, and 24 compiler verification
- compiler package identity and cross-platform CI matrix
- tutorial, reference, example, and architecture documentation verification

Remaining release work includes:

- Linux release-candidate verification and final support-matrix approval
- npm ownership verification and publication authorization
- final release candidate and explicit owner approval

The [changelog](../../CHANGELOG.md) and
[release procedure](../development/release.md) are established. The procedure
does not authorize publication or release.

## Cross-cutting work still unresolved

These items are not authorized merely because they appear here. Each requires
the appropriate owner decision and milestone placement.

### Language design

- multiline strings
- `maka` and collection iteration syntax
- typed empty-array construction
- explicit collection comparison and copying operations
- computed properties, spread syntax, and collection methods
- recursion, closures, nested/first-class functions, default parameters,
  annotations, and generics are deferred beyond 1.0
- module aliases, re-exports, wildcard imports, packages, and remote modules

### Engineering and operations

- publish and release procedures under the MIT license recorded in ADR-025
- add cross-platform verification beyond Linux CI
- finalize the supported Node.js policy beyond the current `>=20` declaration
- audit bilingual diagnostic consistency
- decide npm publication and package ownership
- define release and changelog procedures

The owner approved a documentation-first website foundation under `website/`.
It uses Astro, targets `kwechiri.dev`, and passes its Astro check, static build,
internal-link audit, and responsive visual review. Vercel preview and Git-driven
deployments are connected and building successfully. Earlier GitHub Actions
verification passed on Node.js 20 and Node.js 24; the Batch 12B run could not be
independently inspected without GitHub CLI authentication. A custom domain and
public launch are verified at `https://kwechiri.dev/`. Batch 12A adds a local
browser playground for single-file programs without adding server execution or
analytics. Batch 12B adds automated browser/accessibility coverage and
production security headers. Milestone 12 is closed.

The owner-supplied Kwechiri logo now defines the website, social preview,
favicon, README, VS Code extension icon, and Marketplace publisher identity.
Its black, electric-blue, cyan, orange, emerald, and white palette is recorded
in ADR-026.

The approved Tutorial Foundation is complete. All eight lessons, through
“Standard Library strings,” are available with repository-verified programs,
exact expected output, and exercises.

The Milestone 13 VS Code foundation is publicly distributed through the Visual
Studio Marketplace using GitHub trusted publishing. The project license is MIT.

The npm package is temporarily marked private to prevent accidental publication
during development. Publication remains owner-controlled.

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

Functions is closed at `c27d353e7589cf541f0054958c33f72c4803389b`.
Control Flow is closed at `ce14e04c56271b756742d29a57cb717ec0e27803`.
Modules is closed at `67ebd7384468c91a6eedaa5427c6fc3bef4bd9f3`, and the
pre-1.0 Language Foundations phase is closed. Milestone 11 Batch 11A is closed
at `d147ccf2f84ee36261b97b4dca602d95ad34304a`; Batch 11B is closed at
`8655631f4f9fbb0508447713371e534bee418582`. Milestone 12 Batch 12A is closed
at `693c5e09c1988cabd94133ee0d3f4af125278466`; Batch 12B is closed at
`f4fc5b40ac3a002563da60bae170d06e60963b7e`. Milestone 13 is certified and
closed at `a78d42102d3a672f1bc13535c652300c92f25318`. Further Marketplace
releases use the trusted-publishing workflow.

Milestone 14 is approved and in progress with the `1.0.0-rc.1` candidate at
`0bc3b1d`. Work packages 14A-14E are complete; 14F and 14G are in progress;
14H has prepared the candidate. The next gate is inspected Linux and Windows CI
evidence, verified npm ownership, and explicit owner approval for each
publication target. Do not publish the compiler or begin later Standard Library
batches without that approval.
