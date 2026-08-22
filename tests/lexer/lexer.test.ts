import { describe, expect, it } from "vitest";
import { tokenize } from "../../src/lexer/lexer.js";
import { TokenType } from "../../src/lexer/token.js";

describe("tokenize", () => {
  it("tokenizes the Hello World program", () => {
    expect(tokenize('bipụta("Ndewo Ụwa!")').map(({ type, literal }) => ({ type, literal }))).toEqual([
      { type: TokenType.Keyword, literal: undefined },
      { type: TokenType.LeftParen, literal: undefined },
      { type: TokenType.String, literal: "Ndewo Ụwa!" },
      { type: TokenType.RightParen, literal: undefined },
      { type: TokenType.EndOfFile, literal: undefined },
    ]);
  });

  it("recognizes Unicode Igbo identifiers and foundational punctuation", () => {
    const tokens = tokenize('ụbọchị = "Mọnde" afọ = 36.5 {}');
    expect(tokens.map((token) => token.type)).toEqual([
      TokenType.Identifier,
      TokenType.Equals,
      TokenType.String,
      TokenType.Identifier,
      TokenType.Equals,
      TokenType.Number,
      TokenType.LeftBrace,
      TokenType.RightBrace,
      TokenType.EndOfFile,
    ]);
    expect(tokens[0]?.lexeme).toBe("ụbọchị");
    expect(tokens[5]?.literal).toBe(36.5);
  });

  it("reports the source location of an unterminated string", () => {
    expect(() => tokenize('\n bipụta("Ndewo')).toThrow(/2:9/);
  });

  it("tokenizes arithmetic operators", () => {
    expect(tokenize("1 + 2 - 3 * 4 / 5").map((token) => token.type)).toEqual([
      TokenType.Number,
      TokenType.Plus,
      TokenType.Number,
      TokenType.Minus,
      TokenType.Number,
      TokenType.Star,
      TokenType.Number,
      TokenType.Slash,
      TokenType.Number,
      TokenType.EndOfFile,
    ]);
  });

  it("tokenizes condition keywords, booleans, and comparisons", () => {
    const tokens = tokenize("ọ bụrụ (eziokwu != ụgha) { afọ <= 18 }");
    expect(tokens.map((token) => token.type)).toEqual([
      TokenType.Keyword,
      TokenType.Keyword,
      TokenType.LeftParen,
      TokenType.Keyword,
      TokenType.BangEqual,
      TokenType.Keyword,
      TokenType.RightParen,
      TokenType.LeftBrace,
      TokenType.Identifier,
      TokenType.LessEqual,
      TokenType.Number,
      TokenType.RightBrace,
      TokenType.EndOfFile,
    ]);
  });

  it("recognizes the mgbe loop keyword", () => {
    expect(tokenize("mgbe")[0]).toMatchObject({ type: TokenType.Keyword, lexeme: "mgbe" });
  });

  it("recognizes function keywords and commas", () => {
    const tokens = tokenize("ọrụ gbakọọ(a, b) { laghachi a }");
    expect(tokens[0]).toMatchObject({ type: TokenType.Keyword, lexeme: "ọrụ" });
    expect(tokens.some((token) => token.type === TokenType.Comma)).toBe(true);
    expect(tokens.find((token) => token.lexeme === "laghachi")?.type).toBe(TokenType.Keyword);
  });

  it("tokenizes collection punctuation", () => {
    const types = tokenize('[1, 2] { aha: "Uche" }.aha').map((token) => token.type);
    expect(types).toContain(TokenType.LeftBracket);
    expect(types).toContain(TokenType.RightBracket);
    expect(types).toContain(TokenType.Colon);
    expect(types).toContain(TokenType.Dot);
  });

  it("ignores adjacent, Unicode, empty, and EOF line comments while preserving division", () => {
    const tokens = tokenize('aha=8// okwu: ịọụ 😀\n//\nọzọ=aha/2//EOF');
    expect(tokens.map((token) => token.lexeme)).toEqual(["aha", "=", "8", "ọzọ", "=", "aha", "/", "2", ""]);
    expect(tokens[3]?.location).toMatchObject({ line: 3, column: 1 });
  });

  it("does not interpret comment markers inside strings", () => {
    expect(tokenize('bipụta("https://example.test//x")')[2]?.literal).toBe("https://example.test//x");
  });

  it("decodes the five approved string escapes and preserves the raw lexeme", () => {
    const source = String.raw`"a\nb\tc\rd\\e\"f"`;
    const token = tokenize(source)[0];
    expect(token?.literal).toBe('a\nb\tc\rd\\e"f');
    expect(token?.lexeme).toBe(source);
  });

  it("rejects unknown and trailing escapes at the backslash location", () => {
    expect(() => tokenize('"x\\q"', "escape.kwe")).toThrow(/escape\.kwe:1:3:.*Unknown escape sequence/);
    expect(() => tokenize('"x\\', "escape.kwe")).toThrow(/escape\.kwe:1:3:.*Unterminated escape sequence/);
  });

  it("retains raw spelling and offsets while exposing NFC identity", () => {
    const rawKeyword = "bipụta".normalize("NFD");
    const rawName = "ụbọchị".normalize("NFD");
    const tokens = tokenize(`${rawKeyword}(${rawName})`);
    expect(tokens[0]).toMatchObject({ type: TokenType.Keyword, lexeme: rawKeyword, canonicalLexeme: "bipụta" });
    expect(tokens[2]).toMatchObject({ type: TokenType.Identifier, lexeme: rawName, canonicalLexeme: "ụbọchị" });
    expect(tokens[1]?.location.offset).toBe(rawKeyword.length);
  });

  it("keeps identifiers case-sensitive and does not introduce ASCII aliases", () => {
    const tokens = tokenize("Aha aha biputa");
    expect(tokens.slice(0, 3).map((token) => ({ type: token.type, identity: token.canonicalLexeme }))).toEqual([
      { type: TokenType.Identifier, identity: "Aha" },
      { type: TokenType.Identifier, identity: "aha" },
      { type: TokenType.Identifier, identity: "biputa" },
    ]);
  });

  it("reserves core value and logical vocabulary with NFC identity", () => {
    const words = ["efu", "na", "maọbụ", "ọ", "bụghị"];
    const tokens = tokenize(words.map((word) => word.normalize("NFD")).join(" "));
    expect(tokens.slice(0, words.length).map((token) => ({ type: token.type, identity: token.canonicalLexeme }))).toEqual(
      words.map((identity) => ({ type: TokenType.Keyword, identity })),
    );
  });
});
