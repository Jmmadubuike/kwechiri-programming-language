import type { Program, PrintStatement } from "../ast/nodes.js";
import { KwechiriError } from "../errors/kwechiri-error.js";
import { TokenType, type Token } from "../lexer/token.js";

export function parse(tokens: readonly Token[], fileName?: string): Program {
  let current = 0;
  const peek = (): Token => tokens[current] as Token;
  const consume = (type: TokenType, message: string): Token => {
    const token = peek();
    if (token.type !== type) {
      throw new KwechiriError(message, token.location, fileName);
    }
    current += 1;
    return token;
  };

  const statements: PrintStatement[] = [];
  while (peek().type !== TokenType.EndOfFile) {
    const keyword = consume(TokenType.Keyword, 'A tụrụ anya "bipụta". (Expected "bipụta".)');
    if (keyword.lexeme !== "bipụta") {
      throw new KwechiriError(`Okwu iwu a akwadoghị: "${keyword.lexeme}".`, keyword.location, fileName);
    }
    consume(TokenType.LeftParen, 'A tụrụ anya "(" mgbe "bipụta" gasịrị.');
    const value = consume(TokenType.String, "A tụrụ anya eriri ederede. (Expected a string.)");
    consume(TokenType.RightParen, 'A tụrụ anya ")".');
    statements.push({
      kind: "PrintStatement",
      location: keyword.location,
      value: {
        kind: "StringLiteral",
        value: value.literal as string,
        location: value.location,
      },
    });
  }

  return { kind: "Program", statements };
}
