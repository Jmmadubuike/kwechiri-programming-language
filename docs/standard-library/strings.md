# String predicates

The `kwechiri:eriri` module exports three provisionally named pre-1.0 APIs:

| Function | Signature | Meaning |
|---|---|---|
| `nwereEriri` | `(string, string) -> boolean` | first string contains the second |
| `maliteNa` | `(string, string) -> boolean` | first string starts with the second |
| `kwụsịNa` | `(string, string) -> boolean` | first string ends with the second |

All three functions are non-mutating, case-sensitive, and exact. They do not
coerce values or normalize either string. NFC and NFD string contents therefore
match only when their raw sequences match.

The empty string is contained in every string and is both a prefix and suffix
of every string, including another empty string. A non-empty search string is
not contained in an empty string.

```kwe
webata { nwereEriri, maliteNa, kwụsịNa } site na "kwechiri:eriri"

bipụta(nwereEriri("Kwechiri", "chiri"))
bipụta(maliteNa("Kwechiri", "Kwe"))
bipụta(kwụsịNa("Kwechiri", "chiri"))
```

The public names are provisional until the 1.0 terminology review. Batch 11A
does not include length, trimming, case conversion, slicing, replacement,
splitting, character access, or joining.
