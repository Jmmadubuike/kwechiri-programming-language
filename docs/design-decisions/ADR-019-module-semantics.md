# ADR-019: Hardened module semantics

## Context

Milestone 8 established named relative modules, but lexical path normalization
does not prove filesystem containment and can treat aliases of one physical
file as separate modules. The pre-1.0 contract also needs consistent collision,
visibility, initialization, and imported-binding rules.

## Options considered

1. Preserve lexical path identity and document symlink limitations.
2. Use canonical filesystem identity while preserving the existing syntax.
3. Adopt host package resolution and JavaScript-style cyclic modules.

## Decision

Use canonical filesystem identity. The entry directory and every resolved
module file are canonicalized. A target must remain inside the canonical entry
root, and the canonical file path keys cycle detection and the per-program
module cache. One physical file is therefore one module instance, executes once,
and initializes after its dependencies.

Imports retain the existing `webata { ... } site na "./file.kwe"` form. Paths
must be relative, explicit, lowercase `.kwe` paths. Contained `../` traversal is
allowed; absolute, bare, directory, extensionless, remote, and out-of-root paths
are rejected. Filesystem path strings are not Unicode-normalized.

Only explicit `bupụ` declarations are visible. Imported names are read-only,
but imported collection contents remain mutable shared references. Imported
names may not collide with local variables, local functions, exports, or other
imports. Direct and indirect dependency cycles are errors rather than partially
initialized graphs.

There is no dedicated re-export syntax. Import aliases remain deferred pending
owner approval of grammar and Igbo terminology. Bare specifiers are reserved
for a future package design; no package resolution is implemented.

## Consequences

Symlinks cannot bypass the project boundary, normalized and symlink aliases do
not duplicate execution, and shared exported collections retain one identity.
Module loading remains a private compiler concern and does not change the
compiler public API or runtime interface. Canonical identity depends on host
filesystem resolution, while source diagnostics preserve requested path spelling
where practical.
