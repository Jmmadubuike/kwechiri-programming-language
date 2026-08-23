import { KwechiriError, type SourceLocation } from "../errors/kwechiri-error.js";
import { TokenType, type Token } from "./token.js";

const keywords = new Set(["bipụta", "ọ", "bụrụ", "ọzọ", "eziokwu", "ụgha", "efu", "mgbe", "ọrụ", "laghachi", "kwụsị", "gaa", "n'ihu", "webata", "bupụ", "site", "na", "maọbụ", "bụghị"]);
const identifierStart = /[\p{L}_]/u;
const identifierContinue = /[\p{L}\p{M}\p{N}_]/u;

export function tokenize(source: string, fileName?: string): readonly Token[] {
  const tokens: Token[] = [];
  let offset = 0;
  let line = 1;
  let column = 1;

  const location = (): SourceLocation => ({ line, column, offset });
  const current = (): string | undefined => source[offset];
  const advance = (): string => {
    const character = source[offset] as string;
    offset += 1;
    if (character === "\n") {
      line += 1;
      column = 1;
    } else {
      column += 1;
    }
    return character;
  };

  while (offset < source.length) {
    const character = current() as string;
    if (/\s/u.test(character)) {
      advance();
      continue;
    }

    const start = location();
    const twoCharacterTokens: Readonly<Record<string, TokenType>> = {
      "==": TokenType.EqualEqual,
      "!=": TokenType.BangEqual,
      "<=": TokenType.LessEqual,
      ">=": TokenType.GreaterEqual,
    };
    const pair = source.slice(offset, offset + 2);
    if (pair === "//") {
      while (current() !== undefined && current() !== "\n") {
        advance();
      }
      continue;
    }
    const pairType = twoCharacterTokens[pair];
    if (pairType !== undefined) {
      advance();
      advance();
      tokens.push({ type: pairType, lexeme: pair, location: start });
      continue;
    }
    const simpleTokens: Readonly<Record<string, TokenType>> = {
      "(": TokenType.LeftParen,
      ")": TokenType.RightParen,
      "{": TokenType.LeftBrace,
      "}": TokenType.RightBrace,
      "=": TokenType.Equals,
      "+": TokenType.Plus,
      "-": TokenType.Minus,
      "*": TokenType.Star,
      "/": TokenType.Slash,
      "<": TokenType.Less,
      ">": TokenType.Greater,
      ",": TokenType.Comma,
      "[": TokenType.LeftBracket,
      "]": TokenType.RightBracket,
      ":": TokenType.Colon,
      ".": TokenType.Dot,
    };
    const simpleType = simpleTokens[character];
    if (simpleType !== undefined) {
      tokens.push({ type: simpleType, lexeme: advance(), location: start });
      continue;
    }

    if (character === '"') {
      advance();
      let value = "";
      while (current() !== '"') {
        if (current() === undefined) {
          throw new KwechiriError("Eriri ederede emechighị. (Unterminated string.)", start, fileName);
        }
        if (current() === "\n") {
          throw new KwechiriError("Eriri ederede enweghị ike ịgafe ahịrị. (A string cannot cross a line.)", start, fileName);
        }
        if (current() === "\\") {
          const escapeLocation = location();
          advance();
          const escaped = current();
          if (escaped === undefined) {
            throw new KwechiriError("Usoro mgbapụ emechighị. (Unterminated escape sequence.)", escapeLocation, fileName);
          }
          if (escaped === "\n") {
            throw new KwechiriError("Eriri ederede enweghị ike ịgafe ahịrị. (A string cannot cross a line.)", escapeLocation, fileName);
          }
          const escapes: Readonly<Record<string, string>> = {
            n: "\n",
            t: "\t",
            r: "\r",
            "\\": "\\",
            '"': '"',
          };
          const decoded = escapes[escaped];
          if (decoded === undefined) {
            throw new KwechiriError(`Usoro mgbapụ amaghị: "\\${escaped}". (Unknown escape sequence.)`, escapeLocation, fileName);
          }
          advance();
          value += decoded;
          continue;
        }
        value += advance();
      }
      advance();
      tokens.push({
        type: TokenType.String,
        lexeme: source.slice(start.offset, offset),
        literal: value,
        location: start,
      });
      continue;
    }

    if (/\d/u.test(character)) {
      let value = advance();
      while (current() !== undefined && /\d/u.test(current() as string)) {
        value += advance();
      }
      if (current() === "." && source[offset + 1] !== undefined && /\d/u.test(source[offset + 1] as string)) {
        value += advance();
        while (current() !== undefined && /\d/u.test(current() as string)) {
          value += advance();
        }
      }
      tokens.push({
        type: TokenType.Number,
        lexeme: value,
        literal: Number(value),
        location: start,
      });
      continue;
    }

    if (source.startsWith("n'ihu", offset) && !identifierContinue.test(source[offset + 5] ?? "")) {
      for (let index = 0; index < 5; index += 1) advance();
      tokens.push({ type: TokenType.Keyword, lexeme: "n'ihu", canonicalLexeme: "n'ihu", location: start });
      continue;
    }

    if (identifierStart.test(character)) {
      let value = advance();
      while (current() !== undefined && identifierContinue.test(current() as string)) {
        value += advance();
      }
      const canonicalValue = value.normalize("NFC");
      tokens.push({
        type: keywords.has(canonicalValue) ? TokenType.Keyword : TokenType.Identifier,
        lexeme: value,
        canonicalLexeme: canonicalValue,
        location: start,
      });
      continue;
    }

    throw new KwechiriError(`Akara a amaghị: "${character}". (Unknown character.)`, start, fileName);
  }

  tokens.push({ type: TokenType.EndOfFile, lexeme: "", location: location() });
  return tokens;
}
