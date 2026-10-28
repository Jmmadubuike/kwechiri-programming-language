# Lesson 1: Ndewo Ụwa

## Goal

Run a complete Kwechiri program and understand how one source file produces one
line of output.

## Before you begin

You need:

- Git;
- Node.js 20 or newer;
- npm;
- a terminal.

Follow the repository setup instructions if the compiler is not built yet:

```sh
git clone https://github.com/Jmmadubuike/kwechiri-programming-language.git
cd kwechiri-programming-language
npm ci
npm run build
```

## The program

Open `examples/hello.kwe`:

```kwe
bipụta("Ndewo Ụwa!")
```

Run it from the repository root:

```sh
node dist/cli/index.js examples/hello.kwe
```

Expected output:

```text
Ndewo Ụwa!
```

## What happened

- The `.kwe` extension identifies a Kwechiri source file.
- `bipụta` is the language's current output function.
- The text between quotation marks is a string.
- Kwechiri passes the string to the runtime, which prints it and adds a line
  break.

The capitalization and Igbo characters are part of the string. Change `Ụ` to
`ụ`, and the output changes too. Kwechiri does not silently normalize string
contents.

## Exercise

Copy `examples/hello.kwe` to a new file named `ndewo.kwe` and change the string
to:

```kwe
bipụta("Ndewo Kwechiri!")
```

Run:

```sh
node dist/cli/index.js ndewo.kwe
```

Expected output:

```text
Ndewo Kwechiri!
```

## Common problems

- Use the `.kwe` extension; this CLI version rejects other entry extensions.
- Use straight quotation marks around the string.
- Run the displayed command from the repository root unless you changed the
  path to the source file.
- Type Igbo characters exactly. NFC and NFD string contents are preserved as
  different raw sequences.

## Normative references

- [Current language specification](../language-spec/README.md)
- [Command-line interface](../language-spec/cli.md)
- [Current language errors](../language-spec/errors.md)

## Next

Lesson 2 will introduce variables and the current value types. Until it is
published, explore the tested programs in the repository's `examples/`
directory.
