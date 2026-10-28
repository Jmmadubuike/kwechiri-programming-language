# Milestone 12 Batch 12B: Playground hardening

Status: Approved and implemented on 2026-10-28.

## Purpose

Stabilize the live browser playground before adding more product features. This
batch changes tooling, deployment policy, and verification only; it does not
alter Kwechiri syntax, semantics, the CLI, or the approved single-file
playground behavior.

## Approved scope

Batch 12B provides:

- repeatable Chromium tests for every verified playground example;
- covered compile, runtime, filesystem-import, source-limit, output-limit,
  timeout, and cancellation outcomes;
- keyboard execution, no-source-upload, and no-browser-storage checks;
- automated WCAG A/AA checks on the playground;
- a narrow-viewport overflow check;
- production Content Security Policy and related security headers;
- preservation of the canonical `www` redirect;
- locked compiler and website dependencies without known npm audit findings;
- CI execution of browser tests and the website dependency audit.

It does not add:

- multiple source files or browser filesystem modules;
- saved or shared programs;
- syntax highlighting or autocomplete;
- network, DOM, input, or other language host APIs;
- server-side execution;
- a claim that same-origin worker execution is a hardened cross-origin
  execution service.

## Dependency update

The website moves from Astro 6.0.5 to Astro 7.4.3 and therefore requires
Node.js 22.23.4 or newer for website development and builds. The compiler's
test runner moves from Vitest 3.2 to the patched Vitest 4 line while retaining
Node.js 20 support. The existing Node.js 20/24 CI matrix remains.

The previous Astro, Vitest, Vite, and transitive dependency chains had known
audit findings. Both locked dependency trees now report zero npm
vulnerabilities.

## Production headers

`website/vercel.json` applies to every route:

- Content Security Policy;
- Cross-Origin-Opener-Policy;
- Permissions-Policy;
- Referrer-Policy;
- Strict-Transport-Security;
- X-Content-Type-Options;
- X-Frame-Options.

The CSP permits `'unsafe-eval'` because the approved playground executes
compiler-generated JavaScript with the `Function` constructor inside its
dedicated worker. It otherwise restricts scripts, workers, connections,
frames, objects, forms, fonts, and images to the approved local site boundary.

The existing permanent redirect from `www.kwechiri.dev` to `kwechiri.dev` is
retained.

## Browser regression tests

The Playwright Chromium suite covers:

1. Every playground example and its exact output.
2. Located compile and runtime diagnostics without host stack traces.
3. The controlled filesystem-import playground limitation.
4. Source-size, output-size, execution-timeout, and cancellation limits.
5. Control+Enter execution, no source-bearing request, and no browser storage.
6. Automated WCAG A/AA scanning with zero violations.
7. No horizontal overflow at a narrow viewport.

The test server uses the production static build rather than the development
server.

## Accessibility corrections

Automated scanning found and the implementation corrected:

- an invalid `aria-label` on the output `<pre>`, now a named live `log`;
- a home-link accessible-name mismatch, now derived from visible text plus a
  hidden “home” suffix.

## Validation

Local Batch 12B evidence:

- 7 Playwright Chromium tests passed;
- automated WCAG A/AA scan reported zero violations;
- Astro check reported zero errors, warnings, or hints;
- the static build produced 23 pages;
- 426 internal links passed;
- website dependency audit reported zero vulnerabilities;
- compiler dependency audit reported zero vulnerabilities;
- deployment configuration checks passed for headers and the canonical
  redirect.

Post-deployment verification must separately confirm that Vercel returns the
configured headers and preserves the `www` redirect. A local configuration
check is not deployment evidence.

## Remaining limitations

- The repository remains private, so this session cannot inspect GitHub Actions
  without separate authentication.
- Browser execution remains same-origin worker containment rather than
  cross-origin isolation.
- Multi-file editing, saved programs, editor intelligence, and richer language
  host capabilities remain outside Batch 12B.
