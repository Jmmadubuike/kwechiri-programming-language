import type { SourceLocation } from "../errors/kwechiri-error.js";
import { KwechiriRuntimeError, type KwechiriRuntime } from "./kwechiri-runtime.js";

export class NodeKwechiriRuntime implements KwechiriRuntime {
  public constructor(
    private readonly fileName: string,
    private readonly write: (value: unknown) => void = console.log,
  ) {}

  public print(value: unknown, _location: SourceLocation): void {
    this.write(typeof value === "object" && value !== null ? JSON.stringify(value) : value);
  }

  public divide(left: number, right: number, location: SourceLocation): number {
    if (right === 0) throw new KwechiriRuntimeError("Enweghị ike ikewa site na efu. (Division by zero.)", "DIVISION_BY_ZERO", location, this.fileName);
    return left / right;
  }

  public index(collection: readonly unknown[], index: number, location: SourceLocation): unknown {
    if (!Number.isInteger(index) || index < 0 || index >= collection.length) {
      throw new KwechiriRuntimeError("Index ndepụta gafere oke. (Array index out of range.)", "INDEX_OUT_OF_RANGE", location, this.fileName);
    }
    return collection[index];
  }
}
