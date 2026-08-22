# Definition of done

A task is complete when:

- the approved implementation exists;
- relevant positive, negative, Unicode, location, and regression tests exist;
- lint passes;
- source and test TypeScript pass strict type checking;
- all tests pass;
- the production build succeeds;
- specifications, ADRs, examples, and tutorials are updated where necessary;
- no unrelated work or generated artifacts are included;
- known limitations and unverified external scope are reported;
- language-behaviour changes are explicitly stated;
- the final diff has been reviewed.

The canonical local evidence command is `npm run check`. CI, deployment,
publication, and release readiness require their own evidence and must not be
inferred from a local build.
