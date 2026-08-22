import type { Expression, Program } from "../ast/nodes.js";
import { KwechiriError } from "../errors/kwechiri-error.js";
import type { ResolvedExpression, ResolvedProgram, ResolvedStatement } from "./resolved-nodes.js";

export function analyze(program: Program, fileName?: string): ResolvedProgram {
  const symbols = new Map<string, string>();

  const resolveExpression = (expression: Expression): ResolvedExpression => {
    if (expression.kind === "StringLiteral") {
      return { kind: "StringLiteral", value: expression.value };
    }
    if (expression.kind === "NumberLiteral") {
      return { kind: "NumberLiteral", value: expression.value };
    }
    const generatedName = symbols.get(expression.name);
    if (generatedName === undefined) {
      throw new KwechiriError(
        `Enweghị ike ịchọta mgbanwe "${expression.name}". (Undefined variable.)`,
        expression.location,
        fileName,
      );
    }
    return { kind: "VariableReference", generatedName, location: expression.location };
  };

  const statements: ResolvedStatement[] = program.statements.map((statement) => {
    if (statement.kind === "PrintStatement") {
      return { kind: "PrintStatement", value: resolveExpression(statement.value) };
    }

    const value = resolveExpression(statement.value);
    const existingName = symbols.get(statement.name);
    const declaration = existingName === undefined;
    const generatedName = existingName ?? `_kwe${symbols.size}`;
    if (declaration) {
      symbols.set(statement.name, generatedName);
    }
    return { kind: "VariableAssignment", generatedName, declaration, value };
  });

  return { statements };
}
