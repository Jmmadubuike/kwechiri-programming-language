import { describe, expect, it, vi } from "vitest";
import { compile } from "../../src/compiler/compile.js";
import { executeJavaScript } from "../../src/runtime/execute.js";
import { KwechiriRuntimeError, type KwechiriRuntime } from "../../src/runtime/kwechiri-runtime.js";
import { NodeKwechiriRuntime } from "../../src/runtime/node-runtime.js";

describe("Kwechiri runtime", () => {
  it("injects runtime operations into isolated generated programs", () => {
    const print = vi.fn();
    const runtime: KwechiriRuntime = {
      print,
      divide: (left, right) => left / right,
      index: (collection, index) => collection[index],
      setIndex: (collection, index, value) => { collection[index] = value; },
    };
    executeJavaScript(compile('bipụta("Ndewo")'), "hello.kwe", runtime);
    expect(print).toHaveBeenCalledWith("Ndewo", { line: 1, column: 1, offset: 0 });
  });

  it("categorizes division failures with their Kwechiri location", () => {
    const runtime = new NodeKwechiriRuntime("zero.kwe", () => undefined);
    expect(() => runtime.divide(10, 0, { line: 4, column: 8, offset: 30 })).toThrowError(
      expect.objectContaining<Partial<KwechiriRuntimeError>>({
        category: "DIVISION_BY_ZERO",
        fileName: "zero.kwe",
        location: { line: 4, column: 8, offset: 30 },
      }),
    );
  });

  it("formats collections consistently in the Node host", () => {
    const output = vi.fn();
    const runtime = new NodeKwechiriRuntime("collections.kwe", output);
    runtime.print({ aha: "Uche", afọ: 36 }, { line: 1, column: 1, offset: 0 });
    expect(output).toHaveBeenCalledWith('{"aha":"Uche","afọ":36}');
  });

  it("formats booleans and absence with Kwechiri vocabulary at every depth", () => {
    const output = vi.fn();
    const runtime = new NodeKwechiriRuntime("values.kwe", output);
    const location = { line: 1, column: 1, offset: 0 };
    runtime.print(true, location);
    runtime.print(false, location);
    runtime.print(null, location);
    runtime.print({ ezi: true, ihe: [null, false] }, location);
    expect(output.mock.calls.map(([value]) => value)).toEqual([
      "eziokwu",
      "ụgha",
      "efu",
      '{"ezi":eziokwu,"ihe":[efu,ụgha]}',
    ]);
  });

  it("mutates only valid existing array indexes", () => {
    const runtime = new NodeKwechiriRuntime("mutation.kwe", () => undefined);
    const location = { line: 2, column: 4, offset: 12 };
    const values: unknown[] = [1, 2];
    runtime.setIndex(values, 1, 10, location);
    expect(values).toEqual([1, 10]);
    for (const index of [-1, 0.5, 2, Number.POSITIVE_INFINITY]) {
      expect(() => runtime.setIndex(values, index, 3, location)).toThrowError(
        expect.objectContaining<Partial<KwechiriRuntimeError>>({ category: "INDEX_OUT_OF_RANGE", location }),
      );
    }
  });
});
