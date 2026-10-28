# Lesson 5: Functions and Return Values

## Goal

Declare reusable named functions, accept parameters, call them, and return
values with `laghachi`.

## Before you begin

Complete [Lesson 4](04-repetition-and-loop-control.md) or make sure the
compiler is already built.

## The program

Open `examples/tutorials/functions.kwe`:

```kwe
ọrụ gbakọọ(a, b) {
    laghachi a + b
}

ọrụ kọwaa(afọ) {
    ọ bụrụ (afọ >= 18) {
        laghachi "Okenye"
    }
    laghachi "Nwatakịrị"
}

ọrụ kelee(aha) {
    bipụta(aha)
}

nsonaazụ = gbakọọ(10, 20)
bipụta(nsonaazụ)
bipụta(kọwaa(20))
bipụta(kọwaa(12))
bipụta(kelee("Ada"))
```

Run it from the repository root:

```sh
node dist/cli/index.js examples/tutorials/functions.kwe
```

Expected output:

```text
30
Okenye
Nwatakịrị
Ada
efu
```

## Defining and calling

A named function starts with `ọrụ`, followed by its name, parameters, and body:

```kwe
ọrụ gbakọọ(a, b) {
    laghachi a + b
}
```

`a` and `b` are parameters. Their values exist only inside the function. Call
the function with arguments:

```kwe
nsonaazụ = gbakọọ(10, 20)
```

## Returning values

`laghachi` returns a value immediately and exits the whole function:

```kwe
ọ bụrụ (afọ >= 18) {
    laghachi "Okenye"
}
laghachi "Nwatakịrị"
```

Both reachable returns produce strings, so the function's inferred return type
is string. A function that reaches the end without `laghachi` returns `efu`.
That is why `kelee("Ada")` prints `Ada` inside the function and then returns
`efu`, which the final `bipụta` displays.

## Current rules

- Declare functions at module top level before calling them.
- Use the exact number of arguments.
- The first call establishes one parameter signature for the function.
- Every later call must use that same signature.
- Parameters and locals cannot capture module variables.
- Direct and mutual recursion, nested functions, closures, default parameters,
  and first-class functions are currently unsupported.

## Exercise

Add:

```kwe
bipụta(gbakọọ(2, 3))
```

Before running it, predict the result. Then call `kọwaa` with a number below
`18` and explain which `laghachi` supplies the result.

## Common problems

- Declare the function before the call.
- Use the exact argument count.
- All reachable concrete returns must have one type.
- A concrete return mixed with reachable fallthrough `efu` is rejected.
- `laghachi` exits the function; loop control behaves differently.

## Normative references

- [Functions](../language-spec/functions.md)
- [Variables](../language-spec/variables.md)
- [Current language errors](../language-spec/errors.md)

## Next

Lesson 6 will introduce homogeneous arrays, typed objects, indexing, and
existing-element mutation.
