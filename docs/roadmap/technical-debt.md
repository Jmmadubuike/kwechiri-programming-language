# Recorded technical debt

These concerns were identified before Milestone 10. They are not stabilization
blockers and do not authorize refactoring without a focused, approved task.

- Parser growth and concentration of statement/expression parsing
- Semantic-analysis growth and concentration of flow/type responsibilities
- Encoded collection-type representation
- Concentrated module-loader filesystem, graph, validation, and rewriting work
- Need for a clearer host-independent compiler/module-resolution boundary
- Future browser compatibility requirements for Milestone 12
- Language-server transport, formatting, completion, hover, rename, debugging,
  and richer editor intelligence remain future work beyond Milestone 13
No source-encoding decision remains open. Identifiers scan by code point,
malformed UTF-8 is rejected, source coordinates are UTF-16 code units, and the
portable Unicode baseline is defined by ADR-028. See
[the Unicode profile](../design-decisions/ADR-028-unicode-identifier-profile.md).

Revisit each concern when evidence from a milestone justifies a scoped change.
Preserve language, runtime, module, compiler-output, and CLI behaviour during
any internal refactor.
