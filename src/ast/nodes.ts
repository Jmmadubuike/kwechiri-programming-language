import type { SourceLocation } from "../errors/kwechiri-error.js";

export interface Program {
  readonly kind: "Program";
  readonly statements: readonly Statement[];
}

export type Statement =
  | PrintStatement
  | VariableAssignment
  | IndexAssignment
  | PropertyAssignment
  | ConditionalStatement
  | LoopStatement
  | FunctionDeclaration
  | ReturnStatement;

export type Expression =
  | StringLiteral
  | NumberLiteral
  | VariableReference
  | UnaryExpression
  | BinaryExpression
  | BooleanLiteral
  | AbsenceLiteral
  | ComparisonExpression
  | LogicalExpression
  | CallExpression
  | ArrayLiteral
  | ObjectLiteral
  | IndexExpression
  | PropertyAccessExpression;

export interface PrintStatement {
  readonly kind: "PrintStatement";
  readonly value: Expression;
  readonly location: SourceLocation;
}

export interface VariableAssignment {
  readonly kind: "VariableAssignment";
  readonly name: string;
  readonly value: Expression;
  readonly location: SourceLocation;
}

export interface IndexAssignment {
  readonly kind: "IndexAssignment";
  readonly collection: Expression;
  readonly index: Expression;
  readonly value: Expression;
  readonly location: SourceLocation;
}

export interface PropertyAssignment {
  readonly kind: "PropertyAssignment";
  readonly object: Expression;
  readonly property: string;
  readonly value: Expression;
  readonly location: SourceLocation;
}

export interface StringLiteral {
  readonly kind: "StringLiteral";
  readonly value: string;
  readonly location: SourceLocation;
}

export interface NumberLiteral {
  readonly kind: "NumberLiteral";
  readonly value: number;
  readonly location: SourceLocation;
}

export interface BooleanLiteral {
  readonly kind: "BooleanLiteral";
  readonly value: boolean;
  readonly location: SourceLocation;
}

export interface AbsenceLiteral {
  readonly kind: "AbsenceLiteral";
  readonly location: SourceLocation;
}

export interface VariableReference {
  readonly kind: "VariableReference";
  readonly name: string;
  readonly location: SourceLocation;
}

export interface UnaryExpression {
  readonly kind: "UnaryExpression";
  readonly operator: "-" | "ọ bụghị";
  readonly operand: Expression;
  readonly location: SourceLocation;
}

export interface LogicalExpression {
  readonly kind: "LogicalExpression";
  readonly operator: "na" | "maọbụ";
  readonly left: Expression;
  readonly right: Expression;
  readonly location: SourceLocation;
}

export interface BinaryExpression {
  readonly kind: "BinaryExpression";
  readonly operator: "+" | "-" | "*" | "/";
  readonly left: Expression;
  readonly right: Expression;
  readonly location: SourceLocation;
}

export interface ComparisonExpression {
  readonly kind: "ComparisonExpression";
  readonly operator: "==" | "!=" | "<" | "<=" | ">" | ">=";
  readonly left: Expression;
  readonly right: Expression;
  readonly location: SourceLocation;
}

export interface ConditionalStatement {
  readonly kind: "ConditionalStatement";
  readonly condition: Expression;
  readonly thenBranch: readonly Statement[];
  readonly elseBranch?: readonly Statement[];
  readonly location: SourceLocation;
}

export interface LoopStatement {
  readonly kind: "LoopStatement";
  readonly condition: Expression;
  readonly body: readonly Statement[];
  readonly location: SourceLocation;
}

export interface FunctionDeclaration {
  readonly kind: "FunctionDeclaration";
  readonly name: string;
  readonly parameters: readonly string[];
  readonly body: readonly Statement[];
  readonly location: SourceLocation;
}

export interface ReturnStatement {
  readonly kind: "ReturnStatement";
  readonly value: Expression;
  readonly location: SourceLocation;
}

export interface CallExpression {
  readonly kind: "CallExpression";
  readonly callee: string;
  readonly arguments: readonly Expression[];
  readonly location: SourceLocation;
}

export interface ArrayLiteral {
  readonly kind: "ArrayLiteral";
  readonly elements: readonly Expression[];
  readonly location: SourceLocation;
}

export interface ObjectLiteral {
  readonly kind: "ObjectLiteral";
  readonly fields: readonly { readonly name: string; readonly value: Expression; readonly location: SourceLocation }[];
  readonly location: SourceLocation;
}

export interface IndexExpression {
  readonly kind: "IndexExpression";
  readonly collection: Expression;
  readonly index: Expression;
  readonly location: SourceLocation;
}

export interface PropertyAccessExpression {
  readonly kind: "PropertyAccessExpression";
  readonly object: Expression;
  readonly property: string;
  readonly location: SourceLocation;
}
