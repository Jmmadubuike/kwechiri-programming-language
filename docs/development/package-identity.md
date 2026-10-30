# Compiler package identity

Status: Approved name; publication blocked

The compiler package identity for Kwechiri 1.0 is:

```text
kwechiri
```

The repository package already uses this name and remains `"private": true` to
prevent accidental npm publication. Private status must remain until the owner
authorizes the final publication step.

## Registry check

On 2026-10-30, a read-only npm registry lookup for `kwechiri` returned `E404`
and no public package metadata. This is current availability evidence, not a
reservation or a guarantee that the name will remain available.

Package ownership, authenticated access, two-factor policy, and publication
rights have not been verified. The owner must claim or confirm the npm account
and package access before the release candidate. No ownership is inferred from
the local package name or the E404 result.

## Package metadata

The package declares:

- name `kwechiri`;
- MIT license and the owner copyright;
- the repository, issue tracker, website, and author;
- Node.js `>=20`;
- the `kwechiri` binary;
- compiled `dist/`, `README.md`, `CHANGELOG.md`, license, and the main brand
  asset.

The local pack candidate is inspected with `npm pack --dry-run` and installed
from its tarball in a clean temporary consumer before publication approval.

## Separate identities

- VS Code publisher: `kwechiri`
- VS Code extension: `kwechiri-language`
- Website: `kwechiri.dev`

Each provider has its own ownership, release, rollback, and post-release
verification state. A release of one does not authorize or prove the others.
