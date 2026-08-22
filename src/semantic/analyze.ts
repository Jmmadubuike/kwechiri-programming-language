import type { Expression, Program } from "../ast/nodes.js";
import { KwechiriError } from "../errors/kwechiri-error.js";
import type {
  ResolvedExpression,
  ResolvedProgram,
  ResolvedStatement,
  ValueType,
} from "./resolved-nodes.js";

export function analyze(program: Program, fileName?: string): ResolvedProgram {
  const symbols = new Map<string, { generatedName: string; valueType: ValueType }>();

  const resolveExpression = (expression: Expression): ResolvedExpression => {
    if (expression.kind === "StringLiteral") {
      return { kind: "StringLiteral", value: expression.value, valueType: "string" };
    }
    if (expression.kind === "NumberLiteral") {
      return { kind: "NumberLiteral", value: expression.value, valueType: "number" };
    }
    if (expression.kind === "UnaryExpression") {
      const operand = resolveExpression(expression.operand);
      if (operand.valueType !== "number") {
        throw new KwechiriError(
          'Akara "-" chọrọ ọnụọgụ. (Unary "-" requires a number.)',
          expression.location,
          fileName,
        );
      }
      return { kind: "UnaryExpression", operator: "-", operand, valueType: "number" };
    }
    if (expression.kind === "BinaryExpression") {
      const left = resolveExpression(expression.left);
      const right = resolveExpression(expression.right);
      if (left.valueType !== "number" || right.valueType !== "number") {
        throw new KwechiriError(
          `Akara "${expression.operator}" chọrọ ọnụọgụ abụọ. (Arithmetic requires two numbers.)`,
          expression.location,
          fileName,
        );
      }
      return {
        kind: "BinaryExpression",
        operator: expression.operator,
        left,
        right,
        valueType: "number",
      };
    }

    const symbol = symbols.get(expression.name);
    if (symbol === undefined) {
      throw new KwechiriError(
        `Enweghị ike ịchọta mgbanwe "${expression.name}". (Undefined variable.)`,
        expression.location,
        fileName,
      );
    }
    return {
      kind: "VariableReference",
      generatedName: symbol.generatedName,
      location: expression.location,
      valueType: symbol.valueType,
    };
  };

  const statements: ResolvedStatement[] = program.statements.map((statement) => {
    if (statement.kind === "PrintStatement") {
      return { kind: "PrintStatement", value: resolveExpression(statement.value) };
    }

    const value = resolveExpression(statement.value);
    const existingSymbol = symbols.get(statement.name);
    const declaration = existingSymbol === undefined;
    const generatedName = existingSymbol?.generatedName ?? `_kwe${symbols.size}`;
    if (declaration) {
      symbols.set(statement.name, { generatedName, valueType: value.valueType });
    } else {
      symbols.set(statement.name, { generatedName, valueType: value.valueType });
    }
    return { kind: "VariableAssignment", generatedName, declaration, value };
  });

  return { statements };
}
