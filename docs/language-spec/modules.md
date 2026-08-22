# Modules

Named imports use `webata { ... } site na "./file.kwe"`. Declarations are
exported with `bupụ`.

Imports must precede other statements, are read-only, and use relative `.kwe`
paths within the entry project directory. Modules initialize once in dependency
order. Private declarations are namespaced. Duplicate imports/exports, missing
exports, path escape, missing files, and circular dependencies are errors.

Top-level module output is allowed and runs once.

**Status: Undecided** — aliases, wildcard imports, re-exports, packages, remote
modules, dynamic imports, and cross-project resolution.
