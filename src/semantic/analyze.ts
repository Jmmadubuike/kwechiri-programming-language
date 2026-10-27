import type { Expression, FunctionDeclaration, Program, Statement } from "../ast/nodes.js";
import { KwechiriError } from "../errors/kwechiri-error.js";
import type { ResolvedExpression, ResolvedFunctionDeclaration, ResolvedProgram, ResolvedStatement, ValueType } from "./resolved-nodes.js";
import type { StandardExportDefinition } from "../standard-library/catalog.js";

interface SymbolInfo { readonly generatedName: string; readonly valueType: ValueType; readonly knownLength?: number }
interface BlockResult {
  readonly statements: readonly ResolvedStatement[];
  readonly symbols: Map<string, SymbolInfo>;
  readonly returnTypes: readonly ValueType[];
  readonly alwaysReturns: boolean;
  readonly alwaysTransfers: boolean;
}
interface FunctionInfo {
  readonly declaration: FunctionDeclaration;
  readonly generatedName: string;
  resolved?: ResolvedFunctionDeclaration;
  analyzing: boolean;
  parameterTypes?: readonly ValueType[];
  returnType?: ValueType;
}

export function analyze(
  program: Program,
  fileName?: string,
  standardBindings: ReadonlyMap<string, StandardExportDefinition> = new Map(),
): ResolvedProgram {
  const generatedNames = new Map<string, string>();
  const functions = new Map<string, FunctionInfo>();
  let functionCount = 0;
  const isCollection = (type: ValueType): boolean => type.startsWith("array|") || type.startsWith("object|");
  const arrayType = (element: ValueType): ValueType => `array|${JSON.stringify({ element })}`;
  const objectType = (fields: Readonly<Record<string, ValueType>>): ValueType => `object|${JSON.stringify(fields)}`;
  const collectionData = (type: ValueType): { element?: ValueType; [key: string]: unknown } =>
    JSON.parse(type.slice(type.indexOf("|") + 1)) as { element?: ValueType; [key: string]: unknown };
  const knownLengthOf = (expression: ResolvedExpression): number | undefined => {
    if (expression.kind === "ArrayLiteral") return expression.elements.length;
    if (expression.kind === "VariableReference" || expression.kind === "CallExpression") return expression.knownLength;
    return undefined;
  };
  const staticIndexValue = (expression: Expression): number | undefined => {
    if (expression.kind === "NumberLiteral") return expression.value;
    if (expression.kind === "UnaryExpression" && expression.operator === "-" && expression.operand.kind === "NumberLiteral") {
      return -expression.operand.value;
    }
    return undefined;
  };
  const validateIndex = (source: Expression, resolved: ResolvedExpression, knownLength: number | undefined, location: Expression["location"]): void => {
    if (resolved.valueType !== "number") {
      throw new KwechiriError("Index ndepụta ga-abụ ọnụọgụ. (Array index must be a number.)", location, fileName);
    }
    const value = staticIndexValue(source);
    if (value !== undefined
      && (!Number.isFinite(value) || !Number.isInteger(value) || value < 0 || (knownLength !== undefined && value >= knownLength))) {
      throw new KwechiriError("Index ndepụta gafere oke. (Array index out of range.)", location, fileName);
    }
  };

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
    });
  }

  const nestedFunctionError = (statement: FunctionDeclaration): never => {
    throw new KwechiriError(
      "Enweghị ike ịkọwa ọrụ n'ime block ọzọ. (Functions must be declared at module top level.)",
      statement.location,
      fileName,
    );
  };

  const validateTopLevelFunctionPlacement = (statements: readonly Statement[], topLevel: boolean): void => {
    for (const statement of statements) {
      if (statement.kind === "FunctionDeclaration") {
        if (!topLevel) nestedFunctionError(statement);
        continue;
      }
      if (statement.kind === "ConditionalStatement") {
        validateTopLevelFunctionPlacement(statement.thenBranch, false);
        if (statement.elseBranch !== undefined) validateTopLevelFunctionPlacement(statement.elseBranch, false);
      } else if (statement.kind === "LoopStatement") {
        validateTopLevelFunctionPlacement(statement.body, false);
      }
    }
  };

  function validateExpressionStructure(expression: Expression, symbols: ReadonlySet<string>, functionName: string): void {
    if (expression.kind === "StringLiteral" || expression.kind === "NumberLiteral"
      || expression.kind === "BooleanLiteral" || expression.kind === "AbsenceLiteral") return;
    if (expression.kind === "VariableReference") {
      if (!symbols.has(expression.name)) {
        throw new KwechiriError(`Enweghị ike ịchọta mgbanwe "${expression.name}". (Undefined variable.)`, expression.location, fileName);
      }
      return;
    }
    if (expression.kind === "CallExpression") {
      const standard = standardBindings.get(expression.callee);
      if (standard !== undefined) {
        if (expression.arguments.length !== standard.arity) {
          throw new KwechiriError(`Ọrụ "${standard.publicName}" chọrọ argument ${standard.arity}, mana enwetara ${expression.arguments.length}. (Wrong standard-library argument count.)`, expression.location, fileName);
        }
        for (const argument of expression.arguments) validateExpressionStructure(argument, symbols, functionName);
        return;
      }
      const called = functions.get(expression.callee);
      if (expression.callee === functionName) {
        throw new KwechiriError(`Recursion akwadoghị maka ọrụ "${functionName}".`, expression.location, fileName);
      }
      if (called === undefined || called.declaration.location.offset >= expression.location.offset) {
        throw new KwechiriError(`A kọwaghị ọrụ "${expression.callee}" tupu ojiji ya. (Function must be declared before use.)`, expression.location, fileName);
      }
      if (expression.arguments.length !== called.declaration.parameters.length) {
        throw new KwechiriError(
          `Ọrụ "${expression.callee}" chọrọ argument ${called.declaration.parameters.length}, mana enwetara ${expression.arguments.length}. (Wrong argument count.)`,
          expression.location,
          fileName,
        );
      }
      for (const argument of expression.arguments) validateExpressionStructure(argument, symbols, functionName);
      return;
    }
    if (expression.kind === "UnaryExpression") {
      validateExpressionStructure(expression.operand, symbols, functionName);
      return;
    }
    if (expression.kind === "BinaryExpression" || expression.kind === "ComparisonExpression" || expression.kind === "LogicalExpression") {
      validateExpressionStructure(expression.left, symbols, functionName);
      validateExpressionStructure(expression.right, symbols, functionName);
      return;
    }
    if (expression.kind === "ArrayLiteral") {
      for (const element of expression.elements) validateExpressionStructure(element, symbols, functionName);
      return;
    }
    if (expression.kind === "ObjectLiteral") {
      for (const field of expression.fields) validateExpressionStructure(field.value, symbols, functionName);
      return;
    }
    if (expression.kind === "IndexExpression") {
      validateExpressionStructure(expression.collection, symbols, functionName);
      validateExpressionStructure(expression.index, symbols, functionName);
      return;
    }
    validateExpressionStructure(expression.object, symbols, functionName);
  }

  function validateBlockStructure(source: readonly Statement[], initial: ReadonlySet<string>, functionName: string, loopDepth = 0): {
    readonly symbols: Set<string>;
    readonly alwaysReturns: boolean;
    readonly alwaysTransfers: boolean;
  } {
    const symbols = new Set(initial);
    let alwaysReturns = false;
    let alwaysTransfers = false;
    for (const statement of source) {
      if (alwaysTransfers) {
        const message = alwaysReturns
          ? "Okwu a agaghị eru n'ihi `laghachi`. (Unreachable statement after return.)"
          : "Okwu a agaghị eru mgbe njikwa kwụsịrị. (Unreachable statement after control transfer.)";
        throw new KwechiriError(message, statement.location, fileName);
      }
      if (statement.kind === "FunctionDeclaration") nestedFunctionError(statement);
      if (statement.kind === "ReturnStatement") {
        validateExpressionStructure(statement.value, symbols, functionName);
        alwaysReturns = true;
        alwaysTransfers = true;
      } else if (statement.kind === "BreakStatement" || statement.kind === "ContinueStatement") {
        if (loopDepth === 0) {
          const word = statement.kind === "BreakStatement" ? "kwụsị" : "gaa n'ihu";
          throw new KwechiriError(`"${word}" ga-adị n'ime loop. (Loop control is only valid inside a loop.)`, statement.location, fileName);
        }
        alwaysTransfers = true;
      } else if (statement.kind === "PrintStatement") {
        validateExpressionStructure(statement.value, symbols, functionName);
      } else if (statement.kind === "VariableAssignment") {
        validateExpressionStructure(statement.value, symbols, functionName);
        symbols.add(statement.name);
      } else if (statement.kind === "IndexAssignment") {
        validateExpressionStructure(statement.collection, symbols, functionName);
        validateExpressionStructure(statement.index, symbols, functionName);
        validateExpressionStructure(statement.value, symbols, functionName);
      } else if (statement.kind === "PropertyAssignment") {
        validateExpressionStructure(statement.object, symbols, functionName);
        validateExpressionStructure(statement.value, symbols, functionName);
      } else if (statement.kind === "LoopStatement") {
        validateExpressionStructure(statement.condition, symbols, functionName);
        validateBlockStructure(statement.body, symbols, functionName, loopDepth + 1);
      } else if (statement.kind === "ConditionalStatement") {
        validateExpressionStructure(statement.condition, symbols, functionName);
        const thenResult = validateBlockStructure(statement.thenBranch, symbols, functionName, loopDepth);
        const elseResult = statement.elseBranch === undefined
          ? { symbols: new Set(symbols), alwaysReturns: false, alwaysTransfers: false }
          : validateBlockStructure(statement.elseBranch, symbols, functionName, loopDepth);
        for (const name of thenResult.symbols) if (elseResult.symbols.has(name)) symbols.add(name);
        alwaysReturns = statement.elseBranch !== undefined && thenResult.alwaysReturns && elseResult.alwaysReturns;
        alwaysTransfers = statement.elseBranch !== undefined && thenResult.alwaysTransfers && elseResult.alwaysTransfers;
      }
    }
    return { symbols, alwaysReturns, alwaysTransfers };
  }

  validateTopLevelFunctionPlacement(program.statements, true);
  for (const info of functions.values()) {
    validateBlockStructure(info.declaration.body, new Set(info.declaration.parameters), info.declaration.name);
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
    if (expression.kind === "AbsenceLiteral") return { kind: "AbsenceLiteral", valueType: "absence" };
    if (expression.kind === "ArrayLiteral") {
      if (expression.elements.length === 0) throw new KwechiriError("Ndepụta efu akwadoghị ugbu a. (Empty arrays are not yet supported.)", expression.location, fileName);
      const elements = expression.elements.map((element) => resolveExpression(element, symbols));
      const elementType = elements[0]?.valueType as ValueType;
      if (elements.some((element) => element.valueType !== elementType)) throw new KwechiriError("Ihe niile dị na ndepụta ga-enwe otu ụdị. (Array elements must share a type.)", expression.location, fileName);
      return { kind: "ArrayLiteral", elements, valueType: arrayType(elementType) };
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
      const data = collectionData(collection.valueType);
      validateIndex(expression.index, index, knownLengthOf(collection), expression.location);
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
      const standard = standardBindings.get(expression.callee);
      if (standard !== undefined) {
        const arguments_ = expression.arguments.map((argument) => resolveExpression(argument, symbols));
        if (arguments_.length !== standard.arity) {
          throw new KwechiriError(`Ọrụ "${standard.publicName}" chọrọ argument ${standard.arity}, mana enwetara ${arguments_.length}. (Wrong standard-library argument count.)`, expression.location, fileName);
        }
        for (const [index, argument] of arguments_.entries()) {
          const expected = standard.parameterTypes[index];
          if (argument.valueType !== expected) {
            throw new KwechiriError(`Argument ${index + 1} nke "${standard.publicName}" ga-abụ ${expected}. (Standard-library argument type mismatch.)`, expression.arguments[index]?.location ?? expression.location, fileName);
          }
        }
        return {
          kind: "CallExpression",
          generatedName: expression.callee,
          arguments: arguments_,
          valueType: standard.returnType,
          standardIntrinsic: standard.intrinsic,
        };
      }
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
      if (expression.operator === "ọ bụghị") {
        if (operand.valueType !== "boolean") throw new KwechiriError('Akara "ọ bụghị" chọrọ boolean. (Logical negation requires a boolean.)', expression.location, fileName);
        return { kind: "UnaryExpression", operator: "ọ bụghị", operand, valueType: "boolean" };
      }
      if (operand.valueType !== "number") throw new KwechiriError('Akara "-" chọrọ ọnụọgụ. (Unary "-" requires a number.)', expression.location, fileName);
      return { kind: "UnaryExpression", operator: "-", operand, valueType: "number" };
    }
    if (expression.kind === "BinaryExpression") {
      const left = resolveExpression(expression.left, symbols);
      const right = resolveExpression(expression.right, symbols);
      if (left.valueType !== "number" || right.valueType !== "number") throw new KwechiriError(`Akara "${expression.operator}" chọrọ ọnụọgụ abụọ. (Arithmetic requires two numbers.)`, expression.location, fileName);
      return { kind: "BinaryExpression", operator: expression.operator, left, right, valueType: "number", location: expression.location };
    }
    if (expression.kind === "LogicalExpression") {
      const left = resolveExpression(expression.left, symbols);
      const right = resolveExpression(expression.right, symbols);
      if (left.valueType !== "boolean" || right.valueType !== "boolean") {
        throw new KwechiriError(`Akara "${expression.operator}" chọrọ boolean abụọ. (Logical operator requires two booleans.)`, expression.location, fileName);
      }
      return { kind: "LogicalExpression", operator: expression.operator, left, right, valueType: "boolean" };
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
    return {
      kind: "VariableReference",
      generatedName: symbol.generatedName,
      location: expression.location,
      valueType: symbol.valueType,
      ...(symbol.knownLength === undefined ? {} : { knownLength: symbol.knownLength }),
    };
  };

  const promoteDeclaration = (statement: ResolvedStatement, name: string): ResolvedStatement => {
    if (statement.kind === "VariableAssignment") return statement.generatedName === name ? { ...statement, declaration: false } : statement;
    if (statement.kind !== "ConditionalStatement") return statement;
    return { ...statement, hoistedDeclarations: statement.hoistedDeclarations.filter((item) => item !== name), thenBranch: statement.thenBranch.map((child) => promoteDeclaration(child, name)), ...(statement.elseBranch === undefined ? {} : { elseBranch: statement.elseBranch.map((child) => promoteDeclaration(child, name)) }) };
  };

  const resolveBlock = (source: readonly Statement[], initial: ReadonlyMap<string, SymbolInfo>, allowReturn: boolean, loopDepth = 0): BlockResult => {
    const symbols = new Map(initial);
    const statements: ResolvedStatement[] = [];
    const returnTypes: ValueType[] = [];
    let alwaysReturns = false;
    let alwaysTransfers = false;
    for (const statement of source) {
      if (alwaysTransfers) {
        const message = alwaysReturns
          ? "Okwu a agaghị eru n'ihi `laghachi`. (Unreachable statement after return.)"
          : "Okwu a agaghị eru mgbe njikwa kwụsịrị. (Unreachable statement after control transfer.)";
        throw new KwechiriError(message, statement.location, fileName);
      }
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
        alwaysTransfers = true;
        continue;
      }
      if (statement.kind === "BreakStatement" || statement.kind === "ContinueStatement") {
        if (loopDepth === 0) {
          const word = statement.kind === "BreakStatement" ? "kwụsị" : "gaa n'ihu";
          throw new KwechiriError(`"${word}" ga-adị n'ime loop. (Loop control is only valid inside a loop.)`, statement.location, fileName);
        }
        statements.push({ kind: statement.kind });
        alwaysTransfers = true;
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
        const knownLength = knownLengthOf(value);
        symbols.set(statement.name, { generatedName, valueType: value.valueType, ...(knownLength === undefined ? {} : { knownLength }) });
        continue;
      }
      if (statement.kind === "IndexAssignment") {
        const collection = resolveExpression(statement.collection, symbols);
        if (!collection.valueType.startsWith("array|")) {
          throw new KwechiriError("Enwere ike ịgbanwe index naanị na ndepụta. (Index assignment requires an array.)", statement.location, fileName);
        }
        const index = resolveExpression(statement.index, symbols);
        validateIndex(statement.index, index, knownLengthOf(collection), statement.location);
        const value = resolveExpression(statement.value, symbols);
        const elementType = collectionData(collection.valueType).element;
        if (value.valueType !== elementType) {
          throw new KwechiriError("Ụdị uru ọhụrụ ga-adaba n'ụdị ihe ndepụta. (Assigned value must match the array element type.)", statement.location, fileName);
        }
        statements.push({ kind: "IndexAssignment", collection, index, value, location: statement.location });
        continue;
      }
      if (statement.kind === "PropertyAssignment") {
        const object = resolveExpression(statement.object, symbols);
        if (!object.valueType.startsWith("object|")) {
          throw new KwechiriError("Ịgbanwe property chọrọ object. (Property assignment requires an object.)", statement.location, fileName);
        }
        const propertyType = collectionData(object.valueType)[statement.property];
        if (typeof propertyType !== "string") {
          throw new KwechiriError(`Property "${statement.property}" adịghị. (Missing property.)`, statement.location, fileName);
        }
        const value = resolveExpression(statement.value, symbols);
        if (value.valueType !== propertyType) {
          throw new KwechiriError("Ụdị uru ọhụrụ ga-adaba n'ụdị property. (Assigned value must match the property type.)", statement.location, fileName);
        }
        statements.push({ kind: "PropertyAssignment", object, property: statement.property, value });
        continue;
      }
      if (statement.kind === "LoopStatement") {
        const condition = resolveExpression(statement.condition, symbols);
        if (condition.valueType !== "boolean") throw new KwechiriError("Ọnọdụ `mgbe` ga-abụ eziokwu maọbụ ụgha. (A loop condition must be boolean.)", statement.condition.location, fileName);
        const body = resolveBlock(statement.body, symbols, allowReturn, loopDepth + 1);
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
      const thenResult = resolveBlock(statement.thenBranch, symbols, allowReturn, loopDepth);
      const elseResult = statement.elseBranch === undefined
        ? { statements: [], symbols: new Map(symbols), returnTypes: [], alwaysReturns: false, alwaysTransfers: false }
        : resolveBlock(statement.elseBranch, symbols, allowReturn, loopDepth);
      const merged = new Map(symbols);
      const hoisted: string[] = [];
      let thenStatements = [...thenResult.statements];
      let elseStatements = [...elseResult.statements];
      for (const [name, thenSymbol] of thenResult.symbols) {
        const elseSymbol = elseResult.symbols.get(name);
        if (elseSymbol === undefined) continue;
        if (thenSymbol.valueType !== elseSymbol.valueType) throw new KwechiriError(`Ụdị mgbanwe "${name}" adabaghị n'alaka abụọ. (Branch variable types differ.)`, statement.location, fileName);
        const knownLength = thenSymbol.knownLength === elseSymbol.knownLength ? thenSymbol.knownLength : undefined;
        merged.set(name, { generatedName: thenSymbol.generatedName, valueType: thenSymbol.valueType, ...(knownLength === undefined ? {} : { knownLength }) });
        if (!symbols.has(name)) {
          hoisted.push(thenSymbol.generatedName);
          thenStatements = thenStatements.map((child) => promoteDeclaration(child, thenSymbol.generatedName));
          elseStatements = elseStatements.map((child) => promoteDeclaration(child, thenSymbol.generatedName));
        }
      }
      statements.push({ kind: "ConditionalStatement", condition, thenBranch: thenStatements, ...(statement.elseBranch === undefined ? {} : { elseBranch: elseStatements }), hoistedDeclarations: hoisted });
      returnTypes.push(...thenResult.returnTypes, ...elseResult.returnTypes);
      alwaysReturns = thenResult.alwaysReturns && statement.elseBranch !== undefined && elseResult.alwaysReturns;
      alwaysTransfers = thenResult.alwaysTransfers && statement.elseBranch !== undefined && elseResult.alwaysTransfers;
      symbols.clear(); for (const [name, symbol] of merged) symbols.set(name, symbol);
    }
    return { statements, symbols, returnTypes, alwaysReturns, alwaysTransfers };
  };

  const analyzeFunction = (info: FunctionInfo, parameterTypes: readonly ValueType[]): ValueType => {
    if (info.analyzing) throw new KwechiriError(`Recursion akwadoghị maka ọrụ "${info.declaration.name}".`, info.declaration.location, fileName);
    if (info.parameterTypes !== undefined) {
      const matches = info.parameterTypes.length === parameterTypes.length
        && info.parameterTypes.every((type, index) => type === parameterTypes[index]);
      if (!matches) {
        throw new KwechiriError(
          `Ụdị argument ọrụ "${info.declaration.name}" adabaghị na signature mbụ ya. (Function calls must use one parameter signature.)`,
          info.declaration.location,
          fileName,
        );
      }
      return info.returnType as ValueType;
    }
    info.analyzing = true;
    try {
      const symbols = new Map<string, SymbolInfo>();
      const parameters = info.declaration.parameters.map((name, index) => `_kweP${info.generatedName.slice(6)}_${index}`);
      info.declaration.parameters.forEach((name, index) => symbols.set(name, { generatedName: parameters[index] as string, valueType: parameterTypes[index] as ValueType }));
      const result = resolveBlock(info.declaration.body, symbols, true);
      const fallthroughType: ValueType = "absence";
      if (!result.alwaysReturns && result.returnTypes.some((type) => type !== fallthroughType)) {
        throw new KwechiriError(`Ụdị nloghachi ọrụ "${info.declaration.name}" adabaghị na efu nke ụzọ na-enweghị "laghachi". (Return type conflicts with fallthrough absence.)`, info.declaration.location, fileName);
      }
      const returnType = (result.returnTypes[0] ?? fallthroughType) as ValueType;
      if (result.returnTypes.some((type) => type !== returnType)) throw new KwechiriError(`Ụdị nloghachi ọrụ "${info.declaration.name}" adabaghị. (Return types differ.)`, info.declaration.location, fileName);
      const body = result.alwaysReturns ? result.statements : [
        ...result.statements,
        { kind: "ReturnStatement", value: { kind: "AbsenceLiteral", valueType: "absence" } } as const,
      ];
      info.parameterTypes = [...parameterTypes];
      info.returnType = returnType;
      info.resolved = { generatedName: info.generatedName, parameters, body };
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
