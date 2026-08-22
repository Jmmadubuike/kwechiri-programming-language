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
});
