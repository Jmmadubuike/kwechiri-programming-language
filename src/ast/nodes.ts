import type { SourceLocation } from "../errors/kwechiri-error.js";

export interface Program {
  readonly kind: "Program";
  readonly statements: readonly Statement[];
}

export type Statement = PrintStatement | VariableAssignment;

export type Expression = StringLiteral | NumberLiteral | VariableReference;

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

export interface VariableReference {
  readonly kind: "VariableReference";
  readonly name: string;
  readonly location: SourceLocation;
}
