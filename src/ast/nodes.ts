import type { SourceLocation } from "../errors/kwechiri-error.js";

export interface Program {
  readonly kind: "Program";
  readonly statements: readonly PrintStatement[];
}

export interface PrintStatement {
  readonly kind: "PrintStatement";
  readonly value: StringLiteral;
  readonly location: SourceLocation;
}

export interface StringLiteral {
  readonly kind: "StringLiteral";
  readonly value: string;
  readonly location: SourceLocation;
}
