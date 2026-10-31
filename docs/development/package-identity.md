# Compiler package identity

Status: Published as stable 1.1.0

The compiler package identity for Kwechiri is:

```text
kwechiri
```

The repository package uses this name and is published to the public npm
registry under the owner's approved release.

## Registry check

The stable publication is:

- maintainer: `jmmadubuike`;
- version: `1.1.0`;
- access: public;
- registry SHA-1: `a638693e60b19c79884c08ebbdcded35dc1a5f2b`;
- registry tarball:
  `https://registry.npmjs.org/kwechiri/-/kwechiri-1.1.0.tgz`;
- git commit: `64ff2cf5042f8af78c17836080a5ede7b7cb11aa`;
- git tag: `v1.1.0`.

Account-level two-factor authentication is enabled in `auth-and-writes` mode.
npm `latest` points to `1.1.0`; `next` remains the published `1.0.0-rc.1`
prerelease.

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
