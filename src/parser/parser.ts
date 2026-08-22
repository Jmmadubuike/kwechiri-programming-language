import type { Expression, Program, Statement } from "../ast/nodes.js";
import { KwechiriError } from "../errors/kwechiri-error.js";
import { TokenType, type Token } from "../lexer/token.js";

export function parse(tokens: readonly Token[], fileName?: string): Program {
  let current = 0;
  const identity = (token: Token): string => token.canonicalLexeme ?? token.lexeme;
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
    let expression: Expression;
    if (token.type === TokenType.String) {
      current += 1;
      expression = { kind: "StringLiteral", value: token.literal as string, location: token.location };
    }
    else if (token.type === TokenType.Number) {
      current += 1;
      expression = { kind: "NumberLiteral", value: token.literal as number, location: token.location };
    }
    else if (token.type === TokenType.Identifier) {
      current += 1;
      expression = { kind: "VariableReference", name: identity(token), location: token.location };
      if (peek().type === TokenType.LeftParen) {
        current += 1;
        const arguments_: Expression[] = [];
        if (peek().type !== TokenType.RightParen) {
          do {
            arguments_.push(parseExpression());
            if (peek().type !== TokenType.Comma) break;
            current += 1;
          } while (true);
        }
        consume(TokenType.RightParen, 'A tụrụ anya ")" mgbe argument gasịrị.');
        expression = { kind: "CallExpression", callee: identity(token), arguments: arguments_, location: token.location };
      }
    }
    else if (token.type === TokenType.Keyword && (identity(token) === "eziokwu" || identity(token) === "ụgha")) {
      current += 1;
      expression = { kind: "BooleanLiteral", value: identity(token) === "eziokwu", location: token.location };
    }
    else if (token.type === TokenType.Keyword && identity(token) === "efu") {
      current += 1;
      expression = { kind: "AbsenceLiteral", location: token.location };
    }
    else if (token.type === TokenType.LeftParen) {
      current += 1;
      const expression = parseExpression();
      consume(TokenType.RightParen, 'A tụrụ anya ")" mgbe expression gasịrị.');
      return parsePostfix(expression);
    } else if (token.type === TokenType.LeftBracket) {
      current += 1;
      const elements: Expression[] = [];
      if (peek().type !== TokenType.RightBracket) {
        do {
          elements.push(parseExpression());
          if (peek().type !== TokenType.Comma) break;
          current += 1;
        } while (true);
      }
      consume(TokenType.RightBracket, 'A tụrụ anya "]".');
      expression = { kind: "ArrayLiteral", elements, location: token.location };
    } else if (token.type === TokenType.LeftBrace) {
      current += 1;
      const fields: { name: string; value: Expression; location: typeof token.location }[] = [];
      if (peek().type !== TokenType.RightBrace) {
        do {
          const name = consume(TokenType.Identifier, "A tụrụ anya aha property.");
          consume(TokenType.Colon, 'A tụrụ anya ":" mgbe aha property gasịrị.');
          fields.push({ name: identity(name), value: parseExpression(), location: name.location });
          if (peek().type !== TokenType.Comma) break;
          current += 1;
        } while (true);
      }
      consume(TokenType.RightBrace, 'A tụrụ anya "}".');
      expression = { kind: "ObjectLiteral", fields, location: token.location };
    } else {
      throw new KwechiriError(
        "A tụrụ anya ederede, ọnụọgụ, boolean, collection, maọbụ aha mgbanwe.",
        token.location,
        fileName,
      );
    }
    return parsePostfix(expression);
  };

  const parsePostfix = (initial: Expression): Expression => {
    let expression = initial;
    while (true) {
      if (peek().type === TokenType.LeftBracket) {
        const bracket = peek(); current += 1;
        const index = parseExpression();
        consume(TokenType.RightBracket, 'A tụrụ anya "]".');
        expression = { kind: "IndexExpression", collection: expression, index, location: bracket.location };
        continue;
      }
      if (peek().type === TokenType.Dot) {
        const dot = peek(); current += 1;
        const property = consume(TokenType.Identifier, "A tụrụ anya aha property mgbe ntụpọ gasịrị.");
        expression = { kind: "PropertyAccessExpression", object: expression, property: identity(property), location: dot.location };
        continue;
      }
      return expression;
    }
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
    if (peek().type === TokenType.Keyword && identity(peek()) === "ọ") {
      const operator = peek();
      current += 1;
      const second = consume(TokenType.Keyword, 'A tụrụ anya "bụghị" mgbe "ọ" gasịrị. (Expected "bụghị" after "ọ".)');
      if (identity(second) !== "bụghị") {
        throw new KwechiriError('A tụrụ anya "ọ bụghị". (Expected "ọ bụghị".)', second.location, fileName);
      }
      return { kind: "UnaryExpression", operator: "ọ bụghị", operand: parseUnary(), location: operator.location };
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

  const parseOrdering = (): Expression => {
    let expression = parseAdditive();
    const orderingTypes = new Map<TokenType, "<" | "<=" | ">" | ">=">([
      [TokenType.Less, "<"],
      [TokenType.LessEqual, "<="],
      [TokenType.Greater, ">"],
      [TokenType.GreaterEqual, ">="],
    ]);
    const operator = orderingTypes.get(peek().type);
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
      if (orderingTypes.has(peek().type)) {
        throw new KwechiriError(
          "Enweghị ike ijikọ ntụnyere nhazi. (Ordering comparison chaining is unsupported.)",
          peek().location,
          fileName,
        );
      }
    }
    return expression;
  };

  const parseEquality = (): Expression => {
    let expression = parseOrdering();
    const equalityTypes = new Map<TokenType, "==" | "!=">([
      [TokenType.EqualEqual, "=="],
      [TokenType.BangEqual, "!="],
    ]);
    const operator = equalityTypes.get(peek().type);
    if (operator !== undefined) {
      const token = peek();
      current += 1;
      expression = { kind: "ComparisonExpression", operator, left: expression, right: parseOrdering(), location: token.location };
      if (equalityTypes.has(peek().type)) {
        throw new KwechiriError("Enweghị ike ijikọ ntụnyere nha. (Equality chaining is unsupported.)", peek().location, fileName);
      }
    }
    return expression;
  };

  const parseLogicalAnd = (): Expression => {
    let expression = parseEquality();
    while (peek().type === TokenType.Keyword && identity(peek()) === "na") {
      const operator = peek(); current += 1;
      expression = { kind: "LogicalExpression", operator: "na", left: expression, right: parseEquality(), location: operator.location };
    }
    return expression;
  };

  function parseExpression(): Expression {
    let expression = parseLogicalAnd();
    while (peek().type === TokenType.Keyword && identity(peek()) === "maọbụ") {
      const operator = peek(); current += 1;
      expression = { kind: "LogicalExpression", operator: "maọbụ", left: expression, right: parseLogicalAnd(), location: operator.location };
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
        name: identity(name),
        value: parseExpression(),
        location: name.location,
      };
    }

    const keyword = consume(TokenType.Keyword, 'A tụrụ anya "bipụta", "ọ bụrụ", maọbụ aha mgbanwe.');
    if (identity(keyword) === "ọrụ") {
      const name = consume(TokenType.Identifier, 'A tụrụ anya aha ọrụ. (Expected a function name.)');
      consume(TokenType.LeftParen, 'A tụrụ anya "(" mgbe aha ọrụ gasịrị.');
      const parameters: string[] = [];
      if (peek().type !== TokenType.RightParen) {
        do {
          parameters.push(identity(consume(TokenType.Identifier, "A tụrụ anya aha parameter.")));
          if (peek().type !== TokenType.Comma) break;
          current += 1;
        } while (true);
      }
      consume(TokenType.RightParen, 'A tụrụ anya ")" mgbe parameter gasịrị.');
      return { kind: "FunctionDeclaration", name: identity(name), parameters, body: parseBlock(), location: keyword.location };
    }
    if (identity(keyword) === "laghachi") {
      return { kind: "ReturnStatement", value: parseExpression(), location: keyword.location };
    }
    if (identity(keyword) === "ọ") {
      const bụrụ = consume(TokenType.Keyword, 'A tụrụ anya "bụrụ" mgbe "ọ" gasịrị.');
      if (identity(bụrụ) !== "bụrụ") {
        throw new KwechiriError('A tụrụ anya "ọ bụrụ". (Expected "ọ bụrụ".)', bụrụ.location, fileName);
      }
      consume(TokenType.LeftParen, 'A tụrụ anya "(" mgbe "ọ bụrụ" gasịrị.');
      const condition = parseExpression();
      consume(TokenType.RightParen, 'A tụrụ anya ")" mgbe ọnọdụ gasịrị.');
      const thenBranch = parseBlock();
      let elseBranch: readonly Statement[] | undefined;
      if (peek().type === TokenType.Keyword && identity(peek()) === "ọzọ") {
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
    if (identity(keyword) === "mgbe") {
      consume(TokenType.LeftParen, 'A tụrụ anya "(" mgbe "mgbe" gasịrị.');
      const condition = parseExpression();
      consume(TokenType.RightParen, 'A tụrụ anya ")" mgbe ọnọdụ gasịrị.');
      return {
        kind: "LoopStatement",
        condition,
        body: parseBlock(),
        location: keyword.location,
      };
    }
    if (identity(keyword) !== "bipụta") {
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
