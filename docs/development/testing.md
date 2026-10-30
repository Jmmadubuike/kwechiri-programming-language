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
- `tests/diagnostics/`
- `tests/vscode/`

The explicit Vitest configuration defines deterministic discovery and Node
execution. Source and test TypeScript are independently type-checked.

The canonical gate is:

```sh
npm run check
```

It runs linting, strict source/test type checking, tests, and a clean production
build without relying on test hooks to repeat the build.

VS Code extension validation is separate:

```sh
npm run vscode:check
npm run vscode:test
```

The first command type-checks, bundles, verifies, and packages the local VSIX.
The second runs the extension-host suite against pinned VS Code 1.100.0.

Coverage can be inspected in future work, but no arbitrary coverage percentage
is a release gate during repository stabilization.
