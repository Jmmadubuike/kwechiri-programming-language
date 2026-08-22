import type { Expression, Program, Statement } from "../ast/nodes.js";
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

  const parsePrimary = (): Expression => {
    const token = peek();
    if (token.type === TokenType.String) {
      current += 1;
      return { kind: "StringLiteral", value: token.literal as string, location: token.location };
    }
    if (token.type === TokenType.Number) {
      current += 1;
      return { kind: "NumberLiteral", value: token.literal as number, location: token.location };
    }
    if (token.type === TokenType.Identifier) {
      current += 1;
      return { kind: "VariableReference", name: token.lexeme, location: token.location };
    }
    if (token.type === TokenType.LeftParen) {
      current += 1;
      const expression = parseExpression();
      consume(TokenType.RightParen, 'A tụrụ anya ")" mgbe expression gasịrị.');
      return expression;
    }
    throw new KwechiriError(
      "A tụrụ anya ederede, ọnụọgụ, maọbụ aha mgbanwe. (Expected a string, number, or variable.)",
      token.location,
      fileName,
    );
  };

  const parseUnary = (): Expression => {
    if (peek().type === TokenType.Minus) {
      const operator = consume(TokenType.Minus, 'A tụrụ anya "-".');
      return {
        kind: "UnaryExpression",
        operator: "-",
        operand: parseUnary(),
        location: operator.location,
      };
    }
    return parsePrimary();
  };

  const parseMultiplicative = (): Expression => {
    let expression = parseUnary();
    while (peek().type === TokenType.Star || peek().type === TokenType.Slash) {
      const operator = peek();
      current += 1;
      expression = {
        kind: "BinaryExpression",
        operator: operator.type === TokenType.Star ? "*" : "/",
        left: expression,
        right: parseUnary(),
        location: operator.location,
      };
    }
    return expression;
  };

  function parseExpression(): Expression {
    let expression = parseMultiplicative();
    while (peek().type === TokenType.Plus || peek().type === TokenType.Minus) {
      const operator = peek();
      current += 1;
      expression = {
        kind: "BinaryExpression",
        operator: operator.type === TokenType.Plus ? "+" : "-",
        left: expression,
        right: parseMultiplicative(),
        location: operator.location,
      };
    }
    return expression;
  }

  const statements: Statement[] = [];
  while (peek().type !== TokenType.EndOfFile) {
    if (peek().type === TokenType.Identifier) {
      const name = consume(TokenType.Identifier, "A tụrụ anya aha mgbanwe.");
      consume(TokenType.Equals, 'A tụrụ anya "=" mgbe aha mgbanwe gasịrị.');
      statements.push({
        kind: "VariableAssignment",
        name: name.lexeme,
        value: parseExpression(),
        location: name.location,
      });
      continue;
    }

    const keyword = consume(TokenType.Keyword, 'A tụrụ anya "bipụta" maọbụ aha mgbanwe.');
    consume(TokenType.LeftParen, 'A tụrụ anya "(" mgbe "bipụta" gasịrị.');
    const value = parseExpression();
    consume(TokenType.RightParen, 'A tụrụ anya ")".');
    statements.push({
      kind: "PrintStatement",
      location: keyword.location,
      value,
    });
  }

  return { kind: "Program", statements };
}
