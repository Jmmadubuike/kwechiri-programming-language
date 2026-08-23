# Architecture decision records

ADRs capture approved decisions. Superseding an ADR requires an explicit owner
decision and a new or amended record.

| ADR | Decision |
|---|---|
| [ADR-001](ADR-001-language-name.md) | Kwechiri language name |
| [ADR-002](ADR-002-source-extension.md) | `.kwe` source extension |
| [ADR-003](ADR-003-compiler-target.md) | JavaScript/Node.js initial target |
| [ADR-004](ADR-004-variable-semantics.md) | Variable semantics |
| [ADR-005](ADR-005-arithmetic-semantics.md) | Arithmetic semantics |
| [ADR-006](ADR-006-condition-semantics.md) | Conditions and comparisons |
| [ADR-007](ADR-007-loop-semantics.md) | Loop semantics |
| [ADR-008](ADR-008-function-semantics.md) | Function semantics |
| [ADR-009](ADR-009-collection-semantics.md) | Collection semantics |
| [ADR-010](ADR-010-module-semantics.md) | Module semantics |
| [ADR-011](ADR-011-runtime-boundary.md) | Runtime boundary |
| [ADR-012](ADR-012-unicode-identifiers.md) | Implemented Unicode identifiers |
| [ADR-013](ADR-013-cli-contract.md) | Professional CLI contract |
| [ADR-014](ADR-014-lexical-foundations.md) | Comments, escapes, and NFC name identity |
| [ADR-015](ADR-015-core-values-and-logic.md) | Absence, Boolean display, and logical operators |
| [ADR-016](ADR-016-collection-semantics.md) | Collection typing, mutation, identity, and display |
| [ADR-017](ADR-017-function-semantics.md) | Pre-1.0 function analysis, typing, scope, and exclusions |

ADR-014 settles the normalization and ASCII-alias questions left open by
ADR-012. It does not settle the final identifier code-point profile.
