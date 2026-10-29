# VS Code extension architecture

The VS Code integration lives in `extensions/vscode/` and is separate from the
compiler package. Its activation path is:

```text
.kwe document opened
  -> language registration and TextMate fallback
  -> semantic tokens from the canonical lexer
  -> compileFile validation on open or save
  -> VS Code diagnostics and output channel
```

The extension entry point owns VS Code lifecycle events, status display, and
diagnostic collection. `src/diagnostics.ts` converts compiler failures into
editor-neutral problem records. `src/semantic-tokens.ts` converts canonical
lexer tokens into the VS Code semantic-token encoding.

The extension is bundled by esbuild. Root `src/` compiler modules are inputs to
that bundle, not copied into an extension-specific compiler. The generated
bundle is stored under the ignored extension `dist/` directory.

The extension uses `compileFile`, not `run` or `compile`. It validates the
filesystem-backed module graph but never executes generated JavaScript. The
extension therefore reports compile-time and module diagnostics; runtime
diagnostics remain a CLI or future integrated-run concern.

TextMate rules provide comments, operators, punctuation, and a fallback for
current keywords. Semantic tokens use the lexer for keyword, number, and string
identity, including normalized keyword matching for decomposed source.
Formatting and completion are intentionally absent.
