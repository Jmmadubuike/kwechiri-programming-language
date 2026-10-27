# Kwechiri Website and Documentation Foundation Plan

Status: Implemented locally; awaiting owner review
Date: 2026-10-27
Canonical domain: `kwechiri.dev` (owner-acquired; DNS not yet verified)

The owner approved the initial framework, repository location, canonical host,
static-only scope, and no-analytics/no-remote-execution boundary on
2026-10-27. This does not authorize deployment, public launch, final visual
branding, npm publication, browser playground work, or changes to the language
contract.

## Implementation status

The static foundation is implemented in `website/` with Astro 6.0.5. The
website build requires Node.js 22.12 or newer and is validated independently
from the compiler's Node.js 20 support. It includes the approved route
structure, responsive styling, verified website snapshots of repository
examples, sitemap generation, privacy copy, and no client-side execution or
analytics. A check script fails if a website snapshot drifts from its
authoritative example.

Local evidence:

- `astro check` reports zero errors, warnings, or hints across 24 files;
- the production build generates 13 static pages;
- 180 internal links were checked with zero broken targets;
- desktop and narrow mobile renders were inspected directly;
- the root compiler and website gates pass.

DNS, Vercel deployment, remote site CI, and public launch have not been
verified or authorized.

## Purpose

Create a credible public home for Kwechiri that explains the language,
documents only verified behavior, provides tested examples, and directs learners
and contributors to the repository. The initial site should establish the
branding and information architecture without pretending that the language or
its tooling is more complete than it is.

## Current constraints

- Kwechiri is pre-1.0 and the npm package is intentionally private.
- The compiler generates JavaScript that expects an injected runtime.
- `NodeKwechiriRuntime` is the only implemented runtime adapter.
- The browser playground is Milestone 12 and is not designed or approved.
- Formal tutorials are planned but not yet written.
- The repository documentation is the source of truth.
- The project has no selected license or approved publication policy.
- A full website authored directly in Kwechiri requires browser, DOM, event,
  and networking capabilities that do not yet exist.

## Goals

- Explain why Kwechiri is an Igbo-first programming language rather than
  translated JavaScript.
- Present current capabilities, limitations, and roadmap status accurately.
- Publish getting-started material and tested language examples.
- Provide a stable entry point for future documentation and tutorials.
- Make the site usable on mobile and desktop with minimal client-side code.
- Preserve one canonical source for documentation and examples.
- Create a foundation that can later accept a browser playground.

## Non-goals

- Executing untrusted Kwechiri programs in the browser.
- Building a full website directly in Kwechiri.
- Replacing the current language specification with marketing copy.
- Publishing the compiler package.
- Finalizing terminology, licensing, compatibility, or 1.0 branding.
- Introducing analytics, accounts, newsletters, comments, or contact forms
  without separate owner approval and privacy review.
- Implementing Milestone 12 or changing the compiler roadmap.

## Audiences

1. Igbo speakers who are new to programming.
2. Experienced developers evaluating the language design.
3. Educators and community organizers.
4. Potential contributors to the compiler, documentation, and tooling.

## Proposed information architecture

| Route | Purpose | Initial state |
|---|---|---|
| `/` | Language identity, short explanation, current status, primary calls to action | Required |
| `/why-kwechiri` | Igbo-first design principles and what makes the language distinct | Required |
| `/docs` | Documentation hub sourced from repository specifications | Required |
| `/docs/getting-started` | Installation and first verified program | Required |
| `/docs/language` | Current language overview with links to normative topics | Required |
| `/docs/cli` | Current command behavior and exit-code references | Required |
| `/docs/standard-library` | Batch 11A module and provisional-name status | Required |
| `/examples` | Tested examples with plain-text source and expected output | Required |
| `/roadmap` | Certified milestones, active limits, and future roadmap | Required |
| `/about` | Project purpose and governance summary | Required |
| `/contributing` | Development, validation, and contribution entry points | Required |
| `/playground` | Browser execution environment | Deferred to Milestone 12 |
| `/blog` | Editorial updates | Not part of the first release |

No route should imply that the playground, tutorials, package installation, or
1.0 compatibility already exist.

## Content rules

- The current specification and ADRs remain authoritative.
- Every executable example must run against the tested compiler version.
- Expected output must be copied from a verified run.
- The site must visibly identify Kwechiri as pre-1.0 and under active
  development.
- Public terminology requires owner review before launch.
- Igbo should lead the public language identity. The exact balance of Igbo and
  English page content remains an owner decision.
- Machine-translated Igbo text must not be published as reviewed terminology.
- Roadmap items must distinguish certified work, approved active work, proposed
  work, and unauthorized future work.
- Copyright, licensing, contribution, and publication statements must match the
  repository's approved policy.

## Repository and content model

The recommended initial model is:

- keep the website in this repository until the language reaches 1.0;
- place site code in a dedicated top-level directory rather than mixing it with
  compiler source;
- render or import verified repository documentation rather than duplicating
  normative text;
- keep tested example sources in the existing `examples/` area or another
  explicitly tested shared location;
- generate static pages so core content does not depend on client JavaScript.

The final repository-location and dependency decisions require owner approval.

## Technical options

### Option A — Astro static site

Recommended for evaluation:

- suited to documentation-first static content;
- permits interactive islands only where needed;
- produces low-cost static output suitable for Vercel;
- avoids requiring a full application framework for the first release.

Adoption still requires dependency, maintenance, license, and build-contract
review.

### Option B — Next.js

Appropriate only if the initial release needs application features such as
accounts, server routes, or a playground execution API. Those features are
outside the initial website scope, so this option adds complexity prematurely.

### Option C — Hand-authored HTML, CSS, and TypeScript

Provides maximum control and minimum framework dependency, but content,
navigation, metadata, link generation, and documentation rendering must be
implemented and maintained explicitly.

## Deployment and domain plan

- Host static production output on Vercel.
- Use HTTPS for every route; `.dev` requires a secure site.
- Prefer `kwechiri.dev` as canonical and permanently redirect the alternate
  `www` or apex host after the owner chooses.
- Use preview deployments for review, with production deployments restricted to
  approved changes on `main`.
- Do not point the domain at a public empty placeholder.
- Publish a sitemap and canonical metadata.
- Set the GitHub repository website field only after the production site is
  reachable and verified.
- Decide DNS, deployment, preview, and rollback ownership before launch.

## Visual and educational direction

The first release should use a restrained, text-led identity that can be
reviewed without a completed logo program. Visual direction, illustration,
logo, typography, and public copy require owner approval. The design should:

- prioritize readability and clear code samples;
- work at mobile widths without hiding essential content;
- meet WCAG 2.2 AA contrast, focus, keyboard, and semantic-structure targets;
- respect reduced-motion preferences;
- avoid animation and client-side behavior that do not improve understanding;
- present examples with copy controls while retaining selectable source text.

## Security and privacy

- The initial site does not execute user-provided Kwechiri code.
- No compiler output or source is sent to a server for execution.
- No secrets or private repository tokens belong in the site project.
- Do not add analytics, third-party tracking, forms, or remote fonts until the
  owner approves their privacy and operational impact.
- External links should not expose repository credentials or private URLs.

## Delivery phases

### Phase 0 — Owner decisions

Approved:

- Astro as the initial framework.
- A same-repository `website/` project.
- `kwechiri.dev` as the canonical apex host.
- A static first release without analytics, accounts, remote execution, or a
  misleading playground placeholder.
- A separate website implementation scope that does not alter compiler
  milestones.

### Phase 1 — Static foundation

- Create the site project and shared content conventions.
- Implement responsive layout, navigation, metadata, and error pages.
- Add the landing page, roadmap, examples, and documentation hub.
- Add a visible pre-1.0 status notice.

### Phase 2 — Documentation and examples

- Source current behavior from normative documents.
- Verify every displayed program and output.
- Add getting-started instructions using the actual available package method.
- Add clear links to the tutorial gap rather than inventing incomplete guides.

### Phase 3 — Deployment

- Configure Vercel production and preview behavior.
- Configure canonical-host redirects and HTTPS.
- Add automated link, content, accessibility, and build checks.
- Verify mobile and desktop behavior.

### Phase 4 — Public launch

- Complete owner review of copy, terminology, branding, licensing statements,
  and deployment evidence.
- Set repository website metadata.
- Announce only the capabilities that exist and have been verified.

### Future phase — Browser playground

The playground is a separate approved feature after Milestone 12. It must not
be simulated on the initial site with a misleading editor that cannot execute
the language.

## Acceptance criteria

- All required routes render on mobile and desktop without horizontal overflow.
- Core documentation and examples work without client-side JavaScript.
- Every example matches a tested compiler result.
- No page claims an unavailable installation method, editor, playground, or
  release status.
- Navigation, canonical links, sitemap, and redirects are correct.
- Keyboard navigation, focus visibility, semantic headings, and contrast meet
  the approved accessibility target.
- Production output builds reproducibly with the locked dependency set.
- CI validates the site build and key content checks.
- HTTPS and the canonical host are verified from a real production deployment.
- Private credentials and environment values are absent from the repository and
  generated client assets.

## Validation and evidence

Once a framework is approved, its definition of done must include:

- dependency installation from a lockfile;
- linting and strict type checking where applicable;
- a production build with no unresolved warnings;
- automated internal-link and metadata checks;
- direct browser checks for landing, documentation, examples, roadmap, and 404;
- mobile and desktop screenshots;
- deployed HTTPS, canonical redirect, and sitemap probes;
- confirmation that no unapproved third-party data collection occurs.

Local build success is not deployment evidence. Deployment success is not
content accuracy or owner approval.

## Remaining owner decisions

1. Review the initial Igbo/English content balance before public launch.
2. Approve final visual branding beyond the temporary text-led identity.
3. Confirm the owner responsible for launch approval and rollback.
4. Verify DNS ownership and approve the production deployment.
