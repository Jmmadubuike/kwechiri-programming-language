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

  it("compiles strict comparisons and conditional branches", () => {
    const source = 'afọ = 36\nọ bụrụ (afọ >= 18) { ọkwa = "Okenye" } ọzọ { ọkwa = "Nwatakịrị" }\nbipụta(ọkwa)';
    expect(compile(source)).toBe(
      'let _kwe0 = 36;\nlet _kwe1;\nif ((_kwe0 >= 18)) {\n  _kwe1 = "Okenye";\n} else {\n  _kwe1 = "Nwatakịrị";\n}\nconsole.log(_kwe1);\n',
    );
  });

  it("requires a boolean condition", () => {
    expect(() => compile('ọ bụrụ (1) { bipụta("mba") }', "conditions.kwe")).toThrow(
      /conditions\.kwe:1:9: Ọnọdụ ga-abụ eziokwu maọbụ ụgha/,
    );
  });

  it("rejects ordering comparisons between strings", () => {
    expect(() => compile('bipụta("a" < "b")', "conditions.kwe")).toThrow(
      /Ntụnyere "<" chọrọ ọnụọgụ abụọ/,
    );
  });

  it("does not expose a variable created on only one branch", () => {
    expect(() => compile('ọ bụrụ (eziokwu) { aha = "Uche" }\nbipụta(aha)', "conditions.kwe")).toThrow(
      /Enweghị ike ịchọta mgbanwe "aha"/,
    );
  });

  it("rejects incompatible variable types across branches", () => {
    expect(() => compile('ọ bụrụ (eziokwu) { uru = 1 } ọzọ { uru = "otu" }', "conditions.kwe")).toThrow(
      /Ụdị mgbanwe "uru" adabaghị n'alaka abụọ/,
    );
  });

  it("uses strict equality when operand types differ", () => {
    expect(compile('bipụta(1 == "1")')).toBe('console.log((1 === "1"));\n');
  });

  it("preserves the implicit unchanged path when ọzọ is omitted", () => {
    expect(() => compile('uru = 1\nọ bụrụ (eziokwu) { uru = "otu" }', "conditions.kwe")).toThrow(
      /Ụdị mgbanwe "uru" adabaghị n'alaka abụọ/,
    );
  });
});
