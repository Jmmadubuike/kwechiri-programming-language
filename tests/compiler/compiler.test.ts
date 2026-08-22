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

  it("compiles a type-stable mgbe loop", () => {
    expect(compile("ọnụọgụ = 1\nmgbe (ọnụọgụ <= 2) { ọnụọgụ = ọnụọgụ + 1 }")).toBe(
      "let _kwe0 = 1;\nwhile ((_kwe0 <= 2)) {\n  _kwe0 = (_kwe0 + 1);\n}\n",
    );
  });

  it("requires a boolean mgbe condition", () => {
    expect(() => compile("mgbe (1) { bipụta(1) }", "loops.kwe")).toThrow(
      /Ọnọdụ `mgbe` ga-abụ eziokwu maọbụ ụgha/,
    );
  });

  it("does not expose a loop-local variable afterward", () => {
    expect(() => compile('mgbe (ụgha) { aha = "Uche" }\nbipụta(aha)', "loops.kwe")).toThrow(
      /Enweghị ike ịchọta mgbanwe "aha"/,
    );
  });

  it("rejects loop-carried type changes", () => {
    expect(() => compile('uru = 1\nmgbe (ụgha) { uru = "otu" }', "loops.kwe")).toThrow(
      /Ụdị mgbanwe "uru" ga-anọ otu n'ime `mgbe`/,
    );
  });

  it("compiles a declared function and call with safe names", () => {
    const source = "ọrụ gbakọọ(a, b) { laghachi a + b }\nnsonaazụ = gbakọọ(10, 20)\nbipụta(nsonaazụ)";
    expect(compile(source)).toBe(
      "function _kweFn0(_kweP0_0, _kweP0_1) {\n  return (_kweP0_0 + _kweP0_1);\n}\nlet _kwe0 = _kweFn0(10, 20);\nconsole.log(_kwe0);\n",
    );
  });

  it("rejects calls before declaration", () => {
    expect(() => compile("bipụta(gbakọọ(1, 2))\nọrụ gbakọọ(a, b) { laghachi a + b }", "functions.kwe")).toThrow(
      /Function must be declared before use/,
    );
  });

  it("rejects incorrect argument counts", () => {
    expect(() => compile("ọrụ gbakọọ(a, b) { laghachi a + b }\nbipụta(gbakọọ(1))", "functions.kwe")).toThrow(
      /Wrong argument count/,
    );
  });

  it("rejects captures of program variables", () => {
    expect(() => compile("uru = 10\nọrụ nweta() { laghachi uru }\nbipụta(nweta())", "functions.kwe")).toThrow(
      /Undefined variable/,
    );
  });

  it("requires every function path to return", () => {
    expect(() => compile("ọrụ họrọ(x) { ọ bụrụ (x > 0) { laghachi x } }\nbipụta(họrọ(1))", "functions.kwe")).toThrow(
      /Every path must return/,
    );
  });

  it("rejects recursion in Milestone 6", () => {
    expect(() => compile("ọrụ kpọọ(x) { laghachi kpọọ(x) }\nbipụta(kpọọ(1))", "functions.kwe")).toThrow(
      /Recursion akwadoghị/,
    );
  });

  it("checks argument types against parameter use", () => {
    expect(() => compile('ọrụ gbakọọ(a, b) { laghachi a + b }\nbipụta(gbakọọ("otu", "abụọ"))', "functions.kwe")).toThrow(
      /Arithmetic requires two numbers/,
    );
  });

  it("does not invent argument types for an uncalled function", () => {
    expect(() => compile('ọrụ họrọ(x) { ọ bụrụ (x) { laghachi "ee" } ọzọ { laghachi "mba" } }')).not.toThrow();
  });

  it("compiles arrays, objects, indexing, and property access", () => {
    const source = 'ahaNdị = ["Uche", "Ada"]\nmmadụ = { aha: ahaNdị[0], afọ: 36 }\nbipụta(mmadụ.aha)';
    const output = compile(source);
    expect(output).toContain('let _kwe0 = ["Uche", "Ada"];');
    expect(output).toContain('let _kwe1 = {"aha": _kweIndex(_kwe0, 0), "afọ": 36};');
    expect(output).toContain('console.log(_kwe1["aha"]);');
  });

  it("rejects heterogeneous and empty arrays", () => {
    expect(() => compile('a = [1, "abụọ"]')).toThrow(/Array elements must share a type/);
    expect(() => compile("a = []")).toThrow(/Empty arrays are not yet supported/);
  });

  it("rejects known out-of-range indexes and missing properties", () => {
    expect(() => compile("a = [1, 2]\nbipụta(a[2])")).toThrow(/Array index out of range/);
    expect(() => compile('a = { aha: "Uche" }\nbipụta(a.afọ)')).toThrow(/Missing property/);
  });

  it("rejects collection equality", () => {
    expect(() => compile("a = [1]\nb = [1]\nbipụta(a == b)")).toThrow(/Collection equality is not yet supported/);
  });

  it("guards dynamic indexes at runtime", () => {
    const javaScript = compile("a = [1, 2]\ni = 3\nbipụta(a[i])");
    expect(() => executeJavaScript(javaScript)).toThrow(/Array index out of range/);
  });

  it("emits collection formatting support for nested print statements", () => {
    const javaScript = compile("a = [1, 2]\nọ bụrụ (eziokwu) { bipụta(a) }");
    expect(javaScript).toContain("function _kweFormat");
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    executeJavaScript(javaScript);
    expect(log).toHaveBeenCalledWith("[1,2]");
    log.mockRestore();
  });
});
