# Testing and validation

Every implemented behaviour should cover relevant valid programs, invalid
syntax or semantics, edge cases, Unicode, source locations, runtime failures,
module behavior, and regressions.

Test locations:

- `tests/lexer/`
- `tests/compiler/`
- `tests/runtime/`
- `tests/integration/`
- `tests/fixtures/`

The explicit Vitest configuration defines deterministic discovery and Node
execution. Source and test TypeScript are independently type-checked.

The canonical gate is:

```sh
npm run check
```

It runs linting, strict source/test type checking, tests, and a clean production
build without relying on test hooks to repeat the build.

Coverage can be inspected in future work, but no arbitrary coverage percentage
is a release gate during repository stabilization.
