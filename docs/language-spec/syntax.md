# Syntax overview

Current top-level statements are variable assignment, `bipụta`, conditions,
loops, function declarations, and module declarations. Expressions include
literals, variable and property access, array indexing, function calls,
arithmetic, comparisons, logical operators, grouping, arrays, and objects.

Blocks use `{ ... }`. Parentheses group expressions and enclose conditions and
function arguments. Statements do not require semicolons.

Assignments may target a variable, an existing array index, or an existing
object property. Index and property assignment preserve collection type and do
not add or remove collection members.

The implemented control words are documented by topic. The canonical output
operation is `bipụta`.

This document is an overview, not a complete formal grammar. The parser and
topic specifications define the currently implemented subset.

Core value and logical vocabulary includes `efu`, `eziokwu`, `ụgha`, `na`,
`maọbụ`, and the multiword unary operator `ọ bụghị`. Line comments use `//`.

**Status: Undecided** — additional loop forms, break/continue, and all later
syntax listed in the roadmap.
