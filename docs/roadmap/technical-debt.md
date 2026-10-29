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
- The lexer currently iterates JavaScript UTF-16 code units. A pre-1.0 decision
  must cover full code-point iteration, astral identifiers, whether to adopt
  Unicode `ID_Start`/`ID_Continue`, and which Unicode version defines validity.
- Strict UTF-8 decoding and malformed-input handling remain a pre-1.0 decision.
- Source coordinate units remain UTF-16-oriented implementation behavior; a
  pre-1.0 decision must choose UTF-16 code units, Unicode code points, or
  display units as the stable diagnostic contract.

Revisit each concern when evidence from a milestone justifies a scoped change.
Preserve language, runtime, module, compiler-output, and CLI behaviour during
any internal refactor.
