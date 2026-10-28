# Lesson 6: Arrays and Objects

## Goal

Store several values in an array, group named values in an object, read them,
and safely update existing collection elements.

## Before you begin

Complete [Lesson 5](05-functions-and-return-values.md) or make sure the
compiler is already built.

## The program

Open `examples/tutorials/collections.kwe`:

```kwe
ahaNdị = ["Uche", "Ada", "Obi"]
mmadụ = { aha: ahaNdị[0], afọ: 36 }

bipụta(ahaNdị)
bipụta(mmadụ)
bipụta(mmadụ.aha)

ahaNdịAlias = ahaNdị
ahaNdịAlias[1] = "Chidi"
mmadụ.afọ = 37

bipụta(ahaNdị)
bipụta(mmadụ)
```

Run it from the repository root:

```sh
node dist/cli/index.js examples/tutorials/collections.kwe
```

Expected output:

```text
["Uche","Ada","Obi"]
{"aha":"Uche","afọ":36}
Uche
["Uche","Chidi","Obi"]
{"aha":"Uche","afọ":37}
```

## Arrays

An array uses square brackets and currently must be non-empty. Every element
must have the same type:

```kwe
ahaNdị = ["Uche", "Ada", "Obi"]
```

Indexes start at `0`. `ahaNdị[0]` is `"Uche"`. A known invalid index is a
compile-time error; a dynamically computed invalid index is a located runtime
error.

Existing elements can be replaced when the new value has the same type:

```kwe
ahaNdịAlias[1] = "Chidi"
```

Assignment cannot grow or shrink the array.

## Objects

Objects use curly braces and fixed property names:

```kwe
mmadụ = { aha: ahaNdị[0], afọ: 36 }
```

Property access uses a dot:

```kwe
bipụta(mmadụ.aha)
```

An existing property can be updated when its value keeps the established type:

```kwe
mmadụ.afọ = 37
```

Assignment cannot add a new property. Missing properties are errors; they do
not return `efu`.

## References and sharing

`ahaNdịAlias = ahaNdị` copies the reference, not the array. Updating index `1`
through the alias is visible through `ahaNdị`. Arrays and objects are not
implicitly copied during assignment, function calls, returns, imports, or
exports.

Collection equality remains unsupported. Kwechiri currently has no defined
reference or deep equality operation for arrays or objects.

## Exercise

Change `ahaNdịAlias[0]` to `"Ngozi"` and predict what printing `ahaNdị` shows.
Then try adding `mmadụ.obodo = "Aba"` and explain why the compiler rejects it.

## Common problems

- Arrays must currently be non-empty and homogeneous.
- Indexes must be finite, non-negative integers within bounds.
- Arrays do not resize through index assignment.
- Objects have fixed property shapes.
- Mutating an alias changes the same collection.

## Normative references

- [Collections](../language-spec/collections.md)
- [Values and types](../language-spec/types.md)
- [Current language errors](../language-spec/errors.md)

## Next

Lesson 7 will introduce named imports, exports, dependencies, and multi-file
programs.
