import { tokenize } from "../../../src/lexer/lexer.js";
import { TokenType } from "../../../src/lexer/token.js";

export const semanticTokenTypes = ["keyword", "number", "string"] as const;
export const semanticTokenModifiers = [] as const;

const typeIndex = new Map<TokenType, number>([
  [TokenType.Keyword, 0],
  [TokenType.Number, 1],
  [TokenType.String, 2],
]);

export function semanticTokenData(source: string, fileName?: string): number[] {
  const data: number[] = [];
  let previousLine = 0;
  let previousColumn = 0;

  for (const token of tokenize(source, fileName)) {
    const tokenType = typeIndex.get(token.type);
    if (tokenType === undefined) continue;

    const line = token.location.line - 1;
    const column = token.location.column - 1;
    const deltaLine = line - previousLine;
    const deltaColumn = deltaLine === 0 ? column - previousColumn : column;
    data.push(deltaLine, deltaColumn, token.lexeme.length, tokenType, 0);
    previousLine = line;
    previousColumn = column;
  }

  return data;
}
