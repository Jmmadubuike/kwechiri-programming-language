# Errors and diagnostics

Lexical, syntax, semantic, module, and runtime failures are Kwechiri errors.
Diagnostics preserve available filename, line, column, source offset, token,
and category information. Public codes identify stable diagnostic conditions.
Messages are Igbo-first with an English explanation where available.

Located diagnostics use:

```text
<filename>:<line>:<column>: KWE-<CATEGORY>-<NNN>: <message>
```

The complete stable catalog is the
[diagnostic catalog](error-catalog.md). Line, column, and offset use UTF-16
code units.

Undefined names, invalid types, control-flow inconsistencies, module failures,
division by zero, and dynamic index failures are diagnosed by their responsible
compiler or runtime layer. Raw JavaScript errors should not define language
behaviour.

Controlled module diagnostics cover invalid path forms and extensions, missing
imports or exports, canonical paths outside the entry root (including symlink
escapes), duplicate imports or exports, imported/local name collisions,
read-only imported-binding reassignment, and direct or indirect cycles. Cycle
diagnostics include the dependency chain where available. Requested raw module
path spelling is retained in path diagnostics where practical.

Standard Library imports diagnose unknown `kwechiri:` modules and exports.
Cataloged calls diagnose wrong arity and statically known argument-type
mismatches at their Kwechiri source locations. Pure Batch 11A predicates do not
expose raw host exceptions.

`kwụsị` and `gaa n'ihu` outside loops are located semantic errors. A statement
unconditionally following `laghachi`, `kwụsị`, or `gaa n'ihu` in the same block
is an unreachable-code error. Malformed `gaa n'ihu` syntax is a controlled
lexical or syntax diagnostic at the relevant source location.

The public code catalog and compatibility rules are approved in
[ADR-027](../design-decisions/ADR-027-1.0-compatibility-and-diagnostics.md).
Automatic suggestions are not implemented. Bilingual coverage may improve
without changing a code.
