import { describe, expect, it } from "vitest";
import { semanticTokenData } from "../../extensions/vscode/src/semantic-tokens.js";

describe("VS Code semantic tokens", () => {
  it("classifies canonical keywords, numbers, and strings", () => {
    const source = 'ọrụ gbakọọ(a) {\n  bipụta("Ndewo", a + 2)\n}';

    expect(semanticTokenData(source, "program.kwe")).toEqual([
      0, 0, 3, 0, 0,
      1, 2, 6, 0, 0,
      0, 7, 7, 2, 0,
      0, 13, 1, 1, 0,
    ]);
  });

  it("recognizes decomposed Unicode keywords through lexical identity", () => {
    const rawKeyword = "bipụta".normalize("NFD");
    expect(semanticTokenData(`${rawKeyword}("Ndewo")`, "unicode.kwe")).toEqual([
      0, 0, rawKeyword.length, 0, 0,
      0, rawKeyword.length + 1, 7, 2, 0,
    ]);
  });

  it("produces no semantic tokens when lexical input already has an error", () => {
    expect(() => semanticTokenData('bipụta("missing)', "invalid.kwe")).toThrow(
      /Unterminated string/,
    );
  });
});
