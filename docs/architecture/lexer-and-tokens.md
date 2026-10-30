# Lexer and token model

The lexer converts UTF-8-decoded source text into a flat token sequence ending
with `EndOfFile`. It retains both raw source spelling and the NFC identity used
by later compiler stages.

## Token shape

Every token contains:

- `type`, from the `TokenType` enum;
- `lexeme`, the exact consumed source text;
- `canonicalLexeme`, the NFC form for identifiers and keywords when available;
- `literal`, for strings and numbers;
- `location`, with one-based line and column plus a zero-based source offset.

The parser receives no direct source text. Context that requires original
spelling comes from token lexemes and offsets. Module rewriting also uses token
offsets to preserve surrounding source text and Unicode spelling.

## Token categories

The implemented categories are identifiers, keywords, strings, decimal numbers,
operators, parentheses, braces, brackets, commas, colons, dots, and end of file.
The current keyword spellings are:

```text
bipụta ọ bụrụ ọzọ eziokwu ụgha efu mgbe ọrụ laghachi kwụsị gaa n'ihu
webata bupụ site na maọbụ bụghị
```

Keywords are case-sensitive and have no ASCII aliases. The apostrophe-bearing
`n'ihu` is recognized only as the approved keyword. Multiword constructs such
as `ọ bụrụ`, `gaa n'ihu`, and `site na` remain sequences of keyword tokens and
are combined by the parser or module preparation layer.

## Whitespace and comments

Whitespace separates tokens and is otherwise ignored. `//` skips through the
character before LF or end of file. Comment detection occurs outside strings.
Block and nested comments are unsupported.

## Strings and numbers

Strings are double-quoted and cannot cross a physical line. Exactly `\n`, `\t`,
`\r`, `\\`, and `\"` are decoded. Unknown or incomplete escapes are lexical
errors. String values are not Unicode-normalized.

Numbers contain base-10 digits with an optional fractional part consisting of a
period followed by at least one digit. Exponents, separators, and other numeric
forms are not recognized.

## Identifiers and Unicode

Identifiers begin with a Unicode letter or `_` and continue with Unicode
letters, combining marks, numbers, or `_`. Recognition uses JavaScript property
escapes and then applies NFC to the complete lexeme for keyword lookup and
identity.

The lexer currently advances through JavaScript UTF-16 code units. Line,
column, and offset are documented as UTF-16 code-unit measurements for 1.0.
Identifier scanning itself advances by Unicode code point, including astral
letters. Unicode 15.0.0 is the portable baseline under
[ADR-028](../design-decisions/ADR-028-unicode-identifier-profile.md).

## Failure ownership

The lexer owns unknown characters, malformed strings and escapes, and
unterminated input. It does not decide whether a keyword is valid in a
particular grammar position and does not resolve names. Lexical diagnostics
retain the source location at which scanning failed.
