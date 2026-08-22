# Command-line interface

Kwechiri provides a non-interactive command-line interface for one entry
`.kwe` file and its relative module graph.

## Commands

```text
kwechiri <file.kwe>
kwechiri run <file.kwe>
kwechiri check <file.kwe>
kwechiri compile <file.kwe> [--out <file.js>] [--force]
kwechiri --help
kwechiri --version
```

The shorthand form is equivalent to `run`. `run` compiles and executes without
writing JavaScript. `check` performs the existing compile-time and module-graph
validation, discards generated JavaScript, and does not execute the program.
Successful checks are silent.

`compile` writes directly runnable Node.js output. Its default destination is a
sibling of the source formed by replacing only the final `.kwe` with `.js`.
`--out` selects exactly one explicit lowercase `.js` file. Its parent must
already exist, and a directory is not an output file. Without `--force`, an
existing destination is never overwritten. Source and output may never resolve
to the same path.

Source `.kwe` and output `.js` extensions are lowercase and case-sensitive.

## Compiled artifact

The CLI artifact contains the generated program and a small Node.js bootstrap.
The bootstrap imports the executor and runtime-error class from the same
installed Kwechiri compiler that produced it. It therefore requires that
Kwechiri installation to remain available at its recorded location; the
command is compilation, not bundling or standalone packaging. The internal
`compile()` output contract remains unchanged.

## Streams and exits

Program output, explicit help, and explicit version use stdout. Language,
runtime, usage, filesystem, and internal diagnostics use stderr. Successful
`check` and `compile` produce no normal output. Expected failures do not print
uncontrolled Node.js stack traces.

| Code | Meaning |
|---:|---|
| `0` | success |
| `1` | Kwechiri language, compiler, module, or runtime diagnostic |
| `2` | invalid CLI usage |
| `3` | filesystem, entry-input, or output failure |
| `4` | unexpected internal Kwechiri/compiler failure |

A missing entry file is code `3`. A missing imported module is a source-level
module diagnostic and is code `1`. Plain `kwechiri` is invalid usage; explicit
help is available through `kwechiri --help`.

The CLI does not provide a REPL, watch mode, project configuration, bundling,
package management, scaffolding, debugging, formatting, or release automation.
