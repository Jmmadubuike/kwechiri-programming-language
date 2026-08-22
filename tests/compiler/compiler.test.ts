import { describe, expect, it, vi } from "vitest";
import { compile } from "../../src/compiler/compile.js";
import { executeJavaScript } from "../../src/runtime/execute.js";

describe("compiler", () => {
  it("compiles bipụta with an Igbo string to JavaScript", () => {
    expect(compile('bipụta("Ndewo Ụwa!")')).toBe('console.log("Ndewo Ụwa!");\n');
  });

  it("executes the generated JavaScript", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    executeJavaScript(compile('bipụta("Ndewo Ụwa!")'));
    expect(log).toHaveBeenCalledWith("Ndewo Ụwa!");
    log.mockRestore();
  });

  it("rejects language behavior outside Milestone 1", () => {
    expect(() => compile('aha = "Uche"', "variables.kwe")).toThrow(
      /variables\.kwe:1:1: A tụrụ anya "bipụta"/,
    );
  });
});
