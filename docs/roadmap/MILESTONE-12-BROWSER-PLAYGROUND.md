# Milestone 12 Batch 12A: Browser playground foundation

Status: Certified and closed on 2026-10-29 at
`693c5e09c1988cabd94133ee0d3f4af125278466`.

## Purpose

Add a browser playground where a visitor can write and run Kwechiri entirely in
their own browser. The playground must reuse the existing language pipeline and
runtime contract, remain honest about unsupported capabilities, and avoid
creating a second interpreter that can drift from the command-line compiler.

## Approved Batch 12A scope

Batch 12A provides:

- a `/playground/` route on `kwechiri.dev`;
- one editable, self-contained `.kwe` source file;
- compilation through the existing lexer, parser, semantic analyzer, and
  JavaScript code generator;
- a browser implementation of `KwechiriRuntime`;
- support for the certified pure `kwechiri:eriri` Standard Library module;
- Run, Cancel, and Reset controls;
- a small menu of repository-verified examples;
- formatted program output and located compile or runtime diagnostics;
- desktop and mobile layouts with keyboard-accessible controls;
- a clear statement that source stays in the browser and is not transmitted.

Batch 12A does not provide:

- relative filesystem modules or multiple editable files;
- npm packages, remote modules, network access, DOM access, or user input;
- accounts, saved programs, share links, downloads, analytics, or storage;
- a full source-code editor, syntax highlighting, autocomplete, or formatting;
- server-side compilation or execution;
- a claim that the playground is a security boundary suitable for executing
  one person's code on behalf of another.

Relative `.kwe` imports fail with a beginner-readable playground limitation.
The certified `kwechiri:eriri` module remains available because it is pure and
compiler-known.

## User-visible contract

The playground contains:

1. A labelled source editor with the verified `Ndewo Ụwa` program selected on
   first load.
2. An example selector containing only examples verified by the canonical
   test suite.
3. A primary Run button and a Cancel button while execution is active.
4. A Reset button that restores the selected example.
5. An output panel that preserves line breaks and collection formatting.
6. An error panel that presents the filename, line, column, message, and
   category when a category is defined.
7. A privacy note stating that Kwechiri source is compiled and executed in the
   browser without being uploaded.

Run behavior:

- Control and Enter runs the current source.
- Starting a run while another run is active first terminates the old worker.
- Editing does not execute code.
- Switching examples replaces the editor contents only after an explicit
  selection; it does not silently overwrite an active run.
- Program output and diagnostics are visually and semantically separate.

## Compiler and module boundary

The browser compiler must call the same compiler stages as the CLI. It must not
reimplement Kwechiri grammar, typing, code generation, or runtime error
categories.

A shared host-neutral source preparation layer should handle imports for a
single source file:

```text
playground source
  -> validate the playground import subset
  -> retain explicit kwechiri: standard imports
  -> reject relative filesystem imports with a controlled message
  -> existing lexer, parser, semantic analysis, and code generation
  -> generated JavaScript
  -> browser runtime in an isolated worker
```

The Standard Library catalog and pure implementation remain shared with the
CLI. Their names, signatures, Unicode behavior, and diagnostics must not fork
for the browser.

This extraction must preserve the existing filesystem module loader behavior.
It is not a redesign of module semantics and must not make Node filesystem APIs
part of the browser graph.

## Execution isolation

The recommended implementation is a dedicated module Web Worker:

- compilation and execution occur away from the UI thread;
- the worker has no DOM access;
- the main thread terminates the worker after 2 seconds;
- a fresh worker is created for every run;
- no request or result contains credentials, analytics, or account data;
- no fetch, storage, cookie, or navigation API is called by playground code;
- output stops at 1,000 lines or 64 KiB, whichever comes first;
- source input is limited to 64 KiB before compilation.

The generated JavaScript is executed inside the worker with the existing
runtime dependencies injected. This requires a dynamic JavaScript execution
primitive, currently the `Function` constructor. Kwechiri source cannot emit
arbitrary JavaScript, but this execution model is a resource and DOM
containment boundary, not a substitute for a cross-origin security product.

The owner must explicitly approve this worker-based dynamic-execution decision.
If a stronger origin isolation boundary is required, Batch 12A needs a separate
host, cross-origin sandbox, and deployment contract.

## Runtime behavior

The browser runtime implements the existing `KwechiriRuntime` interface:

- `print`
- `divide`
- `index`
- `setIndex`

It must preserve Kwechiri formatting for strings, numbers, Booleans, `efu`, and
collections. Division-by-zero and invalid-index failures must retain their
existing categories and source locations.

The worker returns plain structured data:

```text
success: output
success: empty output
failure: located compile diagnostic
failure: located runtime diagnostic
failure: timeout
failure: output limit
failure: internal playground failure
```

The UI must not display host stack traces or raw JavaScript errors as language
behavior.

## Initial examples

Batch 12A should initially include only self-contained programs:

- `Ndewo Ụwa`
- variables and values
- expressions and decisions
- repetition
- functions
- collections

The Standard Library strings tutorial should be included only after the
single-file standard import boundary passes browser tests with its exact
documented output.

Examples continue to have one authoritative `.kwe` source and exact expected
output in the repository. Playground snapshots must be checked for drift like
the current website examples.

## Site integration

Implementation changes:

- add `Playground` to primary navigation;
- add the `/playground/` static route and a client-side worker asset;
- update homepage language from “browser execution is future work”;
- update footer and privacy copy to distinguish local browser execution from
  remote execution;
- change the roadmap item from proposed to implemented only after validation.

The rest of the site remains static and usable without JavaScript. Only the
playground requires client-side execution.

## Accessibility and responsive behavior

Acceptance requires:

- semantic labels for editor, example selector, output, and errors;
- visible keyboard focus;
- Control and Enter execution;
- status announcements through a polite live region;
- no color-only distinction between success and failure;
- WCAG 2.2 AA text and control contrast;
- no horizontal page overflow at narrow mobile widths;
- editor and output remain independently scrollable without trapping focus;
- reduced-motion preferences continue to be respected.

## Privacy

The playground performs no source upload and adds no analytics, cookies,
telemetry, storage, or third-party scripts.

The privacy page must state:

- execution happens locally in the visitor's browser;
- source is not sent to Kwechiri or a remote execution service;
- closing the page discards source because Batch 12A does not save programs;
- the host may still process ordinary request data required to serve the page.

## Validation

Required automated coverage:

- self-contained program compiles and produces exact output;
- `kwechiri:eriri` import compiles and produces exact output;
- relative import receives the controlled playground limitation;
- syntax, semantic, and runtime errors remain located;
- Unicode identifiers and output survive worker messages;
- output limits stop excessive printing;
- timeout terminates a non-terminating loop;
- no stale worker result overwrites a newer run;
- all playground example snapshots match repository sources;
- website build and internal-link audit pass.

Required direct browser checks:

- desktop and narrow mobile layouts;
- keyboard-only run and reset;
- successful output;
- compile error;
- runtime error;
- timeout or cancellation;
- no source-bearing network request during execution;
- no horizontal page overflow.

Required repository checks:

```text
npm run check
npm run website:check
```

## Files likely affected

- `src/` for a host-neutral single-file module preparation boundary and tests;
- `website/src/pages/playground.astro`;
- `website/src/scripts/` for UI orchestration;
- `website/src/workers/` for compile-and-run isolation;
- `website/src/lib/` for worker protocol and playground types;
- `website/src/styles/global.css`;
- navigation, footer, privacy, homepage, and roadmap pages;
- tutorial and example snapshot verification;
- project-status and architecture documentation.

No new runtime dependency is planned. If implementation cannot meet the
contract without one, dependency approval is a separate gate.

## Approved owner decisions

1. Single-file programs plus `kwechiri:eriri`, with relative modules
   deferred beyond Batch 12A.
2. A dedicated Web Worker and dynamic execution through the `Function`
   constructor, with the documented separation from a hardened cross-origin
   execution service.
3. The 64 KiB source, 2-second, and 1,000-line/64 KiB output limits.
4. A plain accessible textarea editor rather than adding a code-editor
   dependency in Batch 12A.
5. The navigation, homepage, footer, roadmap, and privacy copy changes
   required to describe local browser execution accurately.

After those decisions, implementation can remain within the existing Astro,
TypeScript, and Web Worker stack without changing Kwechiri syntax, semantics,
the CLI, or the filesystem module contract.

## Implementation evidence

Batch 12A implementation validation on 2026-10-28:

- the exact `Ndewo Ụwa` output runs in the browser worker;
- the Standard Library strings example produces its documented seven lines;
- compile and runtime diagnostics preserve source locations;
- a relative import receives the controlled playground limitation;
- cancellation and the two-second timeout terminate the worker;
- the source, output-line, and output-byte limits stop oversized work;
- Control and Enter execute from the editor;
- request tracing shows no source-bearing request during execution;
- desktop and narrow-width layouts have no horizontal page overflow;
- `npm run check` passes with 175 tests;
- `npm run website:check` passes with zero Astro diagnostics;
- the static build produces 23 pages and 426 valid internal links.
