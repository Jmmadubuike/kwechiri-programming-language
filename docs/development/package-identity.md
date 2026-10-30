# Compiler package identity

Status: Published as 1.0.0-rc.1

The compiler package identity for Kwechiri 1.0 is:

```text
kwechiri
```

The repository package uses this name and is published to the public npm
registry under the owner's approved release.

## Registry check

The first publication claimed the package on 2026-10-30:

- maintainer: `jmmadubuike`;
- version: `1.0.0-rc.1`;
- access: public;
- registry SHA-1: `4c4bd419c02355c13d849a4400a0d259f912d1d3`;
- registry tarball:
  `https://registry.npmjs.org/kwechiri/-/kwechiri-1.0.0-rc.1.tgz`;
- git commit: `a3076756407d55a4be4825f906d8a8202ae6767f`;
- git tag: `v1.0.0-rc.1`.

Account-level two-factor authentication is enabled in `auth-and-writes` mode.
npm assigned both `latest` and `next` to the first published version.

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
