# Contributor and development workflow

## Before work

1. Read `AGENTS.md`, `docs/README.md`, and `docs/roadmap/PROJECT-STATUS.md`.
2. Read the relevant current specification, architecture documents, and ADRs.
3. Run `git status` and preserve unrelated changes.
4. Confirm that the requested milestone or stabilization scope is approved.
5. State the intended files, reason, and validation plan.

## During work

Make the smallest coherent change. Keep language behaviour, tests,
documentation, and examples aligned. Significant design decisions require
owner approval and an ADR before implementation.

## Validation

Run the canonical local gate:

```sh
npm run check
```

Use direct CLI, runtime, module, or UI probes in addition when relevant.

## Completion

Review the diff, confirm no generated or unrelated files changed, and report
implementation, tests, build, limitations, language-behaviour changes, and the
next recommended gate. Commit only after owner approval.
