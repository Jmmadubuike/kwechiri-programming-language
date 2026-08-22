# Recorded technical debt

These concerns were identified before Milestone 10. They are not stabilization
blockers and do not authorize refactoring without a focused, approved task.

- Parser growth and concentration of statement/expression parsing
- Semantic-analysis growth and concentration of flow/type responsibilities
- Encoded collection-type representation
- Concentrated module-loader filesystem, graph, validation, and rewriting work
- Need for a clearer host-independent compiler/module-resolution boundary
- Future browser compatibility requirements for Milestone 12
- Future editor and language-server requirements for Milestone 13

Revisit each concern when evidence from a milestone justifies a scoped change.
Preserve language, runtime, module, compiler-output, and CLI behaviour during
any internal refactor.
