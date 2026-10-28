# Lesson 8: Standard Library strings

## Goal

Import the official `kwechiri:eriri` string module, check string contents, count
user-perceived characters, and join strings without hidden conversion.

## Before you begin

Complete [Lesson 7](07-modules.md) or make sure the compiler is already built.

## The program

Open `examples/tutorials/standard-library.kwe`:

```kwe
webata { nwereEriri, maliteNa, kwụsịNa, ogologoEriri, jikọọEriri } site na "kwechiri:eriri"

aha = "Kwechiri"

bipụta(nwereEriri(aha, "chiri"))
bipụta(nwereEriri(aha, "CHIRI"))
bipụta(maliteNa(aha, "Kwe"))
bipụta(kwụsịNa(aha, "chiri"))
bipụta(ogologoEriri("ụbọchị"))
bipụta(jikọọEriri("Ndewo, ", aha))
bipụta(maliteNa(aha, ""))
```

Run it from the repository root:

```sh
node dist/cli/index.js examples/tutorials/standard-library.kwe
```

Expected output:

```text
eziokwu
ụgha
eziokwu
eziokwu
6
Ndewo, Kwechiri
eziokwu
```

## Importing a standard module

Standard Library modules use the same explicit import form as filesystem
modules, but their names begin with the reserved `kwechiri:` namespace:

```kwe
webata { nwereEriri, maliteNa, kwụsịNa, ogologoEriri, jikọọEriri } site na "kwechiri:eriri"
```

`kwechiri:eriri` is provided by the compiler. It is not a package, remote URL,
or hidden `.kwe` file. Only the names in the import become available, and the
import must come before other statements.

The five provisionally named pre-1.0 functions are:

| Function | Signature | Meaning |
|---|---|---|
| `nwereEriri` | `(string, string) -> boolean` | Does the first string contain the second? |
| `maliteNa` | `(string, string) -> boolean` | Does the first string start with the second? |
| `kwụsịNa` | `(string, string) -> boolean` | Does the first string end with the second? |
| `ogologoEriri` | `(string) -> number` | Count user-perceived characters |
| `jikọọEriri` | `(string, string) -> string` | Join the two strings exactly |

## Exact string checks

`nwereEriri`, `maliteNa`, and `kwụsịNa` compare the exact string sequences.
Matching is case-sensitive:

```kwe
nwereEriri("Kwechiri", "chiri") # eziokwu
nwereEriri("Kwechiri", "CHIRI") # ụgha
```

An empty search string is contained in every string and is both a prefix and a
suffix of every string. That is why `maliteNa(aha, "")` prints `eziokwu`.

## Counting characters

`ogologoEriri` counts extended grapheme clusters, which are characters as a
reader perceives them rather than raw UTF-16 storage units:

```kwe
ogologoEriri("ụbọchị") # 6
```

An Igbo letter written with combining marks still counts as one character. An
empty string has length `0`.

## Joining strings

`jikọọEriri` joins two raw strings without inserting spaces or separators and
without converting other value types:

```kwe
jikọọEriri("Ndewo, ", "Kwechiri") # Ndewo, Kwechiri
```

The space is part of the first argument. String contents are not normalized, so
visually similar NFC and NFD sequences remain different raw strings.

## Exercise

Add these lines to the program and predict the output:

```kwe
bipụta(nwereEriri(aha, ""))
bipụta(ogologoEriri("Igbo"))
bipụta(jikọọEriri("Kwe", "chiri"))
```

Expected output:

```text
eziokwu
4
Kwechiri
```

## Common problems

- Import the module and name every function you use.
- Keep the import before other statements.
- Use the exact argument count and string types.
- Predicates are case-sensitive and do not normalize strings.
- Length counts user-perceived characters, not UTF-16 code units.
- Concatenation inserts no separator and performs no implicit conversion.
- All five public names remain provisional until the 1.0 terminology review.

## Normative references

- [Standard Library](../standard-library/README.md)
- [String functions](../standard-library/strings.md)
- [Standard modules](../language-spec/modules.md)
- [Standard Library signatures and errors](../design-decisions/ADR-022-standard-library-signatures-and-errors.md)
- [String functions decision](../design-decisions/ADR-023-string-basics.md)
- [Current language errors](../language-spec/errors.md)

## Next

The approved eight-lesson Tutorial Foundation is complete. Continue with the
verified programs in the repository's `examples/` directory and the current
language specification.
