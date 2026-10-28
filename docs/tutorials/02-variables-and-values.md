# Lesson 2: Variables and Values

## Goal

Store values under names, read them, and update a variable after its first
assignment.

## Before you begin

Complete [Lesson 1](01-ndewo-uwa.md) or make sure the compiler is already built.

## The program

Open `examples/tutorials/variables.kwe`:

```kwe
aha = "Uche"
afọ = 36
bụOkenye = eziokwu
nzaghachi = efu

bipụta(aha)
bipụta(afọ)
bipụta(bụOkenye)
bipụta(nzaghachi)

aha = "Ada"
bipụta(aha)
```

Run it from the repository root:

```sh
node dist/cli/index.js examples/tutorials/variables.kwe
```

Expected output:

```text
Uche
36
eziokwu
efu
Ada
```

## What happened

The first assignment to a name creates a variable:

```kwe
aha = "Uche"
```

The value on the right is stored under `aha`. Kwechiri can then read `aha` in
later statements. A later assignment updates the same variable:

```kwe
aha = "Ada"
```

The program uses four current value types:

| Value | Type | Meaning |
|---|---|---|
| `"Uche"` | string | text |
| `36` | number | numeric value |
| `eziokwu` | boolean | true |
| `efu` | absence | no value |

Kwechiri does not convert between these types implicitly. The string `"36"` and
the number `36` are different values.

Variable names are case-sensitive and may use Igbo Unicode letters. This lesson
keeps each variable on one value type so the example is easy to follow.

## Exercise

Create:

```kwe
obodo = "Aba"
bipụta(obodo)

obodo = "Enugu"
bipụta(obodo)
```

Save it as `obodo.kwe`, run it, and confirm:

```text
Aba
Enugu
```

Then try reading a new variable before assigning it. The compiler reports a
located undefined-variable error. Restore the assignment before continuing.

## Common problems

- Assignment uses a single `=`.
- Names are matched exactly, including case.
- `"eziokwu"` is a string because it has quotation marks; `eziokwu` is a
  Boolean value.
- A variable must be assigned before it is read.

## Normative references

- [Variables](../language-spec/variables.md)
- [Values and types](../language-spec/types.md)
- [Command-line interface](../language-spec/cli.md)

## Next

Lesson 3 will introduce arithmetic expressions, comparisons, and decisions.
