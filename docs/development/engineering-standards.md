# Engineering standards

Prefer explicit types, clear names, deterministic behavior, small modules,
simple control flow, and pure transformations where practical. Maintain clear
boundaries between lexing, parsing, AST construction, semantic analysis, code
generation, modules, runtime, and CLI orchestration.

Avoid premature abstractions, unexplained constants, duplicate logic,
unnecessary dependencies, broad rewrites, and behavior changes disguised as
refactors. Existing compiler concentration is recorded technical debt, not an
instruction to restructure it during unrelated work.

Diagnostics should preserve source context and remain understandable to Igbo
learners. Unicode must survive source, tests, generated output, errors, and
documentation.

Dependencies require a clear need, maintenance review, compatible licensing
once the project license is selected, proportionate complexity, and minimal
lock-in.
