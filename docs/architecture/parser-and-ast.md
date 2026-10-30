# Parser and AST

The parser is a recursive-descent parser over the lexer token sequence. It
constructs immutable AST node objects and leaves semantic meaning to the next
stage.

## AST roots

`Program` contains an ordered list of statements. Expressions and statements use
discriminated unions keyed by `kind`; nodes carry source locations where later
stages need them for diagnostics.

Statement kinds:

- print and variable assignment;
- index and property assignment;
- conditional and loop statements;
- top-level function declarations;
- return, break, and continue.

Expression kinds:

- string, number, Boolean, and absence literals;
- variable references, calls, arrays, and objects;
- unary, arithmetic, comparison, and logical expressions;
- checked index and property access.

Import and export directives are not AST nodes. The filesystem and playground
module preparation layers recognize and remove them before parsing. This keeps
the parser focused on the executable program source that remains.

## Precedence

Expression parsing implements the approved precedence from strongest to
weakest:

1. primary and postfix index/property access;
2. unary `-` and `ọ bụghị`;
3. multiplication and division;
4. addition and subtraction;
5. ordering comparisons;
6. equality comparisons;
7. `na`;
8. `maọbụ`.

Unary operators are right-associative. Arithmetic and logical operators are
parsed iteratively and associate left. Ordering and equality accept at most one
comparison at their tier, so chained forms are rejected with a located syntax
error.

## Statement structure

Assignments start with an identifier followed by a postfix target and `=`.
Blocks use braces. Conditions and loops require parentheses. `ọ bụrụ` accepts
one optional `ọzọ` block. `gaa` must be followed by `n'ihu`. `bipụta` and calls
use parenthesized argument lists.

The parser enforces grammar shape but not contextual rules. For example, it can
parse `laghachi` at module level and `kwụsị` outside a loop; semantic analysis
rejects those placements. It also does not enforce types, function placement,
duplicate names, or reachability.

## Identifier identity

Parser-created names use the token's NFC `canonicalLexeme`. Source spelling is
retained on the token and in node locations for diagnostics and source
rewriting but is not used as binding identity.

## Current limitations

- There are no dedicated import/export, type-annotation, or `maka` nodes.
- Empty arrays parse structurally but are rejected during type resolution.
- The parser file contains the complete statement and expression grammar; this
  concentration is recorded technical debt.
