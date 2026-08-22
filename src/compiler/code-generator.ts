import type { ResolvedExpression, ResolvedProgram, ResolvedStatement } from "../semantic/resolved-nodes.js";

function generateExpression(expression: ResolvedExpression): string {
  if (expression.kind === "StringLiteral") return JSON.stringify(expression.value);
  if (expression.kind === "NumberLiteral" || expression.kind === "BooleanLiteral") return String(expression.value);
  if (expression.kind === "VariableReference") return expression.generatedName;
  if (expression.kind === "CallExpression") {
    return `${expression.generatedName}(${expression.arguments.map(generateExpression).join(", ")})`;
  }
  if (expression.kind === "ArrayLiteral") return `[${expression.elements.map(generateExpression).join(", ")}]`;
  if (expression.kind === "ObjectLiteral") return `{${expression.fields.map((field) => `${JSON.stringify(field.name)}: ${generateExpression(field.value)}`).join(", ")}}`;
  if (expression.kind === "IndexExpression") return `_kweIndex(${generateExpression(expression.collection)}, ${generateExpression(expression.index)})`;
  if (expression.kind === "PropertyAccessExpression") return `${generateExpression(expression.object)}[${JSON.stringify(expression.property)}]`;
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
  if (expression.kind === "CallExpression") return expression.arguments.some(containsDivision);
  if (expression.kind === "ArrayLiteral") return expression.elements.some(containsDivision);
  if (expression.kind === "ObjectLiteral") return expression.fields.some((field) => containsDivision(field.value));
  if (expression.kind === "IndexExpression") return containsDivision(expression.collection) || containsDivision(expression.index);
  if (expression.kind === "PropertyAccessExpression") return containsDivision(expression.object);
  if (expression.kind === "BinaryExpression" || expression.kind === "ComparisonExpression") {
    return expression.kind === "BinaryExpression" && expression.operator === "/"
      || containsDivision(expression.left)
      || containsDivision(expression.right);
  }
  return expression.kind === "UnaryExpression" && containsDivision(expression.operand);
}

function statementContainsDivision(statement: ResolvedStatement): boolean {
  if (statement.kind === "ReturnStatement") return containsDivision(statement.value);
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

function containsIndex(expression: ResolvedExpression): boolean {
  if (expression.kind === "IndexExpression") return true;
  if (expression.kind === "ArrayLiteral") return expression.elements.some(containsIndex);
  if (expression.kind === "ObjectLiteral") return expression.fields.some((field) => containsIndex(field.value));
  if (expression.kind === "CallExpression") return expression.arguments.some(containsIndex);
  if (expression.kind === "PropertyAccessExpression") return containsIndex(expression.object);
  if (expression.kind === "UnaryExpression") return containsIndex(expression.operand);
  if (expression.kind === "BinaryExpression" || expression.kind === "ComparisonExpression") return containsIndex(expression.left) || containsIndex(expression.right);
  return false;
}

function statementHas(statement: ResolvedStatement, predicate: (expression: ResolvedExpression) => boolean): boolean {
  if (statement.kind === "ConditionalStatement") return predicate(statement.condition) || statement.thenBranch.some((item) => statementHas(item, predicate)) || (statement.elseBranch?.some((item) => statementHas(item, predicate)) ?? false);
  if (statement.kind === "LoopStatement") return predicate(statement.condition) || statement.body.some((item) => statementHas(item, predicate));
  return predicate(statement.value);
}

function containsCollectionPrint(statement: ResolvedStatement): boolean {
  if (statement.kind === "PrintStatement") return statement.value.valueType.startsWith("array|") || statement.value.valueType.startsWith("object|");
  if (statement.kind === "ConditionalStatement") return statement.thenBranch.some(containsCollectionPrint) || (statement.elseBranch?.some(containsCollectionPrint) ?? false);
  if (statement.kind === "LoopStatement") return statement.body.some(containsCollectionPrint);
  return false;
}

function generateStatements(statements: readonly ResolvedStatement[], indentation = ""): string[] {
  return statements.flatMap((statement): string[] => {
    if (statement.kind === "PrintStatement") {
      const value = generateExpression(statement.value);
      const printable = statement.value.valueType.startsWith("array|") || statement.value.valueType.startsWith("object|") ? `_kweFormat(${value})` : value;
      return [`${indentation}console.log(${printable});`];
    }
    if (statement.kind === "VariableAssignment") {
      return [`${indentation}${statement.declaration ? "let " : ""}${statement.generatedName} = ${generateExpression(statement.value)};`];
    }
    if (statement.kind === "ReturnStatement") {
      return [`${indentation}return ${generateExpression(statement.value)};`];
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
  const usesDivision = program.statements.some(statementContainsDivision)
    || program.functions.some((function_) => function_.body.some(statementContainsDivision));
  const divisionHelper = usesDivision
    ? 'function _kweDivide(left, right) {\n  if (right === 0) throw new Error("Enweghị ike ikewa site na efu. (Division by zero.)");\n  return left / right;\n}\n'
    : "";
  const allStatements = [...program.statements, ...program.functions.flatMap((function_) => function_.body)];
  const indexHelper = allStatements.some((statement) => statementHas(statement, containsIndex))
    ? 'function _kweIndex(collection, index) {\n  if (!Number.isInteger(index) || index < 0 || index >= collection.length) throw new Error("Index ndepụta gafere oke. (Array index out of range.)");\n  return collection[index];\n}\n'
    : "";
  const formatHelper = allStatements.some(containsCollectionPrint)
    ? "function _kweFormat(value) { return JSON.stringify(value); }\n"
    : "";
  const functions = program.functions.flatMap((function_) => [
    `function ${function_.generatedName}(${function_.parameters.join(", ")}) {`,
    ...generateStatements(function_.body, "  "),
    "}",
  ]);
  const sections = [functions.join("\n"), generateStatements(program.statements).join("\n")].filter(Boolean);
  return `${divisionHelper}${indexHelper}${formatHelper}${sections.join("\n")}\n`;
}
