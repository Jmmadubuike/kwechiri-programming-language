# Milestone 1 architecture

The initial vertical slice has separate compiler stages:

1. `lexer` converts UTF-8 source text into located tokens.
2. `parser` validates the Milestone 1 grammar and creates a typed AST.
3. `compiler/code-generator` converts the AST into JavaScript.
4. `runtime` executes generated JavaScript through Node.js.
5. `cli` reads a `.kwe` file and coordinates compilation and execution.

The lexer recognizes identifiers, strings, parentheses, braces, assignment,
and the `bipụta` keyword. Recognition does not mean every token has language
semantics yet; the parser deliberately accepts only the Hello World grammar.

Source locations are retained on tokens and AST nodes so later diagnostics can
refer to their original line and column.
