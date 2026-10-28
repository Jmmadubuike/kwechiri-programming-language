import { describe, expect, it, vi } from "vitest";
import { compileSingleSource } from "../../src/compiler/compile-single-source.js";
import { KwechiriError } from "../../src/errors/kwechiri-error.js";
import { executeJavaScript } from "../../src/runtime/execute.js";

const outputOf = (source: string): unknown[] => {
  const output = vi.fn();
  executeJavaScript(compileSingleSource(source, "playground.kwe"), "playground.kwe", {
    print: output,
    divide: (left, right) => {
      if (right === 0) throw new Error("Division by zero.");
      return left / right;
    },
    index: (collection, index) => collection[index],
    setIndex: (collection, index, value) => { collection[index] = value; },
  });
  return output.mock.calls.map(([value]) => value);
};

describe("single-source browser compilation", () => {
  it("compiles a self-contained program through the existing compiler pipeline", () => {
    expect(outputOf('bipụta("Ndewo Ụwa!")')).toEqual(["Ndewo Ụwa!"]);
  });

  it("supports explicit standard imports without filesystem access", () => {
    const source = [
      'webata { nwereEriri, ogologoEriri, jikọọEriri } site na "kwechiri:eriri"',
      'bipụta(nwereEriri("Kwechiri", "chiri"))',
      'bipụta(ogologoEriri("ụbọchị"))',
      'bipụta(jikọọEriri("Kwe", "chiri"))',
    ].join("\n");
    expect(outputOf(source)).toEqual([true, 6, "Kwechiri"]);
  });

  it("rejects filesystem modules with a located playground limitation", () => {
    expect(() => compileSingleSource('webata { aha } site na "./aha.kwe"', "playground.kwe"))
      .toThrowError(/playground.kwe:1:1:.*Filesystem modules are unavailable/);
  });

  it("rejects unknown or late standard imports with source locations", () => {
    expect(() => compileSingleSource('webata { nwereEriri } site na "kwechiri:amaghị"', "unknown.kwe"))
      .toThrowError(/unknown\.kwe:1:1:.*Unknown Kwechiri standard module/);
    expect(() => compileSingleSource('aha = "Ada"\nwebata { nwereEriri } site na "kwechiri:eriri"', "late.kwe"))
      .toThrowError(/late\.kwe:2:1:.*Imports must come first/);
  });

  it("rejects imported binding reassignment and local collisions", () => {
    expect(() => compileSingleSource('webata { nwereEriri } site na "kwechiri:eriri"\nnwereEriri = 1', "rebind.kwe"))
      .toThrowError(/rebind\.kwe:1:1:.*imported bindings are read-only/i);
    expect(() => compileSingleSource('webata { nwereEriri } site na "kwechiri:eriri"\nbipụta(nwereEriri)\nnwereEriri = 1', "collision.kwe"))
      .toThrowError(/collision\.kwe:1:1:.*imported\/local binding collision/i);
  });

  it("preserves compiler diagnostics as Kwechiri errors", () => {
    expect(() => compileSingleSource("bipụta(amaghị)", "invalid.kwe"))
      .toThrow(KwechiriError);
    expect(() => compileSingleSource("bipụta(amaghị)", "invalid.kwe"))
      .toThrowError(/invalid\.kwe:1:8:/);
  });
});
