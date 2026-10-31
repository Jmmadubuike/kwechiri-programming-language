# Kwechiri 1.1.0 release notes

Status: Released 2026-10-31

The 1.1.0 release adds four compatible string transformations to
`kwechiri:eriri`. No language syntax changes are included.

Published to npm as `latest` on 2026-10-31. Git tag: `v1.1.0`. VS Code
extension `0.2.1` was published to the Marketplace on 2026-10-31.

## Added

| Function | Signature | Meaning |
| --- | --- | --- |
| `wepuOghere` | `(string) -> string` | Trim leading and trailing Unicode whitespace |
| `okwuNta` | `(string) -> string` | Unicode lowercase without locale selection |
| `okwuNnukwu` | `(string) -> string` | Unicode uppercase without locale selection |
| `dochieEriri` | `(string, string, string) -> string` | Replace every exact literal occurrence |

## Compatibility

The existing five `kwechiri:eriri` exports are unchanged. The release is
additive under semantic versioning. Exact matching, raw-string behavior, and
NFC name identity are preserved.

## Known limitations

- No slicing, splitting, character access, or regular expressions.
- Case mapping depends on the host Unicode implementation, with Unicode 15.0.0
  as the portable baseline.
- Intel macOS remains unverified.

## Verification

- Canonical gate: 207 tests passed; linting, strict source and test type
  checking, and the production build passed.
- CI: Ubuntu, Windows, and macOS arm64 passed on Node.js 20, 22, and 24.
- Website: 23 pages built with zero Astro diagnostics; all seven Chromium/WCAG
  tests passed; production security headers were verified.
- Package: a clean installation of `kwechiri@1.1.0` from the registry ran all
  four new functions with the expected output.
- Extension: `0.2.1` passed extension-host tests and was accepted by the
  Marketplace publisher.
