# Module graph architecture

Multi-file compilation begins at the requested entry file. The loader
canonicalizes the entry and its directory, then recursively resolves each
relative `.kwe` dependency. Every resolved file is canonicalized before
containment, cycle, or cache decisions.

```text
raw relative request
  -> lexical path-form validation
  -> resolved host path
  -> canonical filesystem path
  -> canonical-root containment
  -> cycle/cache lookup
  -> dependency-first source loading
  -> import/export validation and namespacing
  -> ordinary compiler pipeline
```

The canonical path is private module identity. Cache hits reuse the prior
module result, so normalized and symlink aliases execute one physical file only
once. The active canonical-path stack detects direct and indirect cycles and
provides their dependency chain.

Imports map a source binding name to its internal namespaced binding. That
representation can later carry a distinct local alias without changing path
security, identity, or caching, but the language currently has no alias syntax.
The loader emits dependencies before importers and exposes no public cache API.
