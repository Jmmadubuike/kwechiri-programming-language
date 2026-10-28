# Lesson 3: Expressions and Decisions

## Goal

Calculate values, compare them, combine Boolean results, and choose which block
of a program should run.

## Before you begin

Complete [Lesson 2](02-variables-and-values.md) or make sure the compiler is
already built.

## The program

Open `examples/tutorials/expressions-and-decisions.kwe`:

```kwe
afọ = 20
nsonaazụ = (3 + 5) * 2

bipụta(nsonaazụ)
bipụta(afọ >= 18)
bipụta(afọ < 18)
bipụta(afọ >= 18 na afọ < 65)
bipụta(afọ < 18 maọbụ afọ >= 18)
bipụta(ọ bụghị (afọ < 18))

ọ bụrụ (afọ >= 18) {
    ọkwa = "Okenye"
} ọzọ {
    ọkwa = "Nwatakịrị"
}

bipụta(ọkwa)
```

Run it from the repository root:

```sh
node dist/cli/index.js examples/tutorials/expressions-and-decisions.kwe
```

Expected output:

```text
16
eziokwu
ụgha
eziokwu
eziokwu
eziokwu
Okenye
```

## Arithmetic

Kwechiri currently provides `+`, `-`, `*`, and `/` for numbers.
Multiplication and division happen before addition and subtraction.
Parentheses override that order, so `(3 + 5) * 2` calculates `8`, then `16`.

Arithmetic does not accept strings, and `+` does not concatenate strings.
Dividing by zero is a runtime error.

## Comparisons

`<`, `<=`, `>`, and `>=` compare numbers. `==` and `!=` compare supported
primitive values without converting one type into another.

Comparisons produce a Boolean: `eziokwu` or `ụgha`.

## Boolean logic

| Operator | Meaning |
|---|---|
| `na` | and |
| `maọbụ` | or |
| `ọ bụghị` | not |

These operators accept booleans only. `na` and `maọbụ` evaluate from left to
right and short-circuit. Kwechiri does not treat numbers, strings, collections,
or `efu` as true or false automatically.

## Conditions

```kwe
ọ bụrụ (afọ >= 18) {
    ọkwa = "Okenye"
} ọzọ {
    ọkwa = "Nwatakịrị"
}
```

The condition must be Boolean. Exactly one branch runs. Because both branches
assign `ọkwa` as a string, that name is available after the condition.

## Exercise

Change the first line to `afọ = 16` and predict the output before running the
program. The comparison results, Boolean results, and `ọkwa` value will change.

Then replace `na` with `maọbụ` in the first logical expression and explain why
the result is still `eziokwu`.

## Common problems

- Parentheses control arithmetic and Boolean grouping.
- Use `==` for equality; `=` assigns a value.
- Conditions cannot use numbers as implicit truth values.
- A name created in only one branch is unavailable after the condition.

## Normative references

- [Expressions](../language-spec/expressions.md)
- [Control flow](../language-spec/control-flow.md)
- [Current language errors](../language-spec/errors.md)

## Next

Lesson 4 will introduce `mgbe` loops, `kwụsị`, and `gaa n'ihu`.
