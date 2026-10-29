# ADR-025: MIT project license

## Context

Kwechiri needs an explicit license before its source and editor tooling can be
distributed publicly. The repository previously granted no license and package
publication was blocked on an owner decision.

## Options considered

The owner selected among permissive, copyleft, and proprietary licensing
models. Marketplace publication does not itself select or grant a license.

## Decision

Kwechiri is licensed under the MIT License, copyright 2026 Joseph Mmadubuike.
The canonical license text is stored at the repository root in `LICENSE`.
The compiler, website, and VS Code extension package metadata declare `MIT`.

## Consequences

MIT permits use, modification, distribution, sublicensing, and sale provided
the copyright and permission notice remain with copies or substantial portions
of the software. The software is provided without warranty.

Third-party dependencies retain their own licenses. Marketplace or npm
publication remains a separate owner-controlled release decision.
