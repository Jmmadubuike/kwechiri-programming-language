# Collections

Arrays use `[...]`, are zero-indexed, non-empty, and homogeneous. Array type is
defined recursively by element type; length is not part of semantic type.
Consequently, coherent jagged arrays such as `[[1], [2, 3]]` are valid. Known
invalid indexes are compile-time errors; dynamic invalid indexes are located
runtime errors. A valid index is a finite, non-negative integer within bounds.

An existing element may be assigned with `items[index] = value` when the value
has exactly the array element type. Assignment does not resize the array.

Objects use `{ key: value }`. Property names are unique Unicode identifiers and
are accessed with dot syntax. Missing properties are compile-time errors.
Objects have fixed structural shapes. Existing properties may be assigned with
`object.property = value` when the value has exactly the property's established
type. Assignment cannot add properties. Nested coherent collections are
supported.

Explicit `efu` values may be stored in arrays when the homogeneous element rule
is satisfied and in object properties. Missing properties and invalid indexes
remain errors; they do not evaluate to `efu`.

`bipụta` formats collections in a stable JSON-like form using Kwechiri
`eziokwu`, `ụgha`, and `efu` spellings for nested core values.

Arrays and objects have reference semantics. Assignment, function calls,
function returns, imports, and exports do not copy collections. Mutation through
one alias is observable through every alias. Imported names remain read-only
bindings, but an imported collection is not transitively immutable.

The compact output is the Kwechiri collection display format, not JSON. Arrays
use brackets, objects use braces, punctuation has no optional whitespace,
strings and property names use JSON-compatible quoting and escaping, properties
remain in construction order, and nested values use Kwechiri formatting.

Collection equality and inequality are unsupported, including comparison of a
collection with itself. Kwechiri defines neither reference equality nor deep
equality for collections.

Typed empty construction, computed properties, spread syntax, explicit
copying, and collection methods are deferred beyond 1.0.
