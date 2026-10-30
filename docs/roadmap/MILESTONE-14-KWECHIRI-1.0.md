# Milestone 14 - Kwechiri 1.0

Status: Approved and in progress

Last updated: 2026-10-30
Owner approval: 2026-10-30

This document is the approved scope and acceptance contract for Kwechiri 1.0.
Approval of this scope does not approve npm publication, a release, or
supported-platform claims. The current candidate is `1.0.0-rc.1`; publication
remains blocked until external verification and explicit owner approval.

## Purpose

Milestone 14 turns the implemented and certified `0.x` language into a stable
1.0 contract. The release must make the language, diagnostics, compatibility
rules, supported environments, documentation, and distribution process
predictable without adding unrelated features.

The default scope is a freeze of current certified behaviour. Any syntax,
keyword, terminology, semantic, public API, or compatibility change requires a
separate owner decision before implementation.

## Entry conditions

- Milestones 0-13 and Standard Library Batches 11A and 11B are certified and
  closed at the commits recorded in `PROJECT-STATUS.md`.
- The working tree contains no unrelated changes.
- The canonical local gate passes at the release-candidate commit.
- The owner has approved this contract and the decisions required by the work
  package being started.

## Work packages

| Package | Status | Notes |
| --- | --- | --- |
| 14A - Release contract and readiness inventory | Complete | Contract, surface inventory, release procedure, and local readiness record established |
| 14B - Language and terminology freeze | Complete | Surface inventory, keyword review, Unicode profile, UTF-8 policy, and explicit deferrals approved |
| 14C - Diagnostics and error catalog | Complete | Stable codes, strict UTF-8 source validation, editor integration, and catalog tests implemented |
| 14D - Compatibility and versioning policy | Complete | Approved in ADR-027 |
| 14E - Documentation and learning path | Complete | Architecture, reference, tutorials, examples, links, and browser examples verified on the current tree |
| 14F - Support matrix and portability | Complete | Windows and Linux Node 20/22/24 verified; macOS explicitly unclaimed |
| 14G - Distribution and release engineering | Complete | Package identity, npm 2FA, packed artifact, CI, and release procedure verified |
| 14H - Release candidate and final approval | In progress | `1.0.0-rc.1` published and tagged; final stable 1.0 decision remains |

### 14A - Release contract and readiness inventory

Deliverables:

- approve or revise this contract;
- record the current implemented language surface and provisional APIs;
- maintain a release-readiness register with evidence and unresolved decisions;
- define the release-candidate and final-release checkpoints.

Current local evidence and external verification gaps are recorded in the
[release-readiness record](MILESTONE-14-READINESS.md).

Exit criteria:

- the owner has approved the 1.0 scope;
- every required work package has an owner and a completion condition;
- publication and release remain blocked until explicit approval.

### 14B - Language and terminology freeze

Deliverables:

- inventory every keyword, multiword form, built-in operation, and approved
  Standard Library name;
- use the
  [1.0 language surface inventory](KWECHIRI-1.0-SURFACE-INVENTORY.md)
  as the review baseline;
- review the inventory for Igbo terminology and beginner comprehension;
- resolve or explicitly defer every `Status: Undecided` item in the current
  language specification;
- confirm that deferred features are not accidentally implied by the 1.0
  specification.

Exit criteria:

- the owner signs off the complete language and terminology inventory;
- no unresolved item changes 1.0 syntax or semantics without an approved ADR;
- the current topic specifications describe the frozen surface consistently.

### 14C - Diagnostics and error catalog

Deliverables:

- catalog every reachable lexical, syntax, semantic, module, Standard Library,
  runtime, CLI, and host diagnostic;
- define stable public categories and codes;
- document the diagnostic shape, source coordinates, bilingual presentation,
  and suggestion policy;
- verify that expected failures do not expose uncontrolled host stack traces;
- add regression coverage for stable codes and locations.

Exit criteria:

- every reachable diagnostic maps to a documented catalog entry;
- public codes and messages have an explicit compatibility policy;
- Unicode, line, column, offset, filename, and category evidence is tested.

### 14D - Compatibility and versioning policy

Deliverables:

- define semantic versioning for the language, compiler, CLI, Standard Library,
  generated JavaScript artifact, and VS Code extension;
- define what constitutes a compatible change after 1.0;
- define deprecation, migration, and pre-release rules;
- state the guarantees for `.kwe`, the `kwechiri` command, exit codes, module
  resolution, generated artifacts, and diagnostic codes.

Exit criteria:

- the compatibility policy receives owner approval;
- the policy distinguishes language compatibility from npm and Marketplace
  package compatibility;
- future changes have a documented decision path.

### 14E - Documentation and learning path

Deliverables:

- finish the architecture topics listed in `docs/architecture/README.md`;
- verify the language reference against the frozen specification;
- verify all eight tutorials and executable examples against the release
  candidate;
- document migration notes and intentional limitations for 1.0;
- verify website links, examples, and release-status claims.

Exit criteria:

- every documented example compiles and produces its stated result;
- reference, tutorials, website, and specifications do not conflict;
- known limitations are stated without presenting future work as implemented.

### 14F - Support matrix and portability

Deliverables:

- choose supported Node.js versions and operating systems;
- define separate host requirements for the compiler, website, and VS Code
  extension;
- verify clean installation and normal CLI use on every supported platform;
- record any platform-specific limitations.

Exit criteria:

- owner-approved support matrix exists;
- CI or direct evidence covers every claimed supported platform;
- unsupported environments are stated explicitly.

### 14G - Distribution and release engineering

Deliverables:

- decide compiler npm package name, ownership, access, and publication timing;
- keep the package private and retain overwrite protections until approval;
- define changelog, version bump, tagging, and release-note procedures;
- verify the packed compiler artifact from a clean installation;
- define rollback and security-response procedures;
- preserve the separate release state of the VS Code extension and website.

Exit criteria:

- the approved artifact installs and runs outside the repository checkout;
- the release checklist produces complete evidence;
- no credential, token, or destructive publication step is automated without
  owner authorization and provider safeguards.

### 14H - Release candidate and final approval

Deliverables:

- create a release candidate with an owner-approved version;
- run the complete compiler, website, browser, extension, audit, packaging, and
  supported-platform gates;
- publish release notes and a checksum or equivalent artifact identity;
- obtain explicit owner approval for the final version and publication targets;
- perform post-release verification and record rollback readiness.

Exit criteria:

- all required evidence belongs to the final release commit;
- the owner records a GO decision for each publication target;
- post-release checks pass or the release is reported as incomplete;
- the final status document, changelog, roadmap, and version metadata agree.

## Owner decision register

These decisions are not approved by the existence of this draft.

| ID | Decision | Blocking work | Recommendation |
| --- | --- | --- | --- |
| D1 | Freeze current language surface for 1.0 | 14B | Freeze certified behaviour; limit 1.0 changes to release-blocking defects and approved decisions. |
| D2 | Final keyword and Igbo terminology review | 14B | Review the complete inventory with native-speaker attention before freezing. |
| D3 | Identifier character profile and Unicode version | 14B, 14C | Define one versioned Unicode profile and test it against Igbo text and astral characters. |
| D4 | Source coordinate contract | 14C | Prefer a documented unit compatible with editors and current diagnostics; do not leave it as incidental implementation behaviour. |
| D5 | Strict UTF-8 malformed-input policy | 14B, 14C | Reject malformed source explicitly with a located file-level error unless the owner chooses replacement semantics. |
| D6 | Public diagnostic code format and localization policy | 14C | Approve stable stage-based codes and one bilingual presentation contract before adding codes to output. |
| D7 | Standard Library scope for 1.0 | 14B, 14D | Freeze the five certified `kwechiri:eriri` functions unless a later batch is separately approved. |
| D8 | Compiler package name, ownership, and npm publication | 14G | Choose the final package identity before the release candidate; keep the package private until the final GO. |
| D9 | Supported Node.js and operating-system matrix | 14F | Derive claims from tested environments; do not infer Windows or macOS support from Linux CI. |
| D10 | Release version tags and artifact naming | 14G, 14H | Use an owner-approved immutable release identity and retain artifacts with release evidence. |

## Required evidence

The final release must include, at minimum:

- clean dependency installation from locked manifests;
- linting and strict source/test type checking;
- the complete automated test suite;
- production compiler, website, and extension builds;
- direct CLI `run`, `check`, and `compile` probes;
- browser playground regression and accessibility checks;
- VS Code extension-host and VSIX installation checks;
- dependency audits for every published artifact;
- clean-install and packed-artifact checks for the compiler package;
- supported-platform evidence for every claimed platform;
- website link, example, metadata, and deployed-configuration checks;
- explicit owner approval for every publication and release action.

A local build, green test run, provider acceptance, or reachable website is not
proof that publication succeeded. Each external action requires its own result
and post-release verification.

## Non-goals

Unless separately approved, Milestone 14 does not add:

- recursion, closures, first-class or nested functions;
- default parameters, annotations, or generics;
- `maka`, collection iteration, or new loop forms;
- multiline strings, numeric extensions, or string concatenation operators;
- typed empty collections, collection equality, or collection methods;
- import aliases, re-exports, packages, or remote modules;
- new host, filesystem, network, input, or production sandbox APIs;
- formatting, completion, hover, rename, or debugging for the VS Code extension;
- later Standard Library batches.

These features may be reconsidered only through the normal owner-approval and
milestone process.

## Release rule

Milestone 14 is complete only when the final release commit has all required
evidence, the owner has approved the version and every publication target, and
the released artifacts have been verified externally. A green local gate alone
does not close the milestone.
