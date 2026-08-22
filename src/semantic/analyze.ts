import type { Expression, FunctionDeclaration, Program, Statement } from "../ast/nodes.js";
import { KwechiriError } from "../errors/kwechiri-error.js";
import type { ResolvedExpression, ResolvedFunctionDeclaration, ResolvedProgram, ResolvedStatement, ValueType } from "./resolved-nodes.js";

interface SymbolInfo { readonly generatedName: string; readonly valueType: ValueType }
interface BlockResult {
  readonly statements: readonly ResolvedStatement[];
  readonly symbols: Map<string, SymbolInfo>;
  readonly returnTypes: readonly ValueType[];
  readonly alwaysReturns: boolean;
}
interface FunctionInfo {
  readonly declaration: FunctionDeclaration;
  readonly generatedName: string;
  resolved?: ResolvedFunctionDeclaration;
  analyzing: boolean;
  readonly signatures: Map<string, ValueType>;
}

export function analyze(program: Program, fileName?: string): ResolvedProgram {
  const generatedNames = new Map<string, string>();
  const functions = new Map<string, FunctionInfo>();
  let functionCount = 0;
  const isCollection = (type: ValueType): boolean => type.startsWith("array|") || type.startsWith("object|");
  const arrayType = (element: ValueType, length: number): ValueType => `array|${JSON.stringify({ element, length })}`;
  const objectType = (fields: Readonly<Record<string, ValueType>>): ValueType => `object|${JSON.stringify(fields)}`;
  const collectionData = (type: ValueType): { element?: ValueType; length?: number; [key: string]: unknown } =>
    JSON.parse(type.slice(type.indexOf("|") + 1)) as { element?: ValueType; length?: number; [key: string]: unknown };

  for (const statement of program.statements) {
    if (statement.kind !== "FunctionDeclaration") continue;
    if (functions.has(statement.name)) {
      throw new KwechiriError(`E kwupụtala ọrụ "${statement.name}". (Duplicate function.)`, statement.location, fileName);
    }
    if (new Set(statement.parameters).size !== statement.parameters.length) {
      throw new KwechiriError(`Ọrụ "${statement.name}" nwere parameter ugboro abụọ. (Duplicate parameter.)`, statement.location, fileName);
    }
    functions.set(statement.name, {
      declaration: statement,
      generatedName: `_kweFn${functionCount++}`,
      analyzing: false,
      signatures: new Map(),
    });
  }

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
    if (expression.kind === "ArrayLiteral") {
      if (expression.elements.length === 0) throw new KwechiriError("Ndepụta efu akwadoghị ugbu a. (Empty arrays are not yet supported.)", expression.location, fileName);
      const elements = expression.elements.map((element) => resolveExpression(element, symbols));
      const elementType = elements[0]?.valueType as ValueType;
      if (elements.some((element) => element.valueType !== elementType)) throw new KwechiriError("Ihe niile dị na ndepụta ga-enwe otu ụdị. (Array elements must share a type.)", expression.location, fileName);
      return { kind: "ArrayLiteral", elements, valueType: arrayType(elementType, elements.length) };
    }
    if (expression.kind === "ObjectLiteral") {
      const names = expression.fields.map((field) => field.name);
      if (new Set(names).size !== names.length) throw new KwechiriError("Aha property ugboro abụọ adịghị ekwe. (Duplicate object property.)", expression.location, fileName);
      const fields = expression.fields.map((field) => ({ name: field.name, value: resolveExpression(field.value, symbols) }));
      const types = Object.fromEntries([...fields].sort((a, b) => a.name.localeCompare(b.name)).map((field) => [field.name, field.value.valueType]));
      return { kind: "ObjectLiteral", fields, valueType: objectType(types) };
    }
    if (expression.kind === "IndexExpression") {
      const collection = resolveExpression(expression.collection, symbols);
      const index = resolveExpression(expression.index, symbols);
      if (!collection.valueType.startsWith("array|")) throw new KwechiriError("Enwere ike iji index naanị na ndepụta. (Indexing requires an array.)", expression.location, fileName);
      if (index.valueType !== "number") throw new KwechiriError("Index ndepụta ga-abụ ọnụọgụ. (Array index must be a number.)", expression.location, fileName);
      const data = collectionData(collection.valueType);
      if (expression.index.kind === "NumberLiteral" && (!Number.isInteger(expression.index.value) || expression.index.value < 0 || expression.index.value >= (data.length as number))) {
        throw new KwechiriError("Index ndepụta gafere oke. (Array index out of range.)", expression.location, fileName);
      }
      return { kind: "IndexExpression", collection, index, valueType: data.element as ValueType, location: expression.location };
    }
    if (expression.kind === "PropertyAccessExpression") {
      const object = resolveExpression(expression.object, symbols);
      if (!object.valueType.startsWith("object|")) throw new KwechiriError("Nweta property chọrọ object. (Property access requires an object.)", expression.location, fileName);
      const fields = collectionData(object.valueType);
      const valueType = fields[expression.property];
      if (typeof valueType !== "string") throw new KwechiriError(`Property "${expression.property}" adịghị. (Missing property.)`, expression.location, fileName);
      return { kind: "PropertyAccessExpression", object, property: expression.property, valueType };
    }
    if (expression.kind === "CallExpression") {
      const info = functions.get(expression.callee);
      if (info === undefined || info.declaration.location.offset >= expression.location.offset) {
        throw new KwechiriError(`A kọwaghị ọrụ "${expression.callee}" tupu ojiji ya. (Function must be declared before use.)`, expression.location, fileName);
      }
      const arguments_ = expression.arguments.map((argument) => resolveExpression(argument, symbols));
      if (arguments_.length !== info.declaration.parameters.length) {
        throw new KwechiriError(`Ọrụ "${expression.callee}" chọrọ argument ${info.declaration.parameters.length}, mana enwetara ${arguments_.length}. (Wrong argument count.)`, expression.location, fileName);
      }
      const valueType = analyzeFunction(info, arguments_.map((argument) => argument.valueType));
      return { kind: "CallExpression", generatedName: info.generatedName, arguments: arguments_, valueType };
    }
    if (expression.kind === "UnaryExpression") {
      const operand = resolveExpression(expression.operand, symbols);
      if (operand.valueType !== "number") throw new KwechiriError('Akara "-" chọrọ ọnụọgụ. (Unary "-" requires a number.)', expression.location, fileName);
      return { kind: "UnaryExpression", operator: "-", operand, valueType: "number" };
    }
    if (expression.kind === "BinaryExpression") {
      const left = resolveExpression(expression.left, symbols);
      const right = resolveExpression(expression.right, symbols);
      if (left.valueType !== "number" || right.valueType !== "number") throw new KwechiriError(`Akara "${expression.operator}" chọrọ ọnụọgụ abụọ. (Arithmetic requires two numbers.)`, expression.location, fileName);
      return { kind: "BinaryExpression", operator: expression.operator, left, right, valueType: "number", location: expression.location };
    }
    if (expression.kind === "ComparisonExpression") {
      const left = resolveExpression(expression.left, symbols);
      const right = resolveExpression(expression.right, symbols);
      const ordering = expression.operator !== "==" && expression.operator !== "!=";
      if (isCollection(left.valueType) || isCollection(right.valueType)) throw new KwechiriError("Ntụnyere collection akwadoghị. (Collection equality is not yet supported.)", expression.location, fileName);
      if (ordering && (left.valueType !== "number" || right.valueType !== "number")) throw new KwechiriError(`Ntụnyere "${expression.operator}" chọrọ ọnụọgụ abụọ. (Ordering requires two numbers.)`, expression.location, fileName);
      return { kind: "ComparisonExpression", operator: expression.operator, left, right, valueType: "boolean" };
    }
    const symbol = symbols.get(expression.name);
    if (symbol === undefined) throw new KwechiriError(`Enweghị ike ịchọta mgbanwe "${expression.name}". (Undefined variable.)`, expression.location, fileName);
    return { kind: "VariableReference", generatedName: symbol.generatedName, location: expression.location, valueType: symbol.valueType };
  };

  const promoteDeclaration = (statement: ResolvedStatement, name: string): ResolvedStatement => {
    if (statement.kind === "VariableAssignment") return statement.generatedName === name ? { ...statement, declaration: false } : statement;
    if (statement.kind !== "ConditionalStatement") return statement;
    return { ...statement, hoistedDeclarations: statement.hoistedDeclarations.filter((item) => item !== name), thenBranch: statement.thenBranch.map((child) => promoteDeclaration(child, name)), ...(statement.elseBranch === undefined ? {} : { elseBranch: statement.elseBranch.map((child) => promoteDeclaration(child, name)) }) };
  };

  const resolveBlock = (source: readonly Statement[], initial: ReadonlyMap<string, SymbolInfo>, allowReturn: boolean): BlockResult => {
    const symbols = new Map(initial);
    const statements: ResolvedStatement[] = [];
    const returnTypes: ValueType[] = [];
    let alwaysReturns = false;
    for (const statement of source) {
      if (alwaysReturns) break;
      if (statement.kind === "FunctionDeclaration") {
        if (allowReturn) throw new KwechiriError("Enweghị ike ịkọwa ọrụ n'ime ọrụ ọzọ. (Nested functions are unsupported.)", statement.location, fileName);
        continue;
      }
      if (statement.kind === "ReturnStatement") {
        if (!allowReturn) throw new KwechiriError('"laghachi" ga-adị n\'ime ọrụ. (Return is only valid inside a function.)', statement.location, fileName);
        const value = resolveExpression(statement.value, symbols);
        statements.push({ kind: "ReturnStatement", value });
        returnTypes.push(value.valueType);
        alwaysReturns = true;
        continue;
      }
      if (statement.kind === "PrintStatement") {
        statements.push({ kind: "PrintStatement", value: resolveExpression(statement.value, symbols), location: statement.location });
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
      if (statement.kind === "LoopStatement") {
        const condition = resolveExpression(statement.condition, symbols);
        if (condition.valueType !== "boolean") throw new KwechiriError("Ọnọdụ `mgbe` ga-abụ eziokwu maọbụ ụgha. (A loop condition must be boolean.)", statement.condition.location, fileName);
        const body = resolveBlock(statement.body, symbols, allowReturn);
        for (const [name, symbol] of symbols) {
          const after = body.symbols.get(name);
          if (after !== undefined && after.valueType !== symbol.valueType) throw new KwechiriError(`Ụdị mgbanwe "${name}" ga-anọ otu n'ime ` + "`mgbe`" + ". (Loop variable type must remain stable.)", statement.location, fileName);
        }
        statements.push({ kind: "LoopStatement", condition, body: body.statements });
        returnTypes.push(...body.returnTypes);
        continue;
      }
      const condition = resolveExpression(statement.condition, symbols);
      if (condition.valueType !== "boolean") throw new KwechiriError("Ọnọdụ ga-abụ eziokwu maọbụ ụgha. (A condition must be boolean.)", statement.condition.location, fileName);
      const thenResult = resolveBlock(statement.thenBranch, symbols, allowReturn);
      const elseResult = statement.elseBranch === undefined ? { statements: [], symbols: new Map(symbols), returnTypes: [], alwaysReturns: false } : resolveBlock(statement.elseBranch, symbols, allowReturn);
      const merged = new Map(symbols);
      const hoisted: string[] = [];
      let thenStatements = [...thenResult.statements];
      let elseStatements = [...elseResult.statements];
      for (const [name, thenSymbol] of thenResult.symbols) {
        const elseSymbol = elseResult.symbols.get(name);
        if (elseSymbol === undefined) continue;
        if (thenSymbol.valueType !== elseSymbol.valueType) throw new KwechiriError(`Ụdị mgbanwe "${name}" adabaghị n'alaka abụọ. (Branch variable types differ.)`, statement.location, fileName);
        merged.set(name, thenSymbol);
        if (!symbols.has(name)) {
          hoisted.push(thenSymbol.generatedName);
          thenStatements = thenStatements.map((child) => promoteDeclaration(child, thenSymbol.generatedName));
          elseStatements = elseStatements.map((child) => promoteDeclaration(child, thenSymbol.generatedName));
        }
      }
      statements.push({ kind: "ConditionalStatement", condition, thenBranch: thenStatements, ...(statement.elseBranch === undefined ? {} : { elseBranch: elseStatements }), hoistedDeclarations: hoisted });
      returnTypes.push(...thenResult.returnTypes, ...elseResult.returnTypes);
      alwaysReturns = thenResult.alwaysReturns && statement.elseBranch !== undefined && elseResult.alwaysReturns;
      symbols.clear(); for (const [name, symbol] of merged) symbols.set(name, symbol);
    }
    return { statements, symbols, returnTypes, alwaysReturns };
  };

  const analyzeFunction = (info: FunctionInfo, parameterTypes: readonly ValueType[]): ValueType => {
    const signature = JSON.stringify(parameterTypes);
    const cached = info.signatures.get(signature);
    if (cached !== undefined) return cached;
    if (info.analyzing) throw new KwechiriError(`Recursion akwadoghị maka ọrụ "${info.declaration.name}".`, info.declaration.location, fileName);
    info.analyzing = true;
    try {
      const symbols = new Map<string, SymbolInfo>();
      const parameters = info.declaration.parameters.map((name, index) => `_kweP${info.generatedName.slice(6)}_${index}`);
      info.declaration.parameters.forEach((name, index) => symbols.set(name, { generatedName: parameters[index] as string, valueType: parameterTypes[index] as ValueType }));
      const result = resolveBlock(info.declaration.body, symbols, true);
      if (!result.alwaysReturns || result.returnTypes.length === 0) throw new KwechiriError(`Ụzọ niile n'ime ọrụ "${info.declaration.name}" ga-eji "laghachi" kwụsị. (Every path must return.)`, info.declaration.location, fileName);
      const returnType = result.returnTypes[0] as ValueType;
      if (result.returnTypes.some((type) => type !== returnType)) throw new KwechiriError(`Ụdị nloghachi ọrụ "${info.declaration.name}" adabaghị. (Return types differ.)`, info.declaration.location, fileName);
      info.signatures.set(signature, returnType);
      info.resolved ??= { generatedName: info.generatedName, parameters, body: result.statements };
      return returnType;
    } finally { info.analyzing = false; }
  };

  const main = resolveBlock(program.statements, new Map(), false);
  return {
    functions: [...functions.values()]
      .map((info) => info.resolved)
      .filter((function_): function_ is ResolvedFunctionDeclaration => function_ !== undefined),
    statements: main.statements,
  };
}
