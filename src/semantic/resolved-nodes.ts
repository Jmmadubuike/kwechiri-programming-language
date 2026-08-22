import type { SourceLocation } from "../errors/kwechiri-error.js";

export interface ResolvedProgram {
  readonly statements: readonly ResolvedStatement[];
}

export type ResolvedStatement = ResolvedPrintStatement | ResolvedVariableAssignment;
export type ResolvedExpression = ResolvedStringLiteral | ResolvedNumberLiteral | ResolvedVariableReference;

export interface ResolvedPrintStatement {
  readonly kind: "PrintStatement";
  readonly value: ResolvedExpression;
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
}

export interface ResolvedNumberLiteral {
  readonly kind: "NumberLiteral";
  readonly value: number;
}

export interface ResolvedVariableReference {
  readonly kind: "VariableReference";
  readonly generatedName: string;
  readonly location: SourceLocation;
}
