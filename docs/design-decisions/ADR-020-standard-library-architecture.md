# ADR-020: Standard Library architecture and namespace

## Context

Milestone 11 needs official reusable APIs without making them globals, fake
filesystem files, packages, or accidental JavaScript behavior. ADR-019 reserves
bare specifiers for future packages and otherwise permits only contained
relative filesystem modules.

## Options considered

1. Add global built-ins.
2. Store Standard Library modules as hidden `.kwe` files.
3. Reserve an official module namespace with compiler-known exports.

## Decision

Reserve `kwechiri:` exclusively for official Standard Library modules. Standard
APIs use the existing explicit named-import syntax. `bipụta` remains the only
existing global built-in; Batch 11A adds no globals.

The loader distinguishes official standard specifiers from relative filesystem
modules and unsupported future package specifiers. Standard modules are not
resolved with filesystem operations and do not weaken canonical containment,
identity, caching, or cycle rules.

An internal declarative catalog supplies module exports and signatures. Semantic
analysis validates calls and lowers approved intrinsics to a portable pure
Standard Library implementation injected alongside the existing runtime. The
catalog and intrinsic bindings are not public compiler APIs.

## Consequences

Node and future browser hosts can share Category A implementations. The
namespace cannot be used by packages or user modules. New standard modules and
exports require separately approved contracts. Method syntax, aliases,
re-exports, packages, and arbitrary JavaScript APIs are not introduced.
