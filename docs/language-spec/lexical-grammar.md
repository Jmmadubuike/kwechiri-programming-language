# Lexical grammar

Kwechiri source is UTF-8 text in `.kwe` files. Whitespace separates tokens and
is otherwise ignored outside strings.

Implemented tokens include identifiers, approved keywords, strings, decimal
numbers, arithmetic and comparison operators, assignment, parentheses,
braces, brackets, comma, colon, and dot.

Identifiers begin with a Unicode letter or `_` and continue with Unicode
letters, combining marks, numbers, or `_`. Approved multiword forms such as
`ọ bụrụ` and `site na` are parsed from their component keyword tokens.

Strings use double quotes, cannot cross a line, and currently have no escape
syntax. Numbers use base-10 digits with an optional fractional part after a
period. Exponent notation and numeric separators are unsupported.

Comments are not implemented.

**Status: Undecided** — comment syntax, string escapes, multiline strings,
numeric extensions, and Unicode normalization.
