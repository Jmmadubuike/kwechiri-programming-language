# Lesson 4: Repetition and Loop Control

## Goal

Repeat statements while a Boolean condition is true, stop a loop early, and skip
to its next iteration.

## Before you begin

Complete [Lesson 3](03-expressions-and-decisions.md) or make sure the compiler
is already built.

## The program

Open `examples/tutorials/loops.kwe`:

```kwe
onụọgụ = 1
bipụta("Mgbe")
mgbe (onụọgụ <= 3) {
    bipụta(onụọgụ)
    onụọgụ = onụọgụ + 1
}

onụọgụ = 0
bipụta("Kwụsị")
mgbe (eziokwu) {
    onụọgụ = onụọgụ + 1
    ọ bụrụ (onụọgụ == 2) {
        kwụsị
    }
    bipụta(onụọgụ)
}

onụọgụ = 0
bipụta("Gaa n'ihu")
mgbe (onụọgụ < 4) {
    onụọgụ = onụọgụ + 1
    ọ bụrụ (onụọgụ == 2) {
        gaa n'ihu
    }
    bipụta(onụọgụ)
}
```

Run it from the repository root:

```sh
node dist/cli/index.js examples/tutorials/loops.kwe
```

Expected output:

```text
Mgbe
1
2
3
Kwụsị
1
Gaa n'ihu
1
3
4
```

## `mgbe`

`mgbe` checks its condition before every iteration:

```kwe
mgbe (onụọgụ <= 3) {
    bipụta(onụọgụ)
    onụọgụ = onụọgụ + 1
}
```

The condition must be Boolean. It can be false immediately, so a loop may run
zero times. The example updates `onụọgụ`; without an update that eventually
makes the condition false, the loop can continue forever.

## `kwụsị`

`kwụsị` exits the nearest enclosing loop:

```kwe
ọ bụrụ (onụọgụ == 2) {
    kwụsị
}
```

The statements after the conditional still exist, but on the iteration where
the branch runs, the loop ends before reaching `bipụta(onụọgụ)`.

## `gaa n'ihu`

`gaa n'ihu` starts the next iteration of the nearest enclosing loop:

```kwe
ọ bụrụ (onụọgụ == 2) {
    gaa n'ihu
}
bipụta(onụọgụ)
```

When `onụọgụ` is `2`, the print is skipped. The next iteration begins with
`onụọgụ` equal to `3`.

## Nearest loop

Both statements target the nearest enclosing loop. In nested loops they do not
target an outer loop. `kwụsị` exits only the loop, not the whole function;
`laghachi` is the statement that exits a function.

Using either statement outside a loop is a compile-time error.

## Exercise

Change the `kwụsị` condition from `onụọgụ == 2` to `onụọgụ == 4`. Predict how
the output changes before running the program.

Then try removing `onụọgụ = onụọgụ + 1` from the first loop. Explain why the
program no longer finishes.

## Normative references

- [Control flow](../language-spec/control-flow.md)
- [Variables](../language-spec/variables.md)
- [Current language errors](../language-spec/errors.md)

## Next

Lesson 5 will introduce `ọrụ` functions, parameters, calls, and `laghachi`.
