import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { keywordSpellings } from "../../src/lexer/lexer.js";

interface ExtensionManifest {
  readonly icon?: string;
  readonly main?: string;
  readonly private?: boolean;
  readonly contributes?: {
    readonly languages?: readonly {
      readonly id?: string;
      readonly extensions?: readonly string[];
      readonly configuration?: string;
    }[];
    readonly grammars?: readonly { readonly scopeName?: string; readonly path?: string }[];
    readonly commands?: readonly { readonly command?: string }[];
  };
}

const extensionRoot = resolve("extensions/vscode");
const readJson = <Value>(path: string): Value =>
  JSON.parse(readFileSync(resolve(extensionRoot, path), "utf8")) as Value;

describe("VS Code extension manifest", () => {
  it("registers only the approved Kwechiri language surface", () => {
    const manifest = readJson<ExtensionManifest>("package.json");
    const language = manifest.contributes?.languages?.[0];

    expect(manifest.private).toBe(true);
    expect(manifest.icon).toBe("kwechiri-logo.png");
    expect(manifest.main).toBe("./dist/extension.js");
    expect(language).toMatchObject({
      id: "kwechiri",
      extensions: [".kwe"],
      configuration: "./language-configuration.json",
    });
    expect(manifest.contributes?.grammars?.[0]).toMatchObject({
      scopeName: "source.kwechiri",
      path: "./syntaxes/kwechiri.tmLanguage.json",
    });
    expect(manifest.contributes?.commands?.[0]?.command).toBe("kwechiri.checkCurrentFile");
  });

  it("keeps comments, brackets, and Unicode-aware words configured", () => {
    const configuration = readJson<{
      comments?: { lineComment?: string };
      brackets?: readonly (readonly string[])[];
      wordPattern?: string;
    }>("language-configuration.json");

    expect(configuration.comments?.lineComment).toBe("//");
    expect(configuration.brackets).toEqual([["{", "}"], ["[", "]"], ["(", ")"]]);
    expect(configuration.wordPattern).toContain("\\p{L}");
  });

  it("contains every lexer keyword in the TextMate grammar", () => {
    const grammar = readFileSync(
      resolve(extensionRoot, "syntaxes/kwechiri.tmLanguage.json"),
      "utf8",
    );

    for (const keyword of keywordSpellings) expect(grammar).toContain(keyword);
  });
});
