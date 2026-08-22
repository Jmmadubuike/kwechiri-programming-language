# Kwechiri

Kwechiri is an Igbo-first programming language. Its initial compiler is written
in TypeScript and targets JavaScript running on Node.js.

The current development milestone supports output and mutable variables:

```kwe
bipụta("Ndewo Ụwa!")
```

```kwe
aha = "Uche"
afọ = 36
bipụta(aha)
bipụta(afọ)
```

## Development

Requires Node.js 20 or newer.

```sh
npm install
npm run check
node dist/cli/index.js hello.kwe
```

After installing the package globally or linking it with `npm link`, the same
program can be run as:

```sh
kwechiri hello.kwe
```

See the [Milestone 1](docs/language-spec/milestone-1.md) and
[Milestone 2](docs/language-spec/milestone-2.md) specifications for the
currently supported language surface.

The project license has not yet been selected by the project owner.
