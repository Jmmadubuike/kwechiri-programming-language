# Kwechiri 1.1.0 release notes

Status: Release candidate under verification

The 1.1.0 release adds four compatible string transformations to
`kwechiri:eriri`. No language syntax changes are included.

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

Publication and final checks are required before this release is complete.
