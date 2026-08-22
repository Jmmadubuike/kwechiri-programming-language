# CLI architecture

The CLI is a thin orchestration layer over existing compiler and runtime APIs:

```text
arguments
  -> typed CLI request
  -> run:     compileFile -> executeJavaScript
  -> check:   compileFile -> discard output
  -> compile: compileFile -> runnable Node bootstrap -> safe file write
```

`src/cli/arguments.ts` owns the dependency-free command grammar.
`src/cli/commands.ts` owns command execution, help/version output, and the
runnable artifact bootstrap. `src/cli/app.ts` maps typed and host failures to
public exit codes. `src/cli/index.ts` is only the executable entry point.

The CLI does not duplicate lexing, parsing, semantic analysis, module loading,
code generation, or runtime execution. The internal compiler continues to emit
JavaScript expecting `_kweRuntime`; only CLI file output wraps that result.

Non-forced output uses exclusive file creation to make overwrite refusal
race-safe. Compilation finishes before the destination is opened. Forced
output may replace an existing generated file but never an identical source
path.
