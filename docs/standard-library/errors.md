# Standard Library diagnostics

Unknown `kwechiri:` modules and exports are controlled module diagnostics.
Duplicate imports and conflicts with filesystem imports, local variables, or
local functions use ordinary module collision rules.

Batch 11A predicates require exactly two strings. `ogologoEriri` requires one
string, and `jikọọEriri` requires two. Wrong arity and statically known wrong
types are located semantic errors. No coercion occurs, and no raw JavaScript
exception defines Standard Library behavior.

| Code | Condition |
| --- | --- |
| `KWE-STD-001` | Unknown `kwechiri:` module |
| `KWE-STD-002` | Unknown Standard Library export |
| `KWE-STD-003` | Wrong Standard Library argument count |
| `KWE-STD-004` | Statically known argument type mismatch |

The complete public diagnostic contract is in the
[diagnostic catalog](../language-spec/error-catalog.md).

All five current string functions have no runtime value-error or
platform-error case. Later value-checking or capability-backed APIs require
separately approved error categories and contracts.
