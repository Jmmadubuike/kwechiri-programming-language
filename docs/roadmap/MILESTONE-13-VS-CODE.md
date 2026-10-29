# Milestone 13: VS Code support

Status: Certified and closed on 2026-10-29 at
`a78d42102d3a672f1bc13535c652300c92f25318`.

## Purpose

Give Kwechiri a professional first editor experience without creating a second
compiler or changing the language contract. VS Code should recognize `.kwe`
files, present Kwechiri vocabulary clearly, display compiler and module
diagnostics in the editor, and package the integration reproducibly.

## Approved scope

Milestone 13 provides:

- a standalone VS Code extension package under `extensions/vscode/`;
- `.kwe` language registration with the Kwechiri display name;
- TextMate syntax highlighting for current strings, numbers, comments,
  operators, constants, keywords, and multiword forms;
- semantic highlighting from the canonical Kwechiri lexer for keywords,
  numbers, and strings, including decomposed Unicode keyword spellings;
- language configuration for line comments, brackets, pairs, indentation, and
  Unicode-aware word navigation;
- compile-only diagnostics for saved files by invoking the canonical
  `compileFile` boundary, which validates the complete module graph without
  executing user code;
- automatic validation when a `.kwe` file is opened or saved;
- a `Kwechiri: Check Current File` command for manual validation;
- clearing stale diagnostics while an edited file is unsaved;
- a status-bar state and a dedicated Kwechiri output channel;
- a locally packaged `.vsix` artifact and automated manifest verification.

## Architecture

The extension is a bundling boundary, not a compiler fork. Its build imports
the existing lexer and `compileFile` implementations from `src/`. The bundle
contains no copied grammar, semantic analysis, module resolution, code
generation, or runtime implementation.

```text
.kwe document
  -> TextMate fallback highlighting
  -> canonical lexer semantic tokens
  -> compileFile on open, save, or explicit command
  -> located Kwechiri diagnostic in VS Code
```

The extension never executes generated JavaScript. Runtime diagnostics remain
outside this compile-only editor integration.

The extension package has no runtime npm dependencies. Development-only
tooling is used for type checking, bundling, packaging, and verification.

## Diagnostic contract

- Diagnostics use source name `kwechiri` and error severity.
- Kwechiri source locations are converted from one-based lines and columns to
  VS Code's zero-based `Range`.
- A diagnostic for an existing imported file is attached to that file.
- A module diagnostic whose target file does not exist is attached to the
  entry document rather than creating a phantom file.
- Compiler diagnostics retain their bilingual message without the duplicated
  `file:line:column` prefix.
- Controlled internal or host failures are written to the Kwechiri output
  channel and do not masquerade as language diagnostics.
- Validation is compile-only and does not execute the current program.

## Explicit exclusions

Milestone 13 does not add:

- a formatter or formatting command;
- completion, hover, rename, code actions, symbols, or go-to-definition;
- a language server or Language Server Protocol transport;
- program execution, debugging, tasks, or terminal integration;
- snippets or onboarding walkthroughs;
- web or virtual-workspace support beyond the local extension host;
- marketplace publication, signing, or release approval.

Formatting and completion require separate approved contracts because their
output and beginner-facing behavior are product decisions. The compiler
remains authoritative for lexical and semantic highlighting; TextMate is a
fallback for syntax classes the lexer intentionally does not return.

## Packaging and publication boundary

The extension package is marked private and is built as an installable local
`.vsix`. Packaging does not publish it. The project owner must separately
approve an extension identifier, publisher ownership, marketplace publication,
and the project license before public distribution.

## Validation

Automated coverage must verify:

- manifest registration and `.kwe` activation;
- grammar and language-configuration references;
- TextMate scope coverage for the current vocabulary;
- canonical semantic tokens, including Unicode and NFD keyword spellings;
- located Kwechiri error conversion and safe fallback for missing imported
  files;
- strict TypeScript checking of the extension;
- extension bundling and local VSIX packaging;
- existing compiler, CLI, website, and browser behavior.

Direct editor verification must confirm syntax coloring, the command, and
located diagnostics in VS Code before certification.

## Implementation evidence

Local validation on 2026-10-29:

- the canonical repository gate passed linting, strict source/test type
  checking, 185 automated tests, and the production build;
- extension unit coverage passed for manifest registration, language
  configuration, keyword coverage, Unicode semantic tokens, and diagnostic
  conversion;
- the extension package passed strict TypeScript checking, bundled through the
  canonical compiler, verified its manifest and grammar references, and
  produced a local `.vsix` with no runtime dependencies;
- the extension dependency audit reported zero vulnerabilities;
- VS Code 1.100.0 extension-host testing confirmed activation, `.kwe` language
  assignment, semantic-token provision, located diagnostics, stale diagnostic
  clearing after correction, the manual check command and save behavior, and
  missing-module fallback;
- the produced VSIX installed successfully into the local VS Code 1.133.0
  profile as `kwechiri.kwechiri-language@0.1.0-development`.

The Windows Computer Use helper was unavailable, so the visual click-through
was replaced with a pinned extension-host test. Public marketplace
installation remains unverified and unauthorized.
