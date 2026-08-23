# Modules

Named imports use `webata { ... } site na "./file.kwe"`. Declarations are
exported with `bupụ`.

Imports must precede other statements, are read-only, and use relative `.kwe`
paths within the entry project directory. Modules initialize once in dependency
order. Private declarations are namespaced. Duplicate imports/exports, missing
exports, path escape, missing files, and circular dependencies are errors.

Top-level module output is allowed and runs once.

Imported and exported bindings may carry any implemented value, including
`efu`. Because `efu`, `maọbụ`, and `bụghị` are reserved vocabulary, they cannot
serve as binding names. The existing contextual `site na` grammar is unchanged.

An imported binding cannot be rebound. Imported arrays and objects are not
transitively immutable, however: their existing elements or properties may be
mutated under ordinary collection type and bounds rules. Imports and exports do
not copy collections, so shared identity is preserved across modules.

**Status: Undecided** — aliases, wildcard imports, re-exports, packages, remote
modules, dynamic imports, and cross-project resolution.
