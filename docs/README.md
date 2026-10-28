# Kwechiri documentation

This directory is the deeper source of truth linked from `AGENTS.md`.

## 1. Current normative documentation

The topic-oriented [current language specification](language-spec/README.md)
describes implemented and approved Kwechiri behaviour after Milestone 9.
Unresolved questions are marked `Status: Undecided` and are not language rules.

Project governance:

- [Project vision](project/vision.md)
- [Governance and authority](project/governance.md)

## 2. Historical milestone documentation

Files named `language-spec/milestone-*.md` are incremental historical records.
They remain useful evidence of each milestone but may be superseded by later
milestones, ADRs, and the current topic-oriented specification. Do not rewrite
them to imply that earlier milestones contained later behaviour.

## 3. Architecture documentation

See the [architecture index](architecture/README.md) for the compiler pipeline,
runtime, module loading, diagnostics, and known documentation gaps.

## 4. Design decisions

See the [ADR index](design-decisions/README.md). ADRs record approved decisions
and consequences; they do not authorize unresolved future features.

## 5. Development documentation

- [Contributor workflow](development/workflow.md)
- [Testing and validation](development/testing.md)
- [Engineering standards](development/engineering-standards.md)
- [Git workflow](development/git-workflow.md)
- [Definition of done](development/definition-of-done.md)

## 6. Roadmap and status

- [Current project status](roadmap/PROJECT-STATUS.md)
- [Recorded technical debt](roadmap/technical-debt.md)
- [Website and documentation foundation plan](roadmap/WEBSITE-FOUNDATION-PLAN.md)
  — approved static foundation
- [Standard Library](standard-library/README.md)

Milestones 0–10 and the post-milestone Lexical Foundations, Core Values & Logic,
Collections, Functions, Control Flow, and Modules phases are closed. Functions closed at
`c27d353e7589cf541f0054958c33f72c4803389b`, and Control Flow closed at
`ce14e04c56271b756742d29a57cb717ec0e27803`. Modules closed at
`67ebd7384468c91a6eedaa5427c6fc3bef4bd9f3`, closing the pre-1.0 Language
Foundations phase. Milestone 11 Batch 11A was certified and closed at
`d147ccf2f84ee36261b97b4dca602d95ad34304a`, and Batch 11B was certified and
closed at `8655631f4f9fbb0508447713371e534bee418582`; later Standard Library
batches remain unauthorized.

## 7. Tutorials

The [tutorial index](tutorials/README.md) defines the beginner-first learning
path. Lessons 1 and 2 are available; lessons 3–8 remain planned. Examples in
`examples/` remain the executable source material.
