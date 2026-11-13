# Lexical grammar

Kwechiri source is valid UTF-8 text in `.kwe` files. Malformed byte sequences
are rejected before lexing. Whitespace separates tokens and is otherwise
ignored outside strings.

Implemented tokens include identifiers, approved keywords, strings, decimal
numbers, arithmetic and comparison operators, assignment, parentheses,
braces, brackets, comma, colon, and dot.

Identifiers begin with a Unicode letter or `_` and continue with Unicode
letters, combining marks, numbers, or `_`. Approved multiword forms such as
`ọ bụrụ`, `gaa n'ihu`, and `site na` are parsed from their component keyword
tokens. The apostrophe-bearing `n'ihu` component is recognized only as the
approved keyword; this does not expand the ordinary identifier grammar.

Identifiers are scanned by Unicode code point. The guaranteed portable Unicode
baseline is 15.0.0; later host data may accept additional letters without
weakening the portable contract.

Outside strings, `//` begins a single-line comment. It may immediately follow
another token, produces no tokens, and continues through the character before
LF or end of file. `/` remains division when it is not followed by `/`.
Block comments and nested comments are unsupported.

Strings use double quotes and cannot contain an actual line feed. Exactly five
escape sequences are recognized: `\n`, `\t`, `\r`, `\\`, and `\"`. Their
decoded values are newline, tab, carriage return, backslash, and double quote.
Any other escape is a located lexical error. String contents are never Unicode
normalized.

Multiline strings are delimited by three double quotes (`"""`). They may span
physical lines and keep those line feeds in the decoded value. The five
single-line escape sequences remain available inside a multiline string; a
literal line feed is written directly. The string ends at the next unescaped
`"""`. A multiline string that reaches end of file is a located lexical error.

Numbers use base-10 digits with an optional fractional part after a period.
Exponent notation and numeric separators are unsupported.

Keywords and identifier names use NFC for lexical identity while tokens retain
their original source spelling and original offsets. The lexer does not
normalize the complete source text.

`kwụsị`, `gaa`, and `n'ihu` are reserved control-flow vocabulary. Keywords
remain case-sensitive, and no ASCII aliases exist. `maka` is not reserved by
this Control Flow contract.

Numeric extensions are deferred beyond 1.0.
