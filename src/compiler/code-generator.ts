import type { ResolvedExpression, ResolvedProgram, ResolvedStatement } from "../semantic/resolved-nodes.js";

function generateExpression(expression: ResolvedExpression): string {
  if (expression.kind === "StringLiteral") return JSON.stringify(expression.value);
  if (expression.kind === "NumberLiteral" || expression.kind === "BooleanLiteral") return String(expression.value);
  if (expression.kind === "VariableReference") return expression.generatedName;
  if (expression.kind === "UnaryExpression") return `(-${generateExpression(expression.operand)})`;
  const left = generateExpression(expression.left);
  const right = generateExpression(expression.right);
  if (expression.kind === "BinaryExpression" && expression.operator === "/") {
    return `_kweDivide(${left}, ${right})`;
  }
  const operator = expression.kind === "ComparisonExpression" && expression.operator === "=="
    ? "==="
    : expression.kind === "ComparisonExpression" && expression.operator === "!="
      ? "!=="
      : expression.operator;
  return `(${left} ${operator} ${right})`;
}

function containsDivision(expression: ResolvedExpression): boolean {
  if (expression.kind === "BinaryExpression" || expression.kind === "ComparisonExpression") {
    return expression.kind === "BinaryExpression" && expression.operator === "/"
      || containsDivision(expression.left)
      || containsDivision(expression.right);
  }
  return expression.kind === "UnaryExpression" && containsDivision(expression.operand);
}

function statementContainsDivision(statement: ResolvedStatement): boolean {
  if (statement.kind === "LoopStatement") {
    return containsDivision(statement.condition) || statement.body.some(statementContainsDivision);
  }
  if (statement.kind === "ConditionalStatement") {
    return containsDivision(statement.condition)
      || statement.thenBranch.some(statementContainsDivision)
      || (statement.elseBranch?.some(statementContainsDivision) ?? false);
  }
  return containsDivision(statement.value);
}

function generateStatements(statements: readonly ResolvedStatement[], indentation = ""): string[] {
  return statements.flatMap((statement): string[] => {
    if (statement.kind === "PrintStatement") {
      return [`${indentation}console.log(${generateExpression(statement.value)});`];
    }
    if (statement.kind === "VariableAssignment") {
      return [`${indentation}${statement.declaration ? "let " : ""}${statement.generatedName} = ${generateExpression(statement.value)};`];
    }

    if (statement.kind === "LoopStatement") {
      return [
        `${indentation}while (${generateExpression(statement.condition)}) {`,
        ...generateStatements(statement.body, `${indentation}  `),
        `${indentation}}`,
      ];
    }

    const lines = statement.hoistedDeclarations.map((name) => `${indentation}let ${name};`);
    lines.push(`${indentation}if (${generateExpression(statement.condition)}) {`);
    lines.push(...generateStatements(statement.thenBranch, `${indentation}  `));
    if (statement.elseBranch === undefined) {
      lines.push(`${indentation}}`);
    } else {
      lines.push(`${indentation}} else {`);
      lines.push(...generateStatements(statement.elseBranch, `${indentation}  `));
      lines.push(`${indentation}}`);
    }
    return lines;
  });
}

export function generateJavaScript(program: ResolvedProgram): string {
  const divisionHelper = program.statements.some(statementContainsDivision)
    ? 'function _kweDivide(left, right) {\n  if (right === 0) throw new Error("Enweghị ike ikewa site na efu. (Division by zero.)");\n  return left / right;\n}\n'
    : "";
  return `${divisionHelper}${generateStatements(program.statements).join("\n")}\n`;
}
