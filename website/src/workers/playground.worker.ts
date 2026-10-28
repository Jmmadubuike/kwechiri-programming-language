import { compileSingleSource } from "../../../src/compiler/compile-single-source.js";
import { KwechiriError, type SourceLocation } from "../../../src/errors/kwechiri-error.js";
import {
  KwechiriRuntimeError,
  type KwechiriRuntime,
} from "../../../src/runtime/kwechiri-runtime.js";
import { standardLibrary } from "../../../src/standard-library/standard-library.js";
import type {
  PlaygroundRunRequest,
  PlaygroundWorkerResponse,
} from "../lib/playground-protocol";

const MAX_OUTPUT_LINES = 1_000;
const MAX_OUTPUT_BYTES = 64 * 1024;
const fileName = "playground.kwe";
const outputEncoder = new TextEncoder();

class PlaygroundOutputLimitError extends Error {
  public constructor() {
    super("Program output exceeded the playground limit of 1,000 lines or 64 KiB.");
    this.name = "PlaygroundOutputLimitError";
  }
}

class BrowserKwechiriRuntime implements KwechiriRuntime {
  private readonly lines: string[] = [];

  public print(value: unknown, _location: SourceLocation): void {
    this.lines.push(String(this.formatValue(value, false)));
    if (this.lines.length > MAX_OUTPUT_LINES
      || outputEncoder.encode(this.lines.join("\n")).byteLength > MAX_OUTPUT_BYTES) {
      throw new PlaygroundOutputLimitError();
    }
  }

  public divide(left: number, right: number, location: SourceLocation): number {
    if (right === 0) {
      throw new KwechiriRuntimeError(
        "Enweghị ike ikewa site na efu. (Division by zero.)",
        "DIVISION_BY_ZERO",
        location,
        fileName,
      );
    }
    return left / right;
  }

  public index(collection: readonly unknown[], index: number, location: SourceLocation): unknown {
    this.assertValidIndex(collection, index, location);
    return collection[index];
  }

  public setIndex(collection: unknown[], index: number, value: unknown, location: SourceLocation): void {
    this.assertValidIndex(collection, index, location);
    collection[index] = value;
  }

  public getOutput(): string {
    return this.lines.join("\n");
  }

  private assertValidIndex(collection: readonly unknown[], index: number, location: SourceLocation): void {
    if (!Number.isFinite(index) || !Number.isInteger(index) || index < 0 || index >= collection.length) {
      throw new KwechiriRuntimeError(
        "Index ndepụta gafere oke. (Array index out of range.)",
        "INDEX_OUT_OF_RANGE",
        location,
        fileName,
      );
    }
  }

  private formatValue(value: unknown, nested: boolean): unknown {
    if (value === null) return "efu";
    if (typeof value === "boolean") return value ? "eziokwu" : "ụgha";
    if (typeof value === "string") return nested ? JSON.stringify(value) : value;
    if (Array.isArray(value)) return `[${value.map((item) => String(this.formatValue(item, true))).join(",")}]`;
    if (typeof value === "object") {
      return `{${Object.entries(value as Readonly<Record<string, unknown>>)
        .map(([key, item]) => `${JSON.stringify(key)}:${String(this.formatValue(item, true))}`)
        .join(",")}}`;
    }
    return value;
  }
}

interface WorkerScope {
  onmessage: ((event: MessageEvent<PlaygroundRunRequest>) => void) | null;
  postMessage(message: PlaygroundWorkerResponse): void;
}

const workerScope = self as unknown as WorkerScope;

const diagnosticLocation = (error: KwechiriError | KwechiriRuntimeError) => ({
  fileName: error.fileName ?? fileName,
  line: error.location.line,
  column: error.location.column,
});

const run = (request: PlaygroundRunRequest): void => {
  const start = performance.now();
  try {
    const javaScript = compileSingleSource(request.source, fileName);
    const runtime = new BrowserKwechiriRuntime();
    const execute = new Function(
      "_kweRuntime",
      "_kweStandardLibrary",
      `"use strict";\n${javaScript}`,
    ) as (runtime: KwechiriRuntime, library: typeof standardLibrary) => void;
    execute(runtime, standardLibrary);
    workerScope.postMessage({
      type: "success",
      requestId: request.requestId,
      output: runtime.getOutput(),
      elapsedMs: Math.round(performance.now() - start),
    });
  } catch (error: unknown) {
    if (error instanceof PlaygroundOutputLimitError) {
      workerScope.postMessage({
        type: "diagnostic",
        requestId: request.requestId,
        kind: "limit",
        message: error.message,
      });
      return;
    }
    if (error instanceof KwechiriRuntimeError) {
      workerScope.postMessage({
        type: "diagnostic",
        requestId: request.requestId,
        kind: "runtime",
        message: error.message,
        location: diagnosticLocation(error),
      });
      return;
    }
    if (error instanceof KwechiriError) {
      workerScope.postMessage({
        type: "diagnostic",
        requestId: request.requestId,
        kind: "compile",
        message: error.message,
        location: diagnosticLocation(error),
      });
      return;
    }
    workerScope.postMessage({
      type: "diagnostic",
      requestId: request.requestId,
      kind: "internal",
      message: "The playground could not run this program. No host stack trace was exposed.",
    });
  }
};

workerScope.onmessage = (event): void => {
  if (event.data.type === "run") run(event.data);
};
