# Kwechiri for Visual Studio Code

<p align="center">
  <img src="kwechiri-logo.png" alt="Kwechiri" width="128" height="128" />
</p>

This extension provides local development support for Kwechiri `.kwe` source
files:

- Kwechiri language registration;
- syntax and semantic highlighting;
- line comments, brackets, pairs, indentation, and Unicode word navigation;
- compile-only diagnostics on open, save, and explicit check;
- a `Kwechiri: Check Current File` command.

The extension validates source without executing it. It does not yet provide a
formatter, completion, hover, rename, debugging, or program execution.

Install the published extension from the
[VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=kwechiri.kwechiri-language).

## Development

From the repository root:

```sh
npm ci --prefix extensions/vscode
npm run vscode:check
```

The command produces
`extensions/vscode/kwechiri-language-0.1.3.vsix`. Install that local
artifact during development with VS Code's **Extensions: Install from VSIX**
command.

Packaging does not publish the extension. Marketplace publication is performed
separately through the Kwechiri publisher account.
