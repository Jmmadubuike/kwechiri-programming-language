# String functions

The `kwechiri:eriri` module exports five provisionally named pre-1.0 APIs:

| Function | Signature | Meaning |
|---|---|---|
| `nwereEriri` | `(string, string) -> boolean` | first string contains the second |
| `maliteNa` | `(string, string) -> boolean` | first string starts with the second |
| `kwụsịNa` | `(string, string) -> boolean` | first string ends with the second |
| `ogologoEriri` | `(string) -> number` | count user-perceived characters |
| `jikọọEriri` | `(string, string) -> string` | join both strings exactly |

All functions are non-mutating and pure. They do not
coerce values or normalize either string. NFC and NFD string contents therefore
remain different raw sequences.

The empty string is contained in every string and is both a prefix and suffix
of every string, including another empty string. A non-empty search string is
not contained in an empty string.

```kwe
webata { nwereEriri, maliteNa, kwụsịNa, ogologoEriri, jikọọEriri } site na "kwechiri:eriri"

bipụta(nwereEriri("Kwechiri", "chiri"))
bipụta(maliteNa("Kwechiri", "Kwe"))
bipụta(kwụsịNa("Kwechiri", "chiri"))
bipụta(ogologoEriri("Ụbọchị"))
bipụta(jikọọEriri("Kwe", "chiri"))
```

`ogologoEriri` counts extended grapheme clusters. `ogologoEriri("")` is `0`,
and Igbo letters written with combining marks count as one user-perceived
character. Grapheme segmentation uses the host's Unicode implementation.

`jikọọEriri` concatenates raw strings exactly. It does not normalize, insert
separators, or coerce other values.

The public names are provisional until the 1.0 terminology review. Batch 11B
does not include trimming, case conversion, slicing, replacement, splitting,
character access, number conversion, or collection operations.
