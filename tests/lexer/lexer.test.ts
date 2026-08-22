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
});
