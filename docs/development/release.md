# Release procedure

Status: Approved with the Milestone 14 contract, 2026-10-30

This procedure defines how a Kwechiri release is prepared and verified. It does
not authorize publication. The compiler package is published on npm under owner
control. No npm, Visual Studio Marketplace, tag, or website release may occur
without explicit owner approval for that target.

## Release identities

The compiler, website, and VS Code extension have separate deployment and
distribution states. The release record must identify:

- the release version;
- the exact Git commit;
- the compiler package artifact, if approved;
- the VS Code extension version and VSIX, if applicable;
- the website deployment, if applicable;
- the owner approval for each publication target.

Do not infer one artifact's release state from another.

## Versioning

Versions follow semantic versioning under the compatibility policy recorded in
ADR-027. A major version change requires owner approval and an updated policy.

The compatibility policy defines compatibility for:

- Kwechiri source and language semantics;
- the `kwechiri` command, options, streams, and exit codes;
- relative and `kwechiri:` module resolution;
- Standard Library imports and signatures;
- generated JavaScript and its Kwechiri runtime dependency;
- public diagnostic categories and codes;
- editor and website integration.

## Release candidate sequence

1. Confirm the release scope and every relevant owner decision.
2. Start from a clean working tree with no unrelated or generated changes.
3. Set the candidate version in all packages that will be released.
4. Install dependencies from locked manifests.
5. Run the canonical compiler gate.
6. Run website build, example, link, accessibility, and browser checks.
7. Run VS Code type, build, manifest, grammar, extension-host, and package checks.
8. Audit every artifact's production dependencies.
9. Run direct CLI success, invalid-input, module, and runtime-error probes.
10. Build and inspect the candidate package without publishing it.
11. Install the candidate artifact in a clean temporary directory and run it.
12. Repeat required checks on every claimed supported platform.
13. Review the final diff, generated files, versions, changelog, and release notes.
14. Record all commands, results, versions, and unverified scope.
15. Request explicit owner approval for the final version and each target.

Run the VS Code extension-host suite without concurrent browser suites or
package installations. Its fixed extension-host startup timeout can expire
under unrelated CPU or process contention; a startup timeout is an unverified
run and must be repeated alone.

## Compiler package verification

The compiler package is published on npm under owner control. Before any new
publication:

- `npm pack --dry-run` may be used to inspect candidate contents;
- package ownership and access must be verified with the authenticated account;
- packed-artifact installation must be tested before publication approval.

The published artifact must also be installed with its production dependency
tree in a clean temporary directory and used to run a `.kwe` program before the
release is considered successful.

## VS Code extension verification

Extension publication is independent of compiler publication. A release must
verify the extension version, manifest, grammar, bundled compiler source,
located diagnostics, extension-host behavior, and generated VSIX. Marketplace
publication requires its own owner approval and post-publication installation
check.

## Website verification

The website release must verify the static build, internal links, examples,
deployment configuration, browser behavior, and accessibility checks. A
successful local build is not deployment evidence. A live deployment must be
checked for the expected version, content, security headers, canonical URLs,
sitemap, and redirects.

## Evidence record

The release record must distinguish:

- local commands and exit results;
- CI results tied to the release commit;
- artifact contents and identities;
- provider publication results;
- live post-release verification;
- anything not performed or not independently verified.

Do not record a timed-out, interrupted, or output-free command as success.

## Rollback and recovery

Before publication, identify the last known-good version and deployment for
each target.

- For npm, prefer owner-approved deprecation and a corrective patch. Unpublish
  only when provider policy and an explicit owner decision permit it.
- For the VS Code Marketplace, use the provider's supported version and
  response controls, then verify the corrective release by installation.
- For the website, restore the prior known-good deployment and verify content,
  headers, and redirects.
- Never rewrite public release history or move a release tag without explicit
  owner approval and documented reason.

## Release completion

A release is complete only when:

- the approved artifacts are uniquely identified;
- every required local, CI, packaging, provider, and post-release check has an
  actual result;
- the changelog, status document, roadmap, and version metadata agree;
- known limitations and unverified scope are reported;
- the owner's final GO is recorded.
