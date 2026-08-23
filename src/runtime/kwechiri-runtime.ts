import type { SourceLocation } from "../errors/kwechiri-error.js";

export type RuntimeErrorCategory = "DIVISION_BY_ZERO" | "INDEX_OUT_OF_RANGE";

export class KwechiriRuntimeError extends Error {
  public constructor(
    message: string,
    public readonly category: RuntimeErrorCategory,
    public readonly location: SourceLocation,
    public readonly fileName: string,
  ) {
    super(`${fileName}:${location.line}:${location.column}: ${message}`);
    this.name = "KwechiriRuntimeError";
  }
}

export interface KwechiriRuntime {
  print(value: unknown, location: SourceLocation): void;
  divide(left: number, right: number, location: SourceLocation): number;
  index(collection: readonly unknown[], index: number, location: SourceLocation): unknown;
  setIndex(collection: unknown[], index: number, value: unknown, location: SourceLocation): void;
}
