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

Milestones 0–10 are complete. Milestone 10 was certified and closed at
`60944dc77b7a5529a217c4474e56ecd3bb8150ef`; Milestone 11 has not begun.

## 7. Tutorials

The [tutorial index](tutorials/README.md) records the tutorial gap. Examples in
`examples/` are currently the executable learning material.
