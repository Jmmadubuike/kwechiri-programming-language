# Kwechiri Standard Library

Milestone 11 provides explicitly imported, specified Kwechiri APIs. It is not a
translation layer over JavaScript. `bipụta` remains a language/runtime
built-in; other approved APIs live in reserved `kwechiri:` modules.

Batch 11A introduced one module:

- [`kwechiri:eriri`](strings.md) — three pure string predicates

Batch 11B extends the same module with grapheme-aware string length and exact
raw-string concatenation.

See also:

- [Standard module resolution](modules.md)
- [Standard Library diagnostics](errors.md)

No trimming, case conversion, slicing, replacement, splitting, character
access, number, collection, conversion, JSON, I/O, network, random, or date/time
API is included in Batch 11B.
