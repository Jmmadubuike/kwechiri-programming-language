# ADR-013: Professional CLI contract

## Context

Milestone 10 needs stable commands, streams, exit codes, output safety, and
automation behavior without creating a second compiler or project build system.

## Options considered

The audit considered requiring `--out` versus a default sibling, internal versus
directly runnable JavaScript, framework-based versus internal argument parsing,
and alternative classifications for usage, filesystem, module, runtime, and
internal failures.

## Decision

Preserve `kwechiri <file.kwe>` as shorthand for `run`. Add `run`, `check`, and
`compile`. Compilation defaults to a sibling lowercase `.js` file and supports
one explicit `--out`; parents are not created. Existing output requires
`--force`, and source/output identity is always rejected.

CLI-produced JavaScript is directly runnable through a small bootstrap using
the existing Kwechiri runtime. The internal compiler output remains unchanged.
Argument parsing is dependency-free. Help and version use stdout; diagnostics
use stderr. Exit codes are `0` success, `1` Kwechiri diagnostic, `2` invalid
usage, `3` filesystem/I/O failure, and `4` unexpected internal failure. A
missing imported module is code `1`; a missing entry file is code `3`.

## Consequences

Shells, CI, editors, and future tooling receive a stable public contract.
Compiled artifacts require the Kwechiri installation that produced them and
are not bundles. No REPL, watch mode, project system, package manager, standard
library, publication, or release behavior is introduced.
