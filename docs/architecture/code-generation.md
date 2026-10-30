# Code generation

Code generation converts a `ResolvedProgram` into JavaScript source text. It
does not parse, resolve names, infer types, execute code, or write files.

## Program shape

Generated output contains resolved function declarations first, followed by the
module's resolved top-level statements. Functions use internal names and
parameter names assigned during semantic analysis. Program variables likewise
never expose their Kwechiri spelling as JavaScript binding names.

## Runtime boundary

Generated source expects `_kweRuntime` and `_kweStandardLibrary` in its
enclosing function scope.

| Kwechiri operation | Generated dependency |
| --- | --- |
| `bipụta` | `_kweRuntime.print(value, location)` |
| Division | `_kweRuntime.divide(left, right, location)` |
| Array read | `_kweRuntime.index(array, index, location)` |
| Array mutation | `_kweRuntime.setIndex(array, index, value, location)` |
| Standard Library call | `_kweStandardLibrary` intrinsic |

Property reads and existing-property writes use generated JavaScript property
access. Semantic analysis has already verified the object shape and value type.
Array literals and object literals use JavaScript literals with stable property
order from the resolved fields.

## Values and operators

- strings use JSON string encoding;
- numbers and Booleans use their JavaScript literal spelling;
- Kwechiri `efu` is represented as JavaScript `null` in generated programs;
- `na` and `maọbụ` become `&&` and `||` after Boolean type validation;
- `==` and `!=` become strict `===` and `!==`;
- unary `ọ bụghị` becomes `!`;
- arithmetic uses JavaScript operators after number validation.

These are backend choices, not extensions to the Kwechiri language contract.

## Statements and locations

Declarations and assignments emit `let` where semantic analysis requires a new
binding. Conditions emit hoisted declarations when needed. Index and print
operations include compact object literals containing line, column, and offset
so runtime failures can retain a Kwechiri source location.

Indentation is generated for readability. Output is deterministic for a given
resolved program and ends with a newline. The generator does not minify, bundle,
add source maps, or add a shebang.

## Execution boundary

The generated text is not directly a complete Node.js program. The runtime
layer supplies its dependencies. The CLI's compiled artifact adds a bootstrap
that imports the executor and runtime-error class from the originating
Kwechiri installation. See [CLI architecture](cli.md) and
[runtime architecture](runtime.md).
