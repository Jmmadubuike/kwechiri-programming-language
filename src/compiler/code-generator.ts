import type { ResolvedExpression, ResolvedProgram } from "../semantic/resolved-nodes.js";

function generateExpression(expression: ResolvedExpression): string {
  if (expression.kind === "StringLiteral") {
    return JSON.stringify(expression.value);
  }
  if (expression.kind === "NumberLiteral") {
    return String(expression.value);
  }
  return expression.generatedName;
}

export function generateJavaScript(program: ResolvedProgram): string {
  const lines = program.statements.map((statement) => {
    if (statement.kind === "PrintStatement") {
      return `console.log(${generateExpression(statement.value)});`;
    }
    const declaration = statement.declaration ? "let " : "";
    return `${declaration}${statement.generatedName} = ${generateExpression(statement.value)};`;
  });
  return `${lines.join("\n")}\n`;
}
