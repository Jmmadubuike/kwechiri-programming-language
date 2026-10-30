# Stable diagnostic catalog

Status: Approved for Kwechiri 1.0, 2026-10-30

This catalog defines the public diagnostic code families for Kwechiri 1.0.
Every code uses the form:

```text
KWE-<CATEGORY>-<NNN>
```

The categories are lexical (`LEX`), syntax (`SYN`), module (`MOD`), Standard
Library (`STD`), semantic (`SEM`), runtime (`RUN`), command-line (`CLI`),
filesystem (`IO`), and internal (`INT`).

## Presentation

Located compile-time and runtime errors use:

```text
<filename>:<line>:<column>: <code>: <message>
```

CLI usage errors use:

```text
KWECHIRI USAGE ERROR
<code>: <message>
```

Filesystem and internal failures use the same code-first detail under their
existing CLI headings. Messages are currently Igbo-first with an English
parenthetical explanation. A code identifies the diagnostic condition; dynamic
names, types, paths, and locations may appear in the message.

Source coordinates are one-based line and column values measured in UTF-16 code
units. The zero-based offset is also a UTF-16 code-unit offset. This is the
stable Kwechiri 1.0 coordinate contract.

The compiler currently provides no automatic suggestions. Unknown compiler
errors do not become public codes: they are reported as `KWE-INT-001`.

## Lexical diagnostics

| Code | Condition | English summary |
| --- | --- | --- |
| `KWE-LEX-001` | Character cannot begin a token | Unknown character |
| `KWE-LEX-002` | String reaches end of file | Unterminated string |
| `KWE-LEX-003` | String contains a physical newline | String crosses a line |
| `KWE-LEX-004` | Backslash reaches end of file | Unterminated escape |
| `KWE-LEX-005` | Escape is not one of the five approved forms | Unknown escape |

## Syntax diagnostics

| Code | Condition | English summary |
| --- | --- | --- |
| `KWE-SYN-001` | Required token or delimiter is missing or different | Unexpected or missing token |
| `KWE-SYN-002` | No expression begins at the current token | Expected expression |
| `KWE-SYN-003` | Invalid `ọ bụghị` form | Invalid negation |
| `KWE-SYN-004` | More than one ordering or equality comparison is chained | Chained comparison is unsupported |
| `KWE-SYN-005` | Assignment target is not supported | Invalid assignment target |
| `KWE-SYN-006` | Reserved word has no approved statement form | Unsupported statement |

## Module diagnostics

| Code | Condition | English summary |
| --- | --- | --- |
| `KWE-MOD-001` | Module or entry path lacks lowercase `.kwe` | Invalid module extension |
| `KWE-MOD-002` | Imported file does not exist | Missing module |
| `KWE-MOD-003` | Canonical path escapes the entry directory | Module escapes the project |
| `KWE-MOD-004` | Module path does not identify a file | Module is not a file |
| `KWE-MOD-005` | Dependency graph contains a cycle | Circular dependency |
| `KWE-MOD-006` | Import appears after a body statement | Imports must come first |
| `KWE-MOD-007` | Specifier is neither relative nor Standard Library | Unsupported module specifier |
| `KWE-MOD-008` | Same name is imported more than once | Duplicate import |
| `KWE-MOD-009` | Filesystem module does not export a requested name | Missing export |
| `KWE-MOD-010` | Same name is exported more than once | Duplicate export |
| `KWE-MOD-011` | Imported name collides with a local declaration | Import/local collision |
| `KWE-MOD-012` | Export names an undeclared local | Undeclared export |
| `KWE-MOD-013` | Assignment targets an imported binding | Read-only import |
| `KWE-MOD-014` | Playground input uses a filesystem import | Filesystem modules unavailable |
| `KWE-MOD-015` | Source bytes are not valid UTF-8 | Invalid UTF-8 source |

## Standard Library diagnostics

| Code | Condition | English summary |
| --- | --- | --- |
| `KWE-STD-001` | `kwechiri:` module is unknown | Unknown Standard Library module |
| `KWE-STD-002` | Standard module does not export a requested name | Unknown Standard Library export |
| `KWE-STD-003` | Standard function receives the wrong number of arguments | Wrong Standard Library argument count |
| `KWE-STD-004` | Statically known standard argument has the wrong type | Standard Library argument type mismatch |

## Semantic diagnostics

| Code | Condition | English summary |
| --- | --- | --- |
| `KWE-SEM-001` | Name is unavailable in the current scope | Undefined variable |
| `KWE-SEM-002` | Function name is declared twice | Duplicate function |
| `KWE-SEM-003` | Parameter name is repeated | Duplicate parameter |
| `KWE-SEM-004` | Function is declared inside another block | Unsupported nested function |
| `KWE-SEM-005` | Function is called before its declaration | Function used before declaration |
| `KWE-SEM-006` | Direct or mutual recursion is attempted | Recursion unsupported |
| `KWE-SEM-007` | User function receives the wrong number of arguments | Wrong argument count |
| `KWE-SEM-008` | `kwụsị` or `gaa n'ihu` has no enclosing loop | Loop control outside loop |
| `KWE-SEM-009` | Array literal is empty | Empty array unsupported |
| `KWE-SEM-010` | Array literal elements have different types | Mixed array element types |
| `KWE-SEM-011` | Object property name is repeated | Duplicate object property |
| `KWE-SEM-012` | Indexing targets a non-array | Indexing requires array |
| `KWE-SEM-013` | Property access targets a non-object | Property access requires object |
| `KWE-SEM-014` | Object has no requested property | Missing property |
| `KWE-SEM-015` | `ọ bụghị` receives a non-Boolean | Negation requires Boolean |
| `KWE-SEM-016` | Unary minus receives a non-number | Unary minus requires number |
| `KWE-SEM-017` | Arithmetic receives a non-number | Arithmetic requires numbers |
| `KWE-SEM-018` | Logical operator receives a non-Boolean | Logical operator requires Booleans |
| `KWE-SEM-019` | Equality compares a collection | Collection equality unsupported |
| `KWE-SEM-020` | Ordering receives a non-number | Ordering requires numbers |
| `KWE-SEM-021` | `laghachi` appears outside a function | Return outside function |
| `KWE-SEM-022` | Index assignment targets a non-array | Index assignment requires array |
| `KWE-SEM-023` | Index assignment value has the wrong type | Index assignment type mismatch |
| `KWE-SEM-024` | Property assignment targets a non-object | Property assignment requires object |
| `KWE-SEM-025` | Property assignment value has the wrong type | Property assignment type mismatch |
| `KWE-SEM-026` | `mgbe` condition is not Boolean | Loop condition requires Boolean |
| `KWE-SEM-027` | Loop changes a carried variable's type | Loop variable type mismatch |
| `KWE-SEM-028` | Conditional condition is not Boolean | Condition requires Boolean |
| `KWE-SEM-029` | Both branches bind one name with different types | Branch types differ |
| `KWE-SEM-030` | Later call differs from the first inferred signature | Function signature mismatch |
| `KWE-SEM-031` | Concrete return conflicts with fallthrough `efu` | Return/fallthrough conflict |
| `KWE-SEM-032` | Reachable returns have different types | Return types differ |
| `KWE-SEM-033` | Statement follows an unconditional return | Unreachable after return |
| `KWE-SEM-034` | Statement follows an unconditional loop transfer | Unreachable after transfer |
| `KWE-SEM-035` | Array index expression is not a number | Index is not a number |
| `KWE-SEM-036` | Statically known index is invalid or out of range | Static index out of range |

## Runtime diagnostics

| Code | Condition | English summary |
| --- | --- | --- |
| `KWE-RUN-001` | Division has a zero divisor | Division by zero |
| `KWE-RUN-002` | Dynamic array index is invalid or out of range | Runtime index out of range |

## CLI and host diagnostics

| Code | Condition | English summary |
| --- | --- | --- |
| `KWE-CLI-001` | Source path lacks lowercase `.kwe` | Invalid source extension |
| `KWE-CLI-002` | Command form or argument count is invalid | Invalid command usage |
| `KWE-CLI-003` | Unknown option is supplied | Unknown option |
| `KWE-CLI-004` | Same option is supplied more than once | Duplicate option |
| `KWE-CLI-005` | Option requiring a value has none | Missing option value |
| `KWE-CLI-006` | `--out` value lacks lowercase `.js` | Invalid output extension |
| `KWE-CLI-007` | Unexpected positional argument is supplied | Unexpected argument |
| `KWE-CLI-008` | `--help` receives arguments | Help arguments unsupported |
| `KWE-CLI-009` | `--version` receives arguments | Version arguments unsupported |
| `KWE-CLI-010` | Output resolves to the source file | Output equals source |
| `KWE-IO-001` | Recognized filesystem operation fails | Filesystem failure |
| `KWE-INT-001` | Unexpected compiler or CLI defect occurs | Internal failure |

## Compatibility

Within Kwechiri 1.x:

- an existing code keeps its diagnostic condition and stage;
- a new condition may receive a new code in a minor release;
- message wording may improve without changing the code;
- a code is not reused for a different condition;
- removing or redefining a code requires a major release.

Diagnostics are part of the public CLI and editor contract. See
[ADR-027](../design-decisions/ADR-027-1.0-compatibility-and-diagnostics.md).
