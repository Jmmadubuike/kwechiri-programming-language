# Kwechiri for Visual Studio Code

![Kwechiri logo](kwechiri-logo.png)

This extension provides local development support for Kwechiri `.kwe` source
files:

- Kwechiri language registration;
- syntax and semantic highlighting;
- line comments, brackets, pairs, indentation, and Unicode word navigation;
- compile-only diagnostics on open, save, and explicit check;
- a `Kwechiri: Check Current File` command.

The extension validates source without executing it. It does not yet provide a
formatter, completion, hover, rename, debugging, or program execution.

## Development

From the repository root:

```sh
npm ci --prefix extensions/vscode
npm run vscode:check
```

The command produces
`extensions/vscode/kwechiri-language-0.1.0-development.vsix`. Install that local
artifact during development with VS Code's **Extensions: Install from VSIX**
command.

This package is private. Packaging is not publication, and marketplace release
requires separate owner approval for licensing, publisher ownership, and the
extension identity.
