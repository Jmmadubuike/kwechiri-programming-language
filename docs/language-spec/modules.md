# Modules

Named imports use `webata { ... } site na "./file.kwe"`. Declarations are
exported with `bupụ`. Imports must precede all other statements.

Import paths must be relative and have an explicit lowercase `.kwe` extension.
Absolute paths, bare specifiers, directory imports, extensionless paths, and
remote paths are invalid. A `../` segment is valid only when its canonical
target remains within the canonical entry directory.

The loader uses canonical filesystem identity for containment and caching. One
physical canonical file is one module instance per program graph, even when
normalized path variants or supported symlink aliases name it differently.
Each module initializes once, after its dependencies. Direct and indirect
cycles are rejected; partially initialized cyclic bindings do not exist.

Top-level module output is allowed and runs once. Only explicitly `bupụ`
declarations are visible to importers; all other top-level variables and
functions remain private.

Imported bindings are read-only, including primitive, function, and collection
bindings. Imported arrays and objects are not deeply immutable: existing
elements and properties may be mutated under ordinary collection type and
bounds rules. Imports and exports do not copy collections, so shared identity
and mutations are visible across the graph.

An imported name cannot also be declared as a local variable or function,
exported as a conflicting local declaration, or imported again. These rules use
the same NFC, case-sensitive binding identity as the rest of the language.

There is no dedicated re-export or barrel-module syntax. Forwarding requires an
ordinary explicit local declaration or wrapper where current language rules
permit it. Import aliases remain deferred pending owner approval of exact
grammar and Igbo terminology. Bare specifiers are reserved for a future package
system; packages, wildcard imports, remote modules, dynamic imports, and
cross-project resolution are unsupported.

Module path strings and filenames are not NFC-normalized. Canonical filesystem
identity is separate from Kwechiri identifier normalization.
