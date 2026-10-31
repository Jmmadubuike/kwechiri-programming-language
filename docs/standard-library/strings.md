# String functions

The `kwechiri:eriri` module exports nine string APIs:

| Function | Signature | Meaning |
|---|---|---|
| `nwereEriri` | `(string, string) -> boolean` | first string contains the second |
| `maliteNa` | `(string, string) -> boolean` | first string starts with the second |
| `kwụsịNa` | `(string, string) -> boolean` | first string ends with the second |
| `ogologoEriri` | `(string) -> number` | count user-perceived characters |
| `jikọọEriri` | `(string, string) -> string` | join both strings exactly |
| `wepuOghere` | `(string) -> string` | remove surrounding Unicode whitespace |
| `okwuNta` | `(string) -> string` | convert to lowercase |
| `okwuNnukwu` | `(string) -> string` | convert to uppercase |
| `dochieEriri` | `(string, string, string) -> string` | replace every exact occurrence |

All functions are non-mutating and pure. They do not
coerce values or normalize either string. NFC and NFD string contents therefore
remain different raw sequences.

The empty string is contained in every string and is both a prefix and suffix
of every string, including another empty string. A non-empty search string is
not contained in an empty string.

```kwe
webata { nwereEriri, maliteNa, kwụsịNa, ogologoEriri, jikọọEriri, wepuOghere, okwuNta, okwuNnukwu, dochieEriri } site na "kwechiri:eriri"

bipụta(nwereEriri("Kwechiri", "chiri"))
bipụta(maliteNa("Kwechiri", "Kwe"))
bipụta(kwụsịNa("Kwechiri", "chiri"))
bipụta(ogologoEriri("Ụbọchị"))
bipụta(jikọọEriri("Kwe", "chiri"))
bipụta(wepuOghere("  Kwechiri  "))
bipụta(okwuNta("ỤBỌCHỊ"))
bipụta(okwuNnukwu("ọma"))
bipụta(dochieEriri("Kwechiri", "chiri", "Kwe"))
```

`ogologoEriri` counts extended grapheme clusters. `ogologoEriri("")` is `0`,
and Igbo letters written with combining marks count as one user-perceived
character. Grapheme segmentation uses the host's Unicode implementation.

`jikọọEriri` concatenates raw strings exactly. It does not normalize, insert
separators, or coerce other values.

`wepuOghere` removes leading and trailing Unicode White_Space but preserves
interior whitespace. `okwuNta` and `okwuNnukwu` apply locale-independent Unicode
default case mapping without normalization. `dochieEriri` replaces every
non-overlapping literal occurrence; matching is case-sensitive, and an empty
search string returns the input unchanged.

The five original names are frozen for 1.0 by ADR-027. Batch 11C adds the four
transformations under Milestone 15. Slicing, splitting, character access,
number conversion, and collection operations remain unsupported.
