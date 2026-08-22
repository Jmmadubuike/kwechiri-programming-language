# ADR-003: Initial compiler and runtime target

## Context

Kwechiri needs a practical first implementation while preserving an independent
language contract.

## Options considered

The founding charter selected TypeScript implementation and JavaScript/Node.js
output. Other targets remain possible future work.

## Decision

The initial compiler is implemented in TypeScript, generates JavaScript, and
uses Node.js as its first runtime host.

## Consequences

The compiler can use the existing JavaScript ecosystem, but Kwechiri semantics
must not be defined accidentally by JavaScript. The runtime boundary permits
future hosts and targets without changing established language behaviour.
