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

  it("compiles declarations, reassignment, and Unicode names safely", () => {
    expect(compile('class = "Uche"\nafọ = 36\nclass = afọ\nbipụta(class)')).toBe(
      'let _kwe0 = "Uche";\nlet _kwe1 = 36;\n_kwe0 = _kwe1;\nconsole.log(_kwe0);\n',
    );
  });

  it("rejects a variable read before its first assignment", () => {
    expect(() => compile('bipụta(aha)', "variables.kwe")).toThrow(
      /variables\.kwe:1:8: Enweghị ike ịchọta mgbanwe "aha"/,
    );
  });

  it("does not make a variable visible within its first assignment", () => {
    expect(() => compile("aha = aha", "variables.kwe")).toThrow(
      /variables\.kwe:1:7: Enweghị ike ịchọta mgbanwe "aha"/,
    );
  });

  it("honors grouping, precedence, and unary minus", () => {
    expect(compile("nsonaazụ = (10 + 20) * 2 - -5\nbipụta(nsonaazụ)")).toBe(
      "let _kwe0 = (((10 + 20) * 2) - (-5));\nconsole.log(_kwe0);\n",
    );
  });

  it("rejects strings in arithmetic expressions", () => {
    expect(() => compile('aha = "Uche"\nbipụta(aha + 1)', "expressions.kwe")).toThrow(
      /expressions\.kwe:2:12: Akara "\+" chọrọ ọnụọgụ abụọ/,
    );
  });

  it("emits an explicit division-by-zero guard", () => {
    const javaScript = compile("bipụta(10 / 0)");
    expect(javaScript).toContain("function _kweDivide");
    expect(() => executeJavaScript(javaScript)).toThrow(/Division by zero/);
  });
});
