import type { SourceLocation } from "../errors/kwechiri-error.js";

export interface Program {
  readonly kind: "Program";
  readonly statements: readonly Statement[];
}

export type Statement = PrintStatement | VariableAssignment | ConditionalStatement;

export type Expression =
  | StringLiteral
  | NumberLiteral
  | VariableReference
  | UnaryExpression
  | BinaryExpression
  | BooleanLiteral
  | ComparisonExpression;

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

export interface VariableReference {
  readonly kind: "VariableReference";
  readonly name: string;
  readonly location: SourceLocation;
}

export interface UnaryExpression {
  readonly kind: "UnaryExpression";
  readonly operator: "-";
  readonly operand: Expression;
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
