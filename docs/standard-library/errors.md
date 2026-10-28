# Standard Library diagnostics

Unknown `kwechiri:` modules and exports are controlled module diagnostics.
Duplicate imports and conflicts with filesystem imports, local variables, or
local functions use ordinary module collision rules.

Batch 11A predicates require exactly two strings. `ogologoEriri` requires one
string, and `jikọọEriri` requires two. Wrong arity and statically known wrong
types are located semantic errors. No coercion occurs, and no raw JavaScript
exception defines Standard Library behavior.

All five current string functions have no runtime value-error or
platform-error case. Later value-checking or capability-backed APIs require
separately approved error categories and contracts.
