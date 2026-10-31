# Milestone 15 - Standard Library Batch 11C

Status: Draft awaiting owner approval

Last updated: 2026-10-31

This contract proposes the first post-1.0 Standard Library expansion. No public
API is authorized by this draft until the owner approves the names, semantics,
diagnostics, and release version below.

## Purpose

Extend `kwechiri:eriri` with common non-mutating string operations while
preserving:

- the frozen Kwechiri 1.0 language surface;
- explicit named imports from the reserved `kwechiri:` namespace;
- exact raw-string processing without implicit coercion or normalization;
- cataloged signatures and located semantic diagnostics;
- portable implementations for Node.js and the browser worker.

The proposed release is `1.1.0`: additive public APIs under the semver policy
in ADR-027.

## Proposed public functions

These names are proposals requiring owner and native-speaker approval.

| Proposed name | Signature | Proposed behavior |
| --- | --- | --- |
| `wepuOghere` | `(string) -> string` | Remove leading and trailing Unicode White_Space; preserve all interior content |
| `okwuNta` | `(string) -> string` | Apply Unicode default, locale-independent lowercase mapping |
| `okwuNnukwu` | `(string) -> string` | Apply Unicode default, locale-independent uppercase mapping |
| `dochieEriri` | `(string, string, string) -> string` | Replace every non-overlapping exact occurrence of the second string with the third |

All four functions are pure and non-mutating. They accept exact string
arguments only and introduce no host capability or runtime value error.

## Proposed semantics

### `wepuOghere`

- Removes only leading and trailing Unicode White_Space.
- Preserves interior whitespace and line content.
- Returns `""` when the input contains only whitespace.
- Does not normalize the remaining string.

### `okwuNta` and `okwuNnukwu`

- Use the host's Unicode default case mapping, without a locale selector.
- Do not normalize the input or output.
- Preserve characters for which case mapping is undefined.
- Use the same Unicode 15.0.0 portability baseline as ADR-028.
- A canonically equivalent input is not implicitly converted to another
  normalization form.

### `dochieEriri`

- Matching is exact, raw, case-sensitive, and literal; it is not a regular
  expression.
- Replaces all non-overlapping occurrences, scanning left to right.
- The replacement string is inserted literally; `$` and backslashes have no
  special meaning.
- If the search string is empty, returns the original string unchanged.
- Does not normalize either the input or replacement.
- Does not reinterpret or recursively replace text inserted by the
  replacement.

## Diagnostics

- Wrong arity uses `KWE-STD-003`.
- Statically known non-string arguments use `KWE-STD-004`.
- Unknown modules and exports continue to use `KWE-STD-001` and `KWE-STD-002`.
- No new diagnostic code or runtime error category is introduced.

## Implementation boundary

Add the four exports to the declarative Standard Library catalog and the
portable `KwechiriStandardLibrary` intrinsic implementation. Do not add methods,
globals, aliases, coercion, new syntax, or JavaScript APIs.

The browser playground must use the same compiler catalog and runtime
implementation as the CLI.

## Required tests

- catalog signature, arity, type, purity, and return-type coverage;
- empty strings and whitespace-only strings;
- Igbo text, NFC/NFD distinctions, and astral characters;
- locale-independent case behavior and characters without case mappings;
- trim behavior for spaces, tabs, line breaks, and non-breaking whitespace;
- exact replacement, no match, overlapping search, empty search, literal `$`
  and backslash replacements, and no normalization;
- wrong arity and type at located call sites;
- module import, collision, CLI `run`/`check`/`compile`, browser, and VS Code
  coverage.

## Documentation and release

Update:

- `docs/standard-library/strings.md`;
- Standard Library diagnostics and examples;
- tutorials where string operations are taught;
- website Standard Library reference and verified examples;
- changelog and release notes for `1.1.0`.

Release requires the normal canonical gate, Ubuntu/Windows/macOS arm64 CI,
browser checks, extension checks, package dry run, clean install, explicit owner
approval, and post-publication verification.

## Required owner decisions

1. Approve or rename `wepuOghere`.
2. Approve or rename `okwuNta` and `okwuNnukwu`.
3. Approve or rename `dochieEriri`.
4. Approve the proposed whitespace, case-mapping, and empty-search semantics.
5. Approve `1.1.0` as the release version.

Implementation begins only after these decisions are recorded.
