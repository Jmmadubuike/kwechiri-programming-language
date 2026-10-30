# ADR-021: Standard Library naming and public API conventions

## Context

Kwechiri's Standard Library must be Igbo-first without freezing uncertain
literal translations or creating collisions while import aliases are absent.

## Options considered

1. Copy English or JavaScript API names.
2. Use short shared names and require aliases.
3. Use provisionally approved, collision-resistant Igbo names with explicit
   imports.

## Decision

Use ordinary imported functions with collision-resistant public names. Batch
11A provisionally accepts `nwereEriri`, `maliteNa`, and `kwụsịNa`. They are
pre-1.0 terminology under implementation review, not frozen 1.0 vocabulary.

Names retain NFC, case-sensitive identifier identity. String contents retain
their raw spelling. No ASCII aliases, method calls, prototype APIs, classes, or
new expression namespace syntax are added.

## Consequences

Programs remain readable with the existing call grammar, and future terminology
review remains possible before 1.0. Each later public API still requires owner
and native-speaker review. Import aliases remain a separate deferred language
decision.

For Kwechiri 1.0, ADR-027 freezes the five provisionally named
`kwechiri:eriri` exports as the complete Standard Library surface unless a
separate batch is approved.
