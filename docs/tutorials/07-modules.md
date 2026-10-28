# Lesson 7: Modules

## Goal

Split a program across multiple `.kwe` files, export selected names, import
them explicitly, and understand read-only bindings versus shared collection
contents.

## Before you begin

Complete [Lesson 6](06-arrays-and-objects.md) or make sure the compiler is
already built.

## Create two files

Create `aha.kwe`:

```kwe
bupụ aha = "Ada"
bupụ ndepụta = ["Uche", "Ada"]

bupụ ọrụ kelee(okwu) {
    laghachi okwu
}

nzuzo = "Nke a abụghị nke e bupụrụ"
```

Create `main.kwe` in the same directory:

```kwe
webata { aha, kelee, ndepụta } site na "./aha.kwe"

bipụta(kelee(aha))

ndepụta[1] = "Obi"
bipụta(ndepụta)
```

Run the entry file:

```sh
node dist/cli/index.js main.kwe
```

Expected output:

```text
Ada
["Uche","Obi"]
```

## Exports

Only declarations prefixed with `bupụ` are visible to another module. `nzuzo`
is private and cannot be imported from `aha.kwe`.

## Imports

The importer names each visible binding explicitly:

```kwe
webata { aha, kelee, ndepụta } site na "./aha.kwe"
```

Imports must come before other statements. Paths are relative, end in a
lowercase `.kwe` extension, and resolve from the importing file. Bare package
names, absolute paths, remote paths, and directory imports are invalid.

Dependencies initialize before the files importing them. Direct and indirect
cycles are errors.

## Read-only bindings, shared values

An imported name cannot be assigned a different value:

```kwe
aha = "Obi" # error: imported binding is read-only
```

Collections are not deeply immutable or copied. The imported `ndepụta` binding
cannot be replaced, but its existing element can be changed under the ordinary
array rules. The mutation is visible through every reference to that collection.

## Exercise

Change `aha` in `aha.kwe` to another string and observe the output. Then try to
import `nzuzo` and explain why the module loader rejects it.

## Common problems

- Use the exact `webata { ... } site na "./file.kwe"` form.
- Change the exported name `bupụ` and import name `webata`.
- Keep import paths relative and explicit.
- Do not assign a new value to an imported binding.
- Mutating an imported collection element is different from rebinding the name.

## Normative references

- [Modules](../language-spec/modules.md)
- [Module architecture](../architecture/modules.md)
- [Hardened module semantics](../design-decisions/ADR-019-module-semantics.md)
- [Current language errors](../language-spec/errors.md)

## Next

Continue with [Lesson 8](08-standard-library-strings.md), which introduces the
explicitly imported `kwechiri:eriri` Standard Library module.
