# Compiler package identity

Status: Approved name; npm identity and 2FA verified; publication blocked

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

On 2026-10-30, npm authentication was verified as `jmmadubuike`, with a
verified email address. The authenticated registry lookup still returned
`E404`, so this account does not currently see an existing public `kwechiri`
package.

Account-level two-factor authentication is enabled in `auth-and-writes` mode.
The first approved publication claims the package name; availability is not a
reservation before that step.

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
The packed artifact SHA-1 is recorded in the release-readiness log.

## Separate identities

- VS Code publisher: `kwechiri`
- VS Code extension: `kwechiri-language`
- Website: `kwechiri.dev`

Each provider has its own ownership, release, rollback, and post-release
verification state. A release of one does not authorize or prove the others.
