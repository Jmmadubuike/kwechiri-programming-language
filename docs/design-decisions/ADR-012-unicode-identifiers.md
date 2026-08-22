# ADR-012: Implemented Unicode identifiers

## Context

Igbo source requires identifiers containing characters such as `ị`, `ọ`, and
`ụ`. The lexer and tests already implement Unicode letter, combining-mark, and
number handling for identifiers.

## Options considered

This record documents existing approved behaviour only. Normalization and
ASCII aliases were deliberately excluded.

## Decision

Unicode identifiers, including Igbo characters, are supported and tested.
Generated JavaScript identifiers remain internal and independent of Kwechiri
names.

## Consequences

Source, diagnostics, examples, and tools must preserve Unicode correctly.

**Status: Undecided** — NFC normalization, treatment of canonically equivalent
spellings, ASCII aliases, and any future normalization policy require separate
owner decisions.
