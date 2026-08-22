import type { SourceLocation } from "../errors/kwechiri-error.js";

export interface ResolvedProgram {
  readonly functions: readonly ResolvedFunctionDeclaration[];
  readonly statements: readonly ResolvedStatement[];
}

export type ResolvedStatement =
  | ResolvedPrintStatement
  | ResolvedVariableAssignment
  | ResolvedConditionalStatement
  | ResolvedLoopStatement
  | ResolvedReturnStatement;
export type ValueType = string;
export type ResolvedExpression =
  | ResolvedStringLiteral
  | ResolvedNumberLiteral
  | ResolvedVariableReference
  | ResolvedUnaryExpression
  | ResolvedBinaryExpression
  | ResolvedBooleanLiteral
  | ResolvedComparisonExpression
  | ResolvedCallExpression
  | ResolvedArrayLiteral
  | ResolvedObjectLiteral
  | ResolvedIndexExpression
  | ResolvedPropertyAccessExpression;

export interface ResolvedPrintStatement {
  readonly kind: "PrintStatement";
  readonly value: ResolvedExpression;
  readonly location: SourceLocation;
}

export interface ResolvedVariableAssignment {
  readonly kind: "VariableAssignment";
  readonly generatedName: string;
  readonly declaration: boolean;
  readonly value: ResolvedExpression;
}

export interface ResolvedStringLiteral {
  readonly kind: "StringLiteral";
  readonly value: string;
  readonly valueType: "string";
}

export interface ResolvedNumberLiteral {
  readonly kind: "NumberLiteral";
  readonly value: number;
  readonly valueType: "number";
}

export interface ResolvedVariableReference {
  readonly kind: "VariableReference";
  readonly generatedName: string;
  readonly location: SourceLocation;
  readonly valueType: ValueType;
}

export interface ResolvedUnaryExpression {
  readonly kind: "UnaryExpression";
  readonly operator: "-";
  readonly operand: ResolvedExpression;
  readonly valueType: "number";
}

export interface ResolvedBinaryExpression {
  readonly kind: "BinaryExpression";
  readonly operator: "+" | "-" | "*" | "/";
  readonly left: ResolvedExpression;
  readonly right: ResolvedExpression;
  readonly valueType: "number";
  readonly location: SourceLocation;
}

export interface ResolvedBooleanLiteral {
  readonly kind: "BooleanLiteral";
  readonly value: boolean;
  readonly valueType: "boolean";
}

export interface ResolvedComparisonExpression {
  readonly kind: "ComparisonExpression";
  readonly operator: "==" | "!=" | "<" | "<=" | ">" | ">=";
  readonly left: ResolvedExpression;
  readonly right: ResolvedExpression;
  readonly valueType: "boolean";
}

export interface ResolvedConditionalStatement {
  readonly kind: "ConditionalStatement";
  readonly condition: ResolvedExpression;
  readonly thenBranch: readonly ResolvedStatement[];
  readonly elseBranch?: readonly ResolvedStatement[];
  readonly hoistedDeclarations: readonly string[];
}

export interface ResolvedLoopStatement {
  readonly kind: "LoopStatement";
  readonly condition: ResolvedExpression;
  readonly body: readonly ResolvedStatement[];
}

export interface ResolvedReturnStatement {
  readonly kind: "ReturnStatement";
  readonly value: ResolvedExpression;
}

export interface ResolvedCallExpression {
  readonly kind: "CallExpression";
  readonly generatedName: string;
  readonly arguments: readonly ResolvedExpression[];
  readonly valueType: ValueType;
}

export interface ResolvedFunctionDeclaration {
  readonly generatedName: string;
  readonly parameters: readonly string[];
  readonly body: readonly ResolvedStatement[];
}

export interface ResolvedArrayLiteral {
  readonly kind: "ArrayLiteral";
  readonly elements: readonly ResolvedExpression[];
  readonly valueType: ValueType;
}

export interface ResolvedObjectLiteral {
  readonly kind: "ObjectLiteral";
  readonly fields: readonly { readonly name: string; readonly value: ResolvedExpression }[];
  readonly valueType: ValueType;
}

export interface ResolvedIndexExpression {
  readonly kind: "IndexExpression";
  readonly collection: ResolvedExpression;
  readonly index: ResolvedExpression;
  readonly valueType: ValueType;
  readonly location: SourceLocation;
}

export interface ResolvedPropertyAccessExpression {
  readonly kind: "PropertyAccessExpression";
  readonly object: ResolvedExpression;
  readonly property: string;
  readonly valueType: ValueType;
}
