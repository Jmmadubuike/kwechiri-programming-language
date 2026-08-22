# Milestone 8: Modules

## Status

Approved development specification for Kwechiri 0.1.0.

```kwe
webata { gbakọọ, pi } site na "./mgbakọ.kwe"
bipụta(gbakọọ(pi, 2))
```

Exported declarations use `bupụ`. Imports are named, read-only, relative `.kwe`
paths and must appear first. Files outside the entry project directory, missing
exports, duplicate imports/exports, and circular dependencies are errors.

Each dependency initializes once before its importer. Unexported declarations
remain private. Aliases, wildcard imports, re-exports, package resolution,
dynamic imports, and remote modules are not supported in this milestone.
