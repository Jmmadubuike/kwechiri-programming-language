import type { Expression, Program, Statement } from "../ast/nodes.js";
import { KwechiriError } from "../errors/kwechiri-error.js";
import type { ResolvedConditionalStatement, ResolvedExpression, ResolvedProgram, ResolvedStatement, ValueType } from "./resolved-nodes.js";

interface SymbolInfo {
  readonly generatedName: string;
  readonly valueType: ValueType;
}

interface BlockResult {
  readonly statements: readonly ResolvedStatement[];
  readonly symbols: Map<string, SymbolInfo>;
}

export function analyze(program: Program, fileName?: string): ResolvedProgram {
  const generatedNames = new Map<string, string>();
  const generatedNameFor = (name: string): string => {
    const existing = generatedNames.get(name);
    if (existing !== undefined) return existing;
    const generated = `_kwe${generatedNames.size}`;
    generatedNames.set(name, generated);
    return generated;
  };

  const resolveExpression = (expression: Expression, symbols: ReadonlyMap<string, SymbolInfo>): ResolvedExpression => {
    if (expression.kind === "StringLiteral") return { kind: "StringLiteral", value: expression.value, valueType: "string" };
    if (expression.kind === "NumberLiteral") return { kind: "NumberLiteral", value: expression.value, valueType: "number" };
    if (expression.kind === "BooleanLiteral") return { kind: "BooleanLiteral", value: expression.value, valueType: "boolean" };
    if (expression.kind === "UnaryExpression") {
      const operand = resolveExpression(expression.operand, symbols);
      if (operand.valueType !== "number") {
        throw new KwechiriError('Akara "-" chọrọ ọnụọgụ. (Unary "-" requires a number.)', expression.location, fileName);
      }
      return { kind: "UnaryExpression", operator: "-", operand, valueType: "number" };
    }
    if (expression.kind === "BinaryExpression") {
      const left = resolveExpression(expression.left, symbols);
      const right = resolveExpression(expression.right, symbols);
      if (left.valueType !== "number" || right.valueType !== "number") {
        throw new KwechiriError(`Akara "${expression.operator}" chọrọ ọnụọgụ abụọ. (Arithmetic requires two numbers.)`, expression.location, fileName);
      }
      return { kind: "BinaryExpression", operator: expression.operator, left, right, valueType: "number" };
    }
    if (expression.kind === "ComparisonExpression") {
      const left = resolveExpression(expression.left, symbols);
      const right = resolveExpression(expression.right, symbols);
      const ordering = expression.operator !== "==" && expression.operator !== "!=";
      if (ordering && (left.valueType !== "number" || right.valueType !== "number")) {
        throw new KwechiriError(`Ntụnyere "${expression.operator}" chọrọ ọnụọgụ abụọ. (Ordering requires two numbers.)`, expression.location, fileName);
      }
      return { kind: "ComparisonExpression", operator: expression.operator, left, right, valueType: "boolean" };
    }

    const symbol = symbols.get(expression.name);
    if (symbol === undefined) {
      throw new KwechiriError(`Enweghị ike ịchọta mgbanwe "${expression.name}". (Undefined variable.)`, expression.location, fileName);
    }
    return { kind: "VariableReference", generatedName: symbol.generatedName, location: expression.location, valueType: symbol.valueType };
  };

  const promoteDeclaration = (statement: ResolvedStatement, generatedName: string): ResolvedStatement => {
    if (statement.kind === "VariableAssignment") {
      return statement.generatedName === generatedName ? { ...statement, declaration: false } : statement;
    }
    if (statement.kind !== "ConditionalStatement") return statement;
    return {
      ...statement,
      hoistedDeclarations: statement.hoistedDeclarations.filter((name) => name !== generatedName),
      thenBranch: statement.thenBranch.map((child) => promoteDeclaration(child, generatedName)),
      ...(statement.elseBranch === undefined ? {} : { elseBranch: statement.elseBranch.map((child) => promoteDeclaration(child, generatedName)) }),
    };
  };

  const resolveBlock = (sourceStatements: readonly Statement[], initialSymbols: ReadonlyMap<string, SymbolInfo>): BlockResult => {
    const symbols = new Map(initialSymbols);
    const statements: ResolvedStatement[] = [];

    for (const statement of sourceStatements) {
      if (statement.kind === "PrintStatement") {
        statements.push({ kind: "PrintStatement", value: resolveExpression(statement.value, symbols) });
        continue;
      }
      if (statement.kind === "VariableAssignment") {
        const value = resolveExpression(statement.value, symbols);
        const existing = symbols.get(statement.name);
        const generatedName = existing?.generatedName ?? generatedNameFor(statement.name);
        statements.push({ kind: "VariableAssignment", generatedName, declaration: existing === undefined, value });
        symbols.set(statement.name, { generatedName, valueType: value.valueType });
        continue;
      }

      const condition = resolveExpression(statement.condition, symbols);
      if (condition.valueType !== "boolean") {
        throw new KwechiriError("Ọnọdụ ga-abụ eziokwu maọbụ ụgha. (A condition must be boolean.)", statement.condition.location, fileName);
      }
      const thenResult = resolveBlock(statement.thenBranch, symbols);
      const elseResult = statement.elseBranch === undefined
        ? { statements: [], symbols: new Map(symbols) }
        : resolveBlock(statement.elseBranch, symbols);
      const mergedSymbols = new Map(symbols);
      const hoistedDeclarations: string[] = [];
      let thenStatements = [...thenResult.statements];
      let elseStatements = [...elseResult.statements];

      for (const [name, thenSymbol] of thenResult.symbols) {
        const elseSymbol = elseResult.symbols.get(name);
        if (elseSymbol === undefined) continue;
        if (thenSymbol.valueType !== elseSymbol.valueType) {
          throw new KwechiriError(`Ụdị mgbanwe "${name}" adabaghị n'alaka abụọ. (Branch variable types differ.)`, statement.location, fileName);
        }
        mergedSymbols.set(name, thenSymbol);
        if (!symbols.has(name)) {
          hoistedDeclarations.push(thenSymbol.generatedName);
          thenStatements = thenStatements.map((child) => promoteDeclaration(child, thenSymbol.generatedName));
          elseStatements = elseStatements.map((child) => promoteDeclaration(child, thenSymbol.generatedName));
        }
      }

      const resolvedConditional: ResolvedConditionalStatement = {
        kind: "ConditionalStatement",
        condition,
        thenBranch: thenStatements,
        ...(statement.elseBranch === undefined ? {} : { elseBranch: elseStatements }),
        hoistedDeclarations,
      };
      statements.push(resolvedConditional);
      symbols.clear();
      for (const [name, symbol] of mergedSymbols) symbols.set(name, symbol);
    }
    return { statements, symbols };
  };

  return { statements: resolveBlock(program.statements, new Map()).statements };
}
