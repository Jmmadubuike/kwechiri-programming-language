# Kwechiri engineering instructions

## Project identity

Kwechiri is an Igbo-first programming language. Its current implementation is
written in TypeScript, compiles to JavaScript, runs initially on Node.js, and
uses the `.kwe` source extension.

Kwechiri must be treated as a genuine language with its own specification,
compiler stages, runtime boundary, diagnostics, tools, and educational model—not
as English or JavaScript with translated keywords.

## Product principles

- Igbo first: language design should feel natural to Igbo speakers.
- Technical correctness: prefer coherent semantics over literal translation;
  document the decision when those goals conflict.
- Beginner-friendly: programs and errors should be understandable to a new
  programmer.
- Professional: educational goals do not lower the engineering quality bar.
- Incremental: implement only the approved milestone and its defined contract.
- Interoperable: preserve a path to modern ecosystems without coupling the
  Kwechiri language contract unnecessarily to JavaScript.

## Authority and approval gates

The project owner is the final authority for language identity, Igbo
terminology, syntax, semantics, public APIs, branding, priorities, licensing,
releases, compatibility, and major architecture or product decisions.

Stop and request approval before:

- changing the language name or `.kwe` extension;
- adding, removing, or renaming syntax or keywords;
- changing established language, compiler, module, runtime, or CLI behaviour;
- breaking compatibility or changing a public API;
- introducing a major dependency or architectural redesign;
- choosing a license, publishing a package, or making a release;
- deleting substantial code or user work;
- making branding, educational, or community strategy decisions.

Ordinary implementation decisions are allowed only when they preserve the
approved contract and remain inside the requested milestone.

## Source of truth and required reading

The repository is the source of truth. Begin every task by reading:

1. this file;
2. [`docs/README.md`](docs/README.md);
3. [`docs/roadmap/PROJECT-STATUS.md`](docs/roadmap/PROJECT-STATUS.md);
4. the relevant current specification, architecture documents, and ADRs;
5. applicable development documentation.

Milestone files are historical incremental records and may be superseded by
later approved decisions. Current topic-oriented specifications and ADRs govern
current behaviour. If documents conflict, stop and report the conflict.

Milestones 0–10 are complete. Functions was certified, committed, and closed at
`c27d353e7589cf541f0054958c33f72c4803389b`. The approved Control Flow batch is
the current pre-1.0 foundation work. Modules has not begun, and Milestone 11
must not begin without a separately approved contract.

## Engineering workflow

Before making substantial changes:

- inspect repository structure and relevant files;
- run `git status` and preserve unrelated work;
- identify the approved scope and affected documentation;
- explain briefly what will change and how it will be validated.

During implementation:

- make the smallest coherent change;
- keep lexer, parser, AST, semantic analysis, code generation, runtime, module,
  and CLI responsibilities explicit;
- prefer small modules, clear names, explicit types, simple control flow, pure
  functions where appropriate, and deterministic behaviour;
- avoid giant functions, premature abstractions, duplicate logic, unexplained
  magic values, unnecessary dependencies, and unrelated rewrites;
- preserve source file, line, column, token, and category information in
  diagnostics where applicable;
- update specifications, ADRs, examples, and tutorials when behaviour changes.

Do not implement a feature merely because another language has it. Significant
language features require an approved purpose, Igbo syntax, semantics,
beginner model, interactions, and decision record.

## Dependency policy

Before adding a dependency, verify that it is necessary, maintained,
license-compatible once a project license is selected, proportionate to the
task, and unlikely to create avoidable lock-in. Prefer the existing stack when
it can meet the requirement cleanly. Do not add dependencies for trivial
convenience.

## Unicode requirements

Unicode is a first-class concern. Preserve Igbo characters including `ị`, `ọ`,
`ụ`, `Ị`, `Ọ`, and `Ụ` in source, identifiers, examples, tests, documentation,
and diagnostics. Do not introduce ASCII aliases or a normalization policy
without owner approval.

## Testing and validation

Every language or compiler behaviour requires tests covering the relevant
happy path, invalid input, edge cases, Unicode, source locations, errors, and
regressions. Every confirmed bug should receive a regression test when
practical.

Run the canonical local gate before completion:

```text
npm run check
```

Also perform direct CLI, runtime, module, or browser probes when the risk calls
for them. A build alone is not proof that user-visible behaviour works.

## Definition of done

A task is complete only when:

- implementation and relevant tests exist;
- linting passes;
- source and test TypeScript pass strict type checking;
- all tests pass;
- the production build succeeds;
- documentation and examples are current where applicable;
- no unrelated files changed;
- generated artifacts were not accidentally committed;
- known limitations and unverified external scope are reported honestly.

## Git safety

- Never overwrite, delete, reset, or rewrite unrelated user work.
- Inspect existing changes before editing overlapping files.
- Use focused commits only after owner approval.
- Do not publish, release, deploy, or create a license without explicit owner
  authorization.
- Avoid mass line-ending or formatting rewrites unrelated to the task.

## Completion report

Report:

```text
Implemented:
Tests:
Build:
Files changed:
Known limitations:
Language behaviour changes:
Next recommended step:
```

Validation claims must distinguish local evidence from CI, deployment,
provider, publication, or release evidence.
