import type { SourceLocation } from "../errors/kwechiri-error.js";

export enum TokenType {
  Identifier = "Identifier",
  Keyword = "Keyword",
  String = "String",
  Number = "Number",
  LeftParen = "LeftParen",
  RightParen = "RightParen",
  LeftBrace = "LeftBrace",
  RightBrace = "RightBrace",
  Equals = "Equals",
  Plus = "Plus",
  Minus = "Minus",
  Star = "Star",
  Slash = "Slash",
  EqualEqual = "EqualEqual",
  BangEqual = "BangEqual",
  Less = "Less",
  LessEqual = "LessEqual",
  Greater = "Greater",
  GreaterEqual = "GreaterEqual",
  Comma = "Comma",
  EndOfFile = "EndOfFile",
}

export interface Token {
  readonly type: TokenType;
  readonly lexeme: string;
  readonly literal?: string | number;
  readonly location: SourceLocation;
}
