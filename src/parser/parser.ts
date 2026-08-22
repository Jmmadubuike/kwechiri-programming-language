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
    if (token.type === TokenType.Keyword && (token.lexeme === "eziokwu" || token.lexeme === "ụgha")) {
      current += 1;
      return { kind: "BooleanLiteral", value: token.lexeme === "eziokwu", location: token.location };
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

  const parseAdditive = (): Expression => {
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
  };

  function parseExpression(): Expression {
    let expression = parseAdditive();
    const comparisonTypes = new Map<TokenType, "==" | "!=" | "<" | "<=" | ">" | ">=">([
      [TokenType.EqualEqual, "=="],
      [TokenType.BangEqual, "!="],
      [TokenType.Less, "<"],
      [TokenType.LessEqual, "<="],
      [TokenType.Greater, ">"],
      [TokenType.GreaterEqual, ">="],
    ]);
    const operator = comparisonTypes.get(peek().type);
    if (operator !== undefined) {
      const token = peek();
      current += 1;
      expression = {
        kind: "ComparisonExpression",
        operator,
        left: expression,
        right: parseAdditive(),
        location: token.location,
      };
      if (comparisonTypes.has(peek().type)) {
        throw new KwechiriError(
          "Enweghị ike ijikọ ntụnyere. Jiri mkpụrụokwu abụọ kewapụ ha. (Comparison chaining is unsupported.)",
          peek().location,
          fileName,
        );
      }
    }
    return expression;
  }

  const parseBlock = (): readonly Statement[] => {
    consume(TokenType.LeftBrace, 'A tụrụ anya "{".');
    const statements: Statement[] = [];
    while (peek().type !== TokenType.RightBrace && peek().type !== TokenType.EndOfFile) {
      statements.push(parseStatement());
    }
    consume(TokenType.RightBrace, 'A tụrụ anya "}".');
    return statements;
  };

  const parseStatement = (): Statement => {
    if (peek().type === TokenType.Identifier) {
      const name = consume(TokenType.Identifier, "A tụrụ anya aha mgbanwe.");
      consume(TokenType.Equals, 'A tụrụ anya "=" mgbe aha mgbanwe gasịrị.');
      return {
        kind: "VariableAssignment",
        name: name.lexeme,
        value: parseExpression(),
        location: name.location,
      };
    }

    const keyword = consume(TokenType.Keyword, 'A tụrụ anya "bipụta", "ọ bụrụ", maọbụ aha mgbanwe.');
    if (keyword.lexeme === "ọ") {
      const bụrụ = consume(TokenType.Keyword, 'A tụrụ anya "bụrụ" mgbe "ọ" gasịrị.');
      if (bụrụ.lexeme !== "bụrụ") {
        throw new KwechiriError('A tụrụ anya "ọ bụrụ". (Expected "ọ bụrụ".)', bụrụ.location, fileName);
      }
      consume(TokenType.LeftParen, 'A tụrụ anya "(" mgbe "ọ bụrụ" gasịrị.');
      const condition = parseExpression();
      consume(TokenType.RightParen, 'A tụrụ anya ")" mgbe ọnọdụ gasịrị.');
      const thenBranch = parseBlock();
      let elseBranch: readonly Statement[] | undefined;
      if (peek().type === TokenType.Keyword && peek().lexeme === "ọzọ") {
        current += 1;
        elseBranch = parseBlock();
      }
      return {
        kind: "ConditionalStatement",
        condition,
        thenBranch,
        ...(elseBranch === undefined ? {} : { elseBranch }),
        location: keyword.location,
      };
    }
    if (keyword.lexeme !== "bipụta") {
      throw new KwechiriError(`Okwu iwu a akwadoghị: "${keyword.lexeme}".`, keyword.location, fileName);
    }
    consume(TokenType.LeftParen, 'A tụrụ anya "(" mgbe "bipụta" gasịrị.');
    const value = parseExpression();
    consume(TokenType.RightParen, 'A tụrụ anya ")".');
    return {
      kind: "PrintStatement",
      location: keyword.location,
      value,
    };
  };

  const statements: Statement[] = [];
  while (peek().type !== TokenType.EndOfFile) {
    statements.push(parseStatement());
  }

  return { kind: "Program", statements };
}
