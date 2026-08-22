import type { SourceLocation } from "../errors/kwechiri-error.js";

export enum TokenType {
  Identifier = "Identifier",
  Keyword = "Keyword",
  String = "String",
  LeftParen = "LeftParen",
  RightParen = "RightParen",
  LeftBrace = "LeftBrace",
  RightBrace = "RightBrace",
  Equals = "Equals",
  EndOfFile = "EndOfFile",
}

export interface Token {
  readonly type: TokenType;
  readonly lexeme: string;
  readonly literal?: string;
  readonly location: SourceLocation;
}
