import type { ResolvedExpression, ResolvedProgram } from "../semantic/resolved-nodes.js";

function generateExpression(expression: ResolvedExpression): string {
  if (expression.kind === "StringLiteral") {
    return JSON.stringify(expression.value);
  }
  if (expression.kind === "NumberLiteral") {
    return String(expression.value);
  }
  if (expression.kind === "VariableReference") {
    return expression.generatedName;
  }
  if (expression.kind === "UnaryExpression") {
    return `(-${generateExpression(expression.operand)})`;
  }
  const left = generateExpression(expression.left);
  const right = generateExpression(expression.right);
  if (expression.operator === "/") {
    return `_kweDivide(${left}, ${right})`;
  }
  return `(${left} ${expression.operator} ${right})`;
}

export function generateJavaScript(program: ResolvedProgram): string {
  let usesDivision = false;
  const containsDivision = (expression: ResolvedExpression): boolean => {
    if (expression.kind === "BinaryExpression") {
      return (
        expression.operator === "/" ||
        containsDivision(expression.left) ||
        containsDivision(expression.right)
      );
    }
    return expression.kind === "UnaryExpression" && containsDivision(expression.operand);
  };
  const lines = program.statements.map((statement) => {
    usesDivision ||= containsDivision(statement.value);
    if (statement.kind === "PrintStatement") {
      return `console.log(${generateExpression(statement.value)});`;
    }
    const declaration = statement.declaration ? "let " : "";
    return `${declaration}${statement.generatedName} = ${generateExpression(statement.value)};`;
  });
  const divisionHelper = usesDivision
    ? 'function _kweDivide(left, right) {\n  if (right === 0) throw new Error("Enweghị ike ikewa site na efu. (Division by zero.)");\n  return left / right;\n}\n'
    : "";
  return `${divisionHelper}${lines.join("\n")}\n`;
}
