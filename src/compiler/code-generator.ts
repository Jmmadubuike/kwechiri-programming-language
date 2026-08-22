import type { SourceLocation } from "../errors/kwechiri-error.js";
import type { ResolvedExpression, ResolvedProgram, ResolvedStatement } from "../semantic/resolved-nodes.js";

const locationCode = (location: SourceLocation): string =>
  `{line:${location.line},column:${location.column},offset:${location.offset}}`;

function generateExpression(expression: ResolvedExpression): string {
  if (expression.kind === "StringLiteral") return JSON.stringify(expression.value);
  if (expression.kind === "NumberLiteral" || expression.kind === "BooleanLiteral") return String(expression.value);
  if (expression.kind === "VariableReference") return expression.generatedName;
  if (expression.kind === "CallExpression") return `${expression.generatedName}(${expression.arguments.map(generateExpression).join(", ")})`;
  if (expression.kind === "ArrayLiteral") return `[${expression.elements.map(generateExpression).join(", ")}]`;
  if (expression.kind === "ObjectLiteral") return `{${expression.fields.map((field) => `${JSON.stringify(field.name)}: ${generateExpression(field.value)}`).join(", ")}}`;
  if (expression.kind === "IndexExpression") return `_kweRuntime.index(${generateExpression(expression.collection)}, ${generateExpression(expression.index)}, ${locationCode(expression.location)})`;
  if (expression.kind === "PropertyAccessExpression") return `${generateExpression(expression.object)}[${JSON.stringify(expression.property)}]`;
  if (expression.kind === "UnaryExpression") return `(-${generateExpression(expression.operand)})`;
  const left = generateExpression(expression.left);
  const right = generateExpression(expression.right);
  if (expression.kind === "BinaryExpression" && expression.operator === "/") return `_kweRuntime.divide(${left}, ${right}, ${locationCode(expression.location)})`;
  const operator = expression.kind === "ComparisonExpression" && expression.operator === "==" ? "==="
    : expression.kind === "ComparisonExpression" && expression.operator === "!=" ? "!==" : expression.operator;
  return `(${left} ${operator} ${right})`;
}

function generateStatements(statements: readonly ResolvedStatement[], indentation = ""): string[] {
  return statements.flatMap((statement): string[] => {
    if (statement.kind === "PrintStatement") return [`${indentation}_kweRuntime.print(${generateExpression(statement.value)}, ${locationCode(statement.location)});`];
    if (statement.kind === "VariableAssignment") return [`${indentation}${statement.declaration ? "let " : ""}${statement.generatedName} = ${generateExpression(statement.value)};`];
    if (statement.kind === "ReturnStatement") return [`${indentation}return ${generateExpression(statement.value)};`];
    if (statement.kind === "LoopStatement") return [`${indentation}while (${generateExpression(statement.condition)}) {`, ...generateStatements(statement.body, `${indentation}  `), `${indentation}}`];
    const lines = statement.hoistedDeclarations.map((name) => `${indentation}let ${name};`);
    lines.push(`${indentation}if (${generateExpression(statement.condition)}) {`, ...generateStatements(statement.thenBranch, `${indentation}  `));
    if (statement.elseBranch === undefined) lines.push(`${indentation}}`);
    else lines.push(`${indentation}} else {`, ...generateStatements(statement.elseBranch, `${indentation}  `), `${indentation}}`);
    return lines;
  });
}

export function generateJavaScript(program: ResolvedProgram): string {
  const functions = program.functions.flatMap((function_) => [
    `function ${function_.generatedName}(${function_.parameters.join(", ")}) {`,
    ...generateStatements(function_.body, "  "),
    "}",
  ]);
  return `${[functions.join("\n"), generateStatements(program.statements).join("\n")].filter(Boolean).join("\n")}\n`;
}
