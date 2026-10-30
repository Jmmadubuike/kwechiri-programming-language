# Kwechiri 1.0 language surface inventory

Status: Approved for the Kwechiri 1.0 freeze, 2026-10-30

Last updated: 2026-10-30

This inventory records the implemented surface frozen for 1.0. It does not add
a keyword, operator, Standard Library function, or compatibility rule.

## Identity and source

| Item | Current value | Status |
| --- | --- | --- |
| Language name | Kwechiri | Established by ADR-001 |
| Source extension | `.kwe` | Established by ADR-002 |
| Compiler host | Node.js | First host; browser worker is a separate runtime host |
| Compiler language | TypeScript | Implementation choice |
| Output target | JavaScript | Established by ADR-003 |
| Source encoding | Valid UTF-8 | Malformed bytes rejected as a source diagnostic |
| Name identity | NFC, case-sensitive | Code-point profile fixed by ADR-028 |
| ASCII aliases | None | Established |

## Keyword tokens

These spellings are reserved by the canonical lexer:

| Spelling | Current role |
| --- | --- |
| `bipụta` | Output operation |
| `ọ` | First word of `ọ bụrụ`, `ọ bụghị` |
| `bụrụ` | Second word of `ọ bụrụ` |
| `ọzọ` | Optional else branch |
| `eziokwu` | Boolean true |
| `ụgha` | Boolean false |
| `efu` | Explicit absence |
| `mgbe` | Pre-condition loop |
| `ọrụ` | Named function declaration |
| `laghachi` | Function return |
| `kwụsị` | Exit nearest loop |
| `gaa` | First word of `gaa n'ihu` |
| `n'ihu` | Second word of `gaa n'ihu` |
| `webata` | Start named import |
| `bupụ` | Export declaration |
| `site` | First word of `site na` |
| `na` | Boolean conjunction; second word of `site na` |
| `maọbụ` | Boolean disjunction |
| `bụghị` | Second word of `ọ bụghị` |

`maka` is not reserved or implemented. Keywords are case-sensitive.

## Multiword forms

| Form | Role |
| --- | --- |
| `ọ bụrụ` | Conditional branch |
| `ọ bụghị` | Boolean negation |
| `gaa n'ihu` | Continue nearest loop |
| `site na` | Import location |

## Values and operators

Primitive values:

- strings;
- floating-point numbers;
- `eziokwu` and `ụgha`;
- `efu`.

Collection values:

- homogeneous, non-empty arrays with checked indexing;
- fixed-shape objects with identifier properties.

Operators:

| Spelling | Role |
| --- | --- |
| `=` | Variable, existing-index, or existing-property assignment |
| `+` `-` `*` `/` | Number arithmetic |
| `-` (unary) | Number negation |
| `==` `!=` | Strict supported-value comparison |
| `<` `<=` `>` `>=` | Number ordering |
| `na` | Boolean conjunction with short-circuiting |
| `maọbụ` | Boolean disjunction with short-circuiting |
| `ọ bụghị` | Boolean negation |

There is no implicit truthiness, coercion, string concatenation operator,
collection equality, modulo, or exponentiation.

## Statements and declarations

- variable assignment;
- `bipụta(expression)`;
- `ọ bụrụ (condition) { ... }` with optional `ọzọ { ... }`;
- `mgbe (condition) { ... }`;
- `kwụsị` and `gaa n'ihu`;
- top-level `ọrụ name(parameters) { ... }`;
- `laghachi expression`;
- `webata { names } site na "path.kwe"`;
- `bupụ` declarations.

Statements do not use semicolons. Function declarations are module-top-level
only. Imports precede other non-comment statements.

## Standard Library

The only implemented Standard Library module is `kwechiri:eriri`.

| Name | Arity | Parameters | Return |
| --- | ---: | --- | --- |
| `nwereEriri` | 2 | string, string | boolean |
| `maliteNa` | 2 | string, string | boolean |
| `kwụsịNa` | 2 | string, string | boolean |
| `ogologoEriri` | 1 | string | number |
| `jikọọEriri` | 2 | string, string | string |

These names are frozen for 1.0 by ADR-027; ADR-021 records their provisional
pre-1.0 origin. No other Standard Library module or function is authorized.

## Command-line surface

```text
kwechiri <file.kwe>
kwechiri run <file.kwe>
kwechiri check <file.kwe>
kwechiri compile <file.kwe> [--out <file.js>] [--force]
kwechiri --help
kwechiri --version
```

The current exit-code contract is `0` success, `1` Kwechiri failure, `2` invalid
usage, `3` filesystem/host failure, and `4` unexpected internal failure. The
shorthand is equivalent to `run`.

## Explicit 1.0 exclusions

- multiline strings and numeric extensions;
- `maka` and collection iteration;
- typed empty arrays and explicit public type syntax;
- collection equality, copying operations, methods, spread, and computed
  properties;
- recursion, closures, nested or first-class functions, defaults, annotations,
  overloads, and generics;
- import aliases, re-exports, wildcards, packages, and remote modules;
- additional Standard Library modules or functions;
- host I/O, filesystem, network, input, or date/time APIs in Kwechiri source.

## Owner approval

The owner approved this surface and its explicit exclusions on 2026-10-30.
The identifier, UTF-8, source-coordinate, and diagnostic decisions are recorded
in ADR-027 and ADR-028.
