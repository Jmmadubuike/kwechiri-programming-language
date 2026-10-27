# Kwechiri

Kwechiri is an Igbo-first programming language designed to make programming
more accessible to Igbo speakers while maintaining a coherent, professional
language and compiler architecture.

The compiler is currently implemented in TypeScript, generates JavaScript, and
uses an injected Kwechiri runtime with Node.js as its first host. Kwechiri source
files use the `.kwe` extension.

## Current status

Language Milestones 0–10 and the post-milestone Lexical Foundations, Core
Values & Logic, Collections, Functions, and Control Flow phases are closed.
Modules and the pre-1.0 Language Foundations phase are closed. Milestone 11
Batch 11A is active and adds the first explicitly imported Standard Library
module under the reserved `kwechiri:` namespace.
The implemented language includes:

- Unicode Igbo identifiers and located diagnostics
- strings, numbers, booleans, variables, arithmetic, and comparisons
- `bipụta`, `ọ bụrụ`/`ọzọ`, `mgbe`, `kwụsị`, and `gaa n'ihu`
- named `ọrụ` functions with `laghachi`
- homogeneous arrays and typed objects
- named relative modules using `webata`, `bupụ`, and `site na`
- an explicit runtime boundary with a Node.js implementation

## Quick start

Requires Node.js 20 or newer.

```sh
npm install
npm run build
node dist/cli/index.js hello.kwe
```

Expected output:

```text
Ndewo Ụwa!
```

After linking the package locally with `npm link`, run a program with either
the compatible shorthand or the explicit command:

```sh
kwechiri hello.kwe
kwechiri run hello.kwe
```

Validate without executing, or compile directly runnable Node.js output:

```sh
kwechiri check hello.kwe
kwechiri compile hello.kwe
node hello.js
kwechiri compile hello.kwe --out build/hello.js --force
```

The parent of an explicit output path must already exist. Compilation refuses
to overwrite by default. See the [CLI specification](docs/language-spec/cli.md)
for help, version, streams, exit codes, and generated-artifact requirements.

## Example

```kwe
ọrụ gbakọọ(a, b) {
    laghachi a + b
}

nsonaazụ = gbakọọ(10, 20)
ọ bụrụ (nsonaazụ >= 30) {
    bipụta("Nsonaazụ zuru oke")
}
```

Additional executable examples are available in [`examples/`](examples/).

## Development

Install the locked dependencies and run the canonical quality gate:

```sh
npm ci
npm run check
```

The gate covers linting, strict source and test type checking, all tests, and a
production build. See the [development workflow](docs/development/workflow.md)
and [testing guide](docs/development/testing.md).

## Documentation

- [Documentation index](docs/README.md)
- [Current language specification](docs/language-spec/README.md)
- [Architecture index](docs/architecture/README.md)
- [Design-decision index](docs/design-decisions/README.md)
- [Project status and roadmap](docs/roadmap/PROJECT-STATUS.md)
- [Recorded technical debt](docs/roadmap/technical-debt.md)

Historical `milestone-*.md` files remain available as incremental records and
may be superseded by the current topic-oriented specification and later ADRs.

## License and publication

The project owner has not selected a license. No license is granted or implied
by this repository, and the package must not be published until licensing and
publication policy receive explicit owner approval. The package is temporarily
marked private to prevent accidental npm publication during development.
