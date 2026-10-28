# Browser playground architecture

Milestone 12 Batch 12A implements a local, single-file browser playground on
the existing static website.

```text
editor source
  -> single-source import boundary
  -> existing lexer, parser, semantic analysis, and code generation
  -> generated JavaScript
  -> dedicated module Web Worker
  -> browser KwechiriRuntime
  -> structured output or diagnostic
  -> main-thread UI
```

## Compiler boundary

`compileSingleSource` is a host-neutral compiler entry for one source file. It
accepts explicit imports from certified `kwechiri:` modules and rejects
filesystem, package, and remote module requests with a located playground
limitation.

The entry calls the established lexer, parser, semantic analyzer, Standard
Library catalog, and JavaScript generator. It does not define alternate
Kwechiri semantics and does not replace the canonical filesystem module loader
used by the CLI.

## Worker boundary

Every run creates a fresh module Web Worker. Compilation and execution happen
in that worker so the page remains responsive and untrusted loops can be
terminated from the main thread.

The worker:

- has no DOM access;
- receives one structured source request;
- returns plain structured results;
- never posts credentials or analytics;
- is terminated on completion, cancellation, failure, or timeout;
- does not expose raw host stack traces to the interface.

Batch 12A executes generated JavaScript through the `Function` constructor.
Kwechiri source cannot emit arbitrary JavaScript, but this is resource and DOM
containment rather than a hardened cross-origin execution service.

## Runtime

The browser runtime implements the existing `KwechiriRuntime` methods:

- output formatting;
- checked division;
- checked array indexing;
- checked existing-element mutation.

It preserves the same Kwechiri spellings, error categories, and source
locations as `NodeKwechiriRuntime`. Pure Standard Library operations come from
the same shared implementation used by the CLI.

## Limits

- source: 64 KiB;
- execution: 2 seconds;
- program output: 1,000 lines or 64 KiB.

These are playground resource limits, not Kwechiri language semantics.

## Privacy

The browser compiles and executes source locally. The site does not upload
source or output, collect analytics, persist programs, or provide accounts or
sharing.

## Hardening

Batch 12B adds a Chromium regression suite, automated WCAG A/AA scanning, and a
narrow-viewport check. Production configuration applies a Content Security
Policy and related headers; the CSP retains `'unsafe-eval'` only because the
approved worker executes compiler-generated JavaScript through the `Function`
constructor.

The website dependency lock uses a supported Astro release with no known npm
audit findings. The canonical `www.kwechiri.dev` redirect remains part of the
deployment configuration.

## Deferred work

- relative filesystem modules and multiple editable files;
- saved or shared programs;
- syntax highlighting and autocomplete;
- DOM, network, input, or other host APIs;
- a hardened cross-origin execution service.
