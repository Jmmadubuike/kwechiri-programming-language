# Lexical grammar

Kwechiri source is text in `.kwe` files. Whitespace separates tokens and is
otherwise ignored outside strings.

Implemented tokens include identifiers, approved keywords, strings, decimal
numbers, arithmetic and comparison operators, assignment, parentheses,
braces, brackets, comma, colon, and dot.

Identifiers begin with a Unicode letter or `_` and continue with Unicode
letters, combining marks, numbers, or `_`. Approved multiword forms such as
`ọ bụrụ` and `site na` are parsed from their component keyword tokens.

Outside strings, `//` begins a single-line comment. It may immediately follow
another token, produces no tokens, and continues through the character before
LF or end of file. `/` remains division when it is not followed by `/`.
Block comments and nested comments are unsupported.

Strings use double quotes and cannot contain an actual line feed. Exactly five
escape sequences are recognized: `\n`, `\t`, `\r`, `\\`, and `\"`. Their
decoded values are newline, tab, carriage return, backslash, and double quote.
Any other escape is a located lexical error. String contents are never Unicode
normalized.

Numbers use base-10 digits with an optional fractional part after a period.
Exponent notation and numeric separators are unsupported.

Keywords and identifier names use NFC for lexical identity while tokens retain
their original source spelling and original offsets. The lexer does not
normalize the complete source text.

**Status: Undecided** — multiline strings and numeric extensions.
