import { describe, expect, it, vi } from "vitest";
import { compile } from "../../src/compiler/compile.js";
import { tokenize } from "../../src/lexer/lexer.js";
import { parse } from "../../src/parser/parser.js";
import { executeJavaScript } from "../../src/runtime/execute.js";

describe("compiler", () => {
  it("compiles bipụta with an Igbo string to JavaScript", () => {
    expect(compile('bipụta("Ndewo Ụwa!")')).toBe('_kweRuntime.print("Ndewo Ụwa!", {line:1,column:1,offset:0});\n');
  });

  it("executes the generated JavaScript", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    executeJavaScript(compile('bipụta("Ndewo Ụwa!")'));
    expect(log).toHaveBeenCalledWith("Ndewo Ụwa!");
    log.mockRestore();
  });

  it("compiles declarations, reassignment, and Unicode names safely", () => {
    expect(compile('class = "Uche"\nafọ = 36\nclass = afọ\nbipụta(class)')).toBe(
      'let _kwe0 = "Uche";\nlet _kwe1 = 36;\n_kwe0 = _kwe1;\n_kweRuntime.print(_kwe0, {line:4,column:1,offset:36});\n',
    );
  });

  it("compiles astral letters as identifiers and keeps UTF-16 source coordinates", () => {
    expect(compile("\u{10400} = 1\nbipụta(\u{10400})")).toBe(
      "let _kwe0 = 1;\n_kweRuntime.print(_kwe0, {line:2,column:1,offset:7});\n",
    );
  });

  it("rejects a variable read before its first assignment", () => {
    expect(() => compile('bipụta(aha)', "variables.kwe")).toThrow(
      /variables\.kwe:1:8: KWE-SEM-001: Enweghị ike ịchọta mgbanwe "aha"/,
    );
  });

  it("does not make a variable visible within its first assignment", () => {
    expect(() => compile("aha = aha", "variables.kwe")).toThrow(
      /variables\.kwe:1:7: KWE-SEM-001: Enweghị ike ịchọta mgbanwe "aha"/,
    );
  });

  it("honors grouping, precedence, and unary minus", () => {
    expect(compile("nsonaazụ = (10 + 20) * 2 - -5\nbipụta(nsonaazụ)")).toBe(
      "let _kwe0 = (((10 + 20) * 2) - (-5));\n_kweRuntime.print(_kwe0, {line:2,column:1,offset:30});\n",
    );
  });

  it("rejects strings in arithmetic expressions", () => {
    expect(() => compile('aha = "Uche"\nbipụta(aha + 1)', "expressions.kwe")).toThrow(
      /expressions\.kwe:2:12: KWE-SEM-017: Akara "\+" chọrọ ọnụọgụ abụọ/,
    );
  });

  it("emits an explicit division-by-zero guard", () => {
    const javaScript = compile("bipụta(10 / 0)");
    expect(javaScript).toContain("_kweRuntime.divide(10, 0, {line:1,column:11,offset:10})");
    expect(() => executeJavaScript(javaScript)).toThrow(/Division by zero/);
  });

  it("compiles strict comparisons and conditional branches", () => {
    const source = 'afọ = 36\nọ bụrụ (afọ >= 18) { ọkwa = "Okenye" } ọzọ { ọkwa = "Nwatakịrị" }\nbipụta(ọkwa)';
    expect(compile(source)).toBe(
      'let _kwe0 = 36;\nlet _kwe1;\nif ((_kwe0 >= 18)) {\n  _kwe1 = "Okenye";\n} else {\n  _kwe1 = "Nwatakịrị";\n}\n_kweRuntime.print(_kwe1, {line:3,column:1,offset:75});\n',
    );
  });

  it("requires a boolean condition", () => {
    expect(() => compile('ọ bụrụ (1) { bipụta("mba") }', "conditions.kwe")).toThrow(
      /conditions\.kwe:1:9: KWE-SEM-028: Ọnọdụ ga-abụ eziokwu maọbụ ụgha/,
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
    expect(compile('bipụta(1 == "1")')).toBe('_kweRuntime.print((1 === "1"), {line:1,column:1,offset:0});\n');
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

  it("executes kwụsị at the nearest enclosing loop", () => {
    const source = [
      "outer = 0",
      "hits = 0",
      "mgbe (outer < 3) {",
      "  outer = outer + 1",
      "  inner = 0",
      "  mgbe (inner < 3) {",
      "    inner = inner + 1",
      "    hits = hits + 1",
      "    ọ bụrụ (inner == 1) { kwụsị }",
      "  }",
      "}",
      "bipụta(outer)",
      "bipụta(hits)",
    ].join("\n");
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    executeJavaScript(compile(source));
    expect(log.mock.calls.map(([value]) => value)).toEqual([3, 3]);
    log.mockRestore();
  });

  it("executes simple unconditional break and continue statements", () => {
    const source = [
      "breakCount = 0",
      "mgbe (eziokwu) { breakCount = breakCount + 1 kwụsị }",
      "continueCount = 0",
      "mgbe (continueCount < 3) { continueCount = continueCount + 1 gaa n'ihu }",
      "bipụta(breakCount)",
      "bipụta(continueCount)",
    ].join("\n");
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    executeJavaScript(compile(source));
    expect(log.mock.calls.map(([value]) => value)).toEqual([1, 3]);
    log.mockRestore();
  });

  it("executes gaa n'ihu at the nearest enclosing loop", () => {
    const source = [
      "outer = 0",
      "hits = 0",
      "mgbe (outer < 2) {",
      "  outer = outer + 1",
      "  inner = 0",
      "  mgbe (inner < 3) {",
      "    inner = inner + 1",
      "    ọ bụrụ (inner == 2) { gaa n'ihu }",
      "    hits = hits + 1",
      "  }",
      "}",
      "bipụta(outer)",
      "bipụta(hits)",
    ].join("\n");
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    executeJavaScript(compile(source));
    expect(log.mock.calls.map(([value]) => value)).toEqual([2, 4]);
    log.mockRestore();
  });

  it("rejects loop control outside loops with located diagnostics", () => {
    expect(() => compile("kwụsị", "control.kwe")).toThrow(/control\.kwe:1:1:.*Loop control is only valid inside a loop/);
    expect(() => compile("gaa n'ihu", "control.kwe")).toThrow(/control\.kwe:1:1:.*Loop control is only valid inside a loop/);
    expect(() => compile("ọrụ f() { kwụsị }", "control.kwe")).toThrow(/Loop control is only valid inside a loop/);
  });

  it("rejects malformed multiword continue syntax", () => {
    expect(() => compile("gaa bipụta(1)", "control.kwe")).toThrow(/Expected "gaa n'ihu"/);
    expect(() => compile("gaa", "control.kwe")).toThrow(/Expected "n'ihu" after "gaa"/);
  });

  it("rejects unreachable same-block statements after loop control", () => {
    expect(() => compile('mgbe (eziokwu) { kwụsị bipụta("never") }', "control.kwe")).toThrow(
      /Unreachable statement after control transfer/,
    );
    expect(() => compile('mgbe (eziokwu) { gaa n\'ihu bipụta("never") }', "control.kwe")).toThrow(
      /Unreachable statement after control transfer/,
    );
  });

  it("keeps statements reachable after conditional loop control", () => {
    expect(() => compile('x = 0\nmgbe (x < 2) { x = x + 1 ọ bụrụ (x == 1) { kwụsị } bipụta("reachable") }')).not.toThrow();
    expect(() => compile('x = 0\nmgbe (x < 2) { x = x + 1 ọ bụrụ (x == 1) { gaa n\'ihu } bipụta("reachable") }')).not.toThrow();
  });

  it("keeps laghachi distinct from nearest-loop control", () => {
    const source = [
      "ọrụ find() {",
      "  outer = 0",
      "  mgbe (outer < 2) {",
      "    outer = outer + 1",
      "    inner = 0",
      "    mgbe (inner < 2) { inner = inner + 1 laghachi 7 }",
      "  }",
      "  laghachi 0",
      "}",
      "bipụta(find())",
    ].join("\n");
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    executeJavaScript(compile(source));
    expect(log).toHaveBeenCalledWith(7);
    log.mockRestore();
  });

  it("rejects loop-carried type changes", () => {
    expect(() => compile('uru = 1\nmgbe (ụgha) { uru = "otu" }', "loops.kwe")).toThrow(
      /Ụdị mgbanwe "uru" ga-anọ otu n'ime `mgbe`/,
    );
  });

  it("compiles a declared function and call with safe names", () => {
    const source = "ọrụ gbakọọ(a, b) { laghachi a + b }\nnsonaazụ = gbakọọ(10, 20)\nbipụta(nsonaazụ)";
    expect(compile(source)).toBe(
      "function _kweFn0(_kweP0_0, _kweP0_1) {\n  return (_kweP0_0 + _kweP0_1);\n}\nlet _kwe0 = _kweFn0(10, 20);\n_kweRuntime.print(_kwe0, {line:3,column:1,offset:62});\n",
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
    expect(() => compile("ọrụ gbakọọ(a, b) { laghachi a + b }\nbipụta(gbakọọ(1, 2, 3))", "functions.kwe")).toThrow(
      /Wrong argument count/,
    );
  });

  it("rejects captures of program variables", () => {
    expect(() => compile("uru = 10\nọrụ nweta() { laghachi uru }\nbipụta(nweta())", "functions.kwe")).toThrow(
      /Undefined variable/,
    );
  });

  it("rejects concrete returns mixed with implicit fallthrough absence", () => {
    expect(() => compile("ọrụ họrọ(x) { ọ bụrụ (x > 0) { laghachi x } }\nbipụta(họrọ(1))", "functions.kwe")).toThrow(
      /Return type conflicts with fallthrough absence/,
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

  it("eagerly rejects type-independent errors in uncalled functions", () => {
    expect(() => compile("ọrụ nwalee() { laghachi amaghi }", "functions.kwe")).toThrow(/Undefined variable/);
    expect(() => compile("ọrụ kpọọ() { laghachi kpọọ() }", "functions.kwe")).toThrow(/Recursion akwadoghị/);
    expect(() => compile("ọrụ nwalee(x, x) { laghachi x }", "functions.kwe")).toThrow(/Duplicate parameter/);
    expect(() => compile("ọrụ mbụ() { laghachi 1 }\nọrụ abụọ() { laghachi mbụ(1) }", "functions.kwe")).toThrow(
      /Wrong argument count/,
    );
  });

  it("requires every function declaration to be at module top level", () => {
    expect(() => compile("ọrụ elu() { ọrụ ime() { laghachi 1 } laghachi 1 }", "functions.kwe")).toThrow(
      /Functions must be declared at module top level/,
    );
    expect(() => compile("ọ bụrụ (eziokwu) { ọrụ ime() { laghachi 1 } }", "functions.kwe")).toThrow(
      /Functions must be declared at module top level/,
    );
    expect(() => compile("mgbe (ụgha) { ọrụ ime() { laghachi 1 } }", "functions.kwe")).toThrow(
      /Functions must be declared at module top level/,
    );
  });

  it("rejects unreachable same-block statements after laghachi", () => {
    expect(() => compile('ọrụ nwalee() { laghachi 1 bipụta("never") }', "functions.kwe")).toThrow(
      /Unreachable statement after return/,
    );
    expect(() => compile("ọrụ nwalee(x) { ọ bụrụ (x) { laghachi 1 } ọzọ { laghachi 2 } laghachi 3 }", "functions.kwe")).toThrow(
      /Unreachable statement after return/,
    );
    expect(() => compile('ọrụ nwalee(x) { ọ bụrụ (x) { laghachi efu } bipụta("reachable") }\nbipụta(nwalee(eziokwu))')).not.toThrow();
  });

  it("establishes one inferred parameter signature per function", () => {
    expect(() => compile('ọrụ identity(x) { laghachi x }\na = identity(1)\nb = identity("otu")', "functions.kwe")).toThrow(
      /Function calls must use one parameter signature/,
    );
    expect(() => compile("ọrụ mbụ(x) { laghachi x[0] }\na = mbụ([1])\nb = mbụ([2, 3])")).not.toThrow();
  });

  it("keeps function scope isolated while allowing module-name reuse", () => {
    const source = "uru = 10\nọrụ nwalee(uru) { nkeọzọ = uru + 1 laghachi nkeọzọ }\nbipụta(nwalee(20))\nbipụta(uru)";
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    executeJavaScript(compile(source));
    expect(log.mock.calls.map(([value]) => value)).toEqual([21, 10]);
    log.mockRestore();
    expect(() => compile("uru = 10\nọrụ nwalee() { laghachi uru }", "functions.kwe")).toThrow(/Undefined variable/);
  });

  it("keeps first-class functions and default parameters unsupported", () => {
    expect(() => compile("ọrụ nye() { laghachi nye }", "functions.kwe")).toThrow(/Undefined variable/);
    expect(() => compile('ọrụ kelee(aha = "Enyi") { laghachi aha }', "functions.kwe")).toThrow();
  });

  it("compiles arrays, objects, indexing, and property access", () => {
    const source = 'ahaNdị = ["Uche", "Ada"]\nmmadụ = { aha: ahaNdị[0], afọ: 36 }\nbipụta(mmadụ.aha)';
    const output = compile(source);
    expect(output).toContain('let _kwe0 = ["Uche", "Ada"];');
    expect(output).toContain('let _kwe1 = {"aha": _kweRuntime.index(_kwe0, 0, {line:2,column:22,offset:46}), "afọ": 36};');
    expect(output).toContain('_kweRuntime.print(_kwe1["aha"]');
  });

  it("rejects heterogeneous and empty arrays", () => {
    expect(() => compile('a = [1, "abụọ"]')).toThrow(/Array elements must share a type/);
    expect(() => compile("a = []")).toThrow(/Empty arrays are not yet supported/);
  });

  it("rejects known out-of-range indexes and missing properties", () => {
    expect(() => compile("a = [1, 2]\nbipụta(a[2])")).toThrow(/Array index out of range/);
    expect(() => compile("a = [1, 2]\nbipụta(a[-1])")).toThrow(/Array index out of range/);
    expect(() => compile("a = [1, 2]\nbipụta(a[0.5])")).toThrow(/Array index out of range/);
    expect(() => compile('a = { aha: "Uche" }\nbipụta(a.afọ)')).toThrow(/Missing property/);
  });

  it("rejects collection equality", () => {
    expect(() => compile("a = [1]\nb = [1]\nbipụta(a == b)")).toThrow(/Collection equality is not yet supported/);
    expect(() => compile("a = { x: 1 }\nbipụta(a != a)")).toThrow(/Collection equality is not yet supported/);
  });

  it("guards dynamic indexes at runtime", () => {
    const javaScript = compile("a = [1, 2]\ni = 3\nbipụta(a[i])");
    expect(() => executeJavaScript(javaScript)).toThrow(/Array index out of range/);
  });

  it("emits collection formatting support for nested print statements", () => {
    const javaScript = compile("a = [1, 2]\nọ bụrụ (eziokwu) { bipụta(a) }");
    expect(javaScript).toContain("_kweRuntime.print(_kwe0");
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    executeJavaScript(javaScript);
    expect(log).toHaveBeenCalledWith("[1,2]");
    log.mockRestore();
  });

  it("types arrays by recursive element type rather than length", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    executeJavaScript(compile("a = [[1], [2, 3], [4, 5, 6]]\nbipụta(a)"));
    expect(log).toHaveBeenCalledWith("[[1],[2,3],[4,5,6]]");
    log.mockRestore();
    expect(() => compile('a = [[1], ["abụọ", "atọ"]]')).toThrow(/Array elements must share a type/);
  });

  it("keeps known lengths for static bounds checks without making length a type", () => {
    expect(() => compile("a = [1]\nb = a\nbipụta(b[1])")).toThrow(/Array index out of range/);
    expect(() => compile("ọ bụrụ (eziokwu) { a = [1] } ọzọ { a = [2, 3] }\nbipụta(a[0])")).not.toThrow();
  });

  it("mutates an existing array index through shared aliases", () => {
    const source = "a = [1, 2]\nb = a\nb[0] = 10\nbipụta(a)";
    const javaScript = compile(source);
    expect(javaScript).toContain("_kweRuntime.setIndex(_kwe1, 0, 10");
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    executeJavaScript(javaScript);
    expect(log).toHaveBeenCalledWith("[10,2]");
    log.mockRestore();
  });

  it("enforces array mutation target, index, bounds, and element type", () => {
    expect(() => compile("a = 1\na[0] = 2")).toThrow(/Index assignment requires an array/);
    expect(() => compile('a = [1]\na["0"] = 2')).toThrow(/Array index must be a number/);
    expect(() => compile("a = [1]\na[-1] = 2")).toThrow(/Array index out of range/);
    expect(() => compile("a = [1]\na[0.5] = 2")).toThrow(/Array index out of range/);
    expect(() => compile("a = [1]\na[1] = 2")).toThrow(/Array index out of range/);
    expect(() => compile('a = [1]\na[0] = "otu"')).toThrow(/must match the array element type/);
    expect(() => compile("a = [1]\na[0] = efu")).toThrow(/must match the array element type/);
  });

  it("guards dynamic array mutation indexes at runtime", () => {
    for (const index of ["-1", "0.5", "2"]) {
      expect(() => executeJavaScript(compile(`a = [1, 2]\ni = ${index}\na[i] = 3`))).toThrow(/Array index out of range/);
    }
  });

  it("mutates existing object properties through aliases without changing shape or type", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    executeJavaScript(compile('a = { aha: "Uche", nested: { afọ: 36 } }\nb = a\nb.aha = "Ada"\nb.nested.afọ = 37\nbipụta(a)'));
    expect(log).toHaveBeenCalledWith('{"aha":"Ada","nested":{"afọ":37}}');
    log.mockRestore();
    expect(() => compile('a = { aha: "Uche" }\na.afọ = 36')).toThrow(/Missing property/);
    expect(() => compile('a = { aha: "Uche" }\na.aha = 1')).toThrow(/must match the property type/);
    expect(() => compile('a = { aha: "Uche" }\na.aha = efu')).toThrow(/must match the property type/);
    expect(() => compile("a = 1\na.aha = 2")).toThrow(/Property assignment requires an object/);
  });

  it("preserves collection references through function parameters and returns", () => {
    const source = [
      "ọrụ gbanwee(x) { x[0] = 7 laghachi x }",
      "a = [1, 2]",
      "b = gbanwee(a)",
      "b[1] = 8",
      "bipụta(a)",
    ].join("\n");
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    executeJavaScript(compile(source));
    expect(log).toHaveBeenCalledWith("[7,8]");
    log.mockRestore();
  });

  it("accepts different array lengths through the same element-typed function signature", () => {
    const source = [
      "ọrụ mbụ(x) { laghachi x[0] }",
      "bipụta(mbụ([1]))",
      "bipụta(mbụ([2, 3]))",
    ].join("\n");
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    executeJavaScript(compile(source));
    expect(log.mock.calls.map(([value]) => value)).toEqual([1, 2]);
    log.mockRestore();
  });

  it("preserves object identity through function parameters and returns", () => {
    const source = [
      "ọrụ nye(x) { laghachi x }",
      'a = { aha: "Uche" }',
      "b = nye(a)",
      'b.aha = "Ada"',
      "bipụta(a)",
    ].join("\n");
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    executeJavaScript(compile(source));
    expect(log).toHaveBeenCalledWith('{"aha":"Ada"}');
    log.mockRestore();
  });

  it("supports empty fixed-shape objects without treating them as dictionaries", () => {
    expect(() => compile("a = {}\nbipụta(a.missing)")).toThrow(/Missing property/);
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    executeJavaScript(compile("bipụta({})"));
    expect(log).toHaveBeenCalledWith("{}");
    log.mockRestore();
  });

  it("rejects NFC-equivalent duplicate and reserved object properties", () => {
    const decomposed = "ụbọchị".normalize("NFD");
    expect(() => compile(`a = { ụbọchị: 1, ${decomposed}: 2 }`)).toThrow(/Duplicate object property/);
    for (const property of ["efu", "maọbụ", "bụghị"]) expect(() => compile(`a = { ${property}: 1 }`)).toThrow();
  });

  it("uses the exact compact Kwechiri collection display format", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    executeJavaScript(compile('bipụta({ flags: [eziokwu, ụgha], absent: efu, text: "Ada\\nObi" })'));
    expect(log).toHaveBeenCalledWith('{"flags":[eziokwu,ụgha],"absent":efu,"text":"Ada\\nObi"}');
    log.mockRestore();
  });

  it("executes comments, decoded escapes, and canonically equivalent variable names", () => {
    const assigned = "ụbọchị".normalize("NFD");
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    executeJavaScript(compile(`${assigned} = "Mọnde\\nỤtụtụ"// nkọwa\nbipụta(ụbọchị)`));
    expect(log).toHaveBeenCalledWith("Mọnde\nỤtụtụ");
    log.mockRestore();
  });

  it("uses NFC identity for functions and object properties", () => {
    const functionName = "gbakọọ".normalize("NFD");
    const propertyName = "ụbọchị".normalize("NFD");
    expect(() => compile(`ọrụ ${functionName}(x) { laghachi x }\no = { ${propertyName}: 1 }\nbipụta(gbakọọ(o.ụbọchị))`)).not.toThrow();
  });

  it("rejects canonically duplicate function declarations but preserves case distinctions", () => {
    const decomposed = "họrọ".normalize("NFD");
    expect(() => compile(`ọrụ họrọ() { laghachi 1 }\nọrụ ${decomposed}() { laghachi 2 }`)).toThrow(/Duplicate function/);
    expect(() => compile("Aha = 1\naha = 2\nbipụta(Aha + aha)")).not.toThrow();
  });

  it("parses efu as an explicit absence literal", () => {
    const program = parse(tokenize("bipụta(efu)"));
    expect(program.statements[0]).toMatchObject({ kind: "PrintStatement", value: { kind: "AbsenceLiteral" } });
  });

  it("prints booleans and efu using Kwechiri vocabulary", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    executeJavaScript(compile("bipụta(eziokwu)\nbipụta(ụgha)\nbipụta(efu)"));
    expect(log.mock.calls.map(([value]) => value)).toEqual(["eziokwu", "ụgha", "efu"]);
    log.mockRestore();
  });

  it("supports efu assignment and strict equality with primitive values", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    executeJavaScript(compile('x = efu\nbipụta(x == efu)\nbipụta(efu != efu)\nbipụta(1 == efu)\nbipụta("x" != efu)'));
    expect(log.mock.calls.map(([value]) => value)).toEqual(["eziokwu", "ụgha", "ụgha", "eziokwu"]);
    log.mockRestore();
  });

  it("rejects arithmetic, ordering, conditions, and logical operations with efu", () => {
    expect(() => compile("bipụta(efu + 1)")).toThrow(/Arithmetic requires two numbers/);
    expect(() => compile("bipụta(efu < 1)")).toThrow(/Ordering requires two numbers/);
    expect(() => compile("ọ bụrụ (efu) { bipụta(1) }")).toThrow(/condition must be boolean/i);
    expect(() => compile("bipụta(efu na eziokwu)")).toThrow(/requires two booleans/);
    expect(() => compile("bipụta(eziokwu maọbụ efu)")).toThrow(/requires two booleans/);
    expect(() => compile("bipụta(ọ bụghị efu)")).toThrow(/requires a boolean/);
  });

  it("returns efu from function fallthrough and supports explicit laghachi efu", () => {
    const source = 'ọrụ meeIhe() { bipụta("Ndewo") }\nọrụ nyeEfu() { laghachi efu }\nbipụta(meeIhe())\nbipụta(nyeEfu())';
    const javaScript = compile(source);
    expect(javaScript).toContain("return null;");
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    executeJavaScript(javaScript);
    expect(log.mock.calls.map(([value]) => value)).toEqual(["Ndewo", "efu", "efu"]);
    log.mockRestore();
  });

  it("rejects concrete return values mixed with fallthrough efu", () => {
    expect(() => compile("ọrụ nwalee(x) { ọ bụrụ (x) { laghachi 10 } }\nbipụta(nwalee(eziokwu))")).toThrow(
      /Return type conflicts with fallthrough absence/,
    );
  });

  it("supports homogeneous efu arrays and explicit efu object properties", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    executeJavaScript(compile("a = [efu, efu]\no = { uru: efu, ezi: eziokwu }\nbipụta(a)\nbipụta(o)"));
    expect(log.mock.calls.map(([value]) => value)).toEqual(["[efu,efu]", '{"uru":efu,"ezi":eziokwu}']);
    log.mockRestore();
    expect(() => compile("a = [efu, 1]")).toThrow(/Array elements must share a type/);
    expect(() => compile("o = { uru: efu }\nbipụta(o.aha)")).toThrow(/Missing property/);
  });

  it("implements complete Boolean truth tables for na and maọbụ", () => {
    const source = [
      "bipụta(eziokwu na eziokwu)", "bipụta(eziokwu na ụgha)",
      "bipụta(ụgha na eziokwu)", "bipụta(ụgha na ụgha)",
      "bipụta(eziokwu maọbụ eziokwu)", "bipụta(eziokwu maọbụ ụgha)",
      "bipụta(ụgha maọbụ eziokwu)", "bipụta(ụgha maọbụ ụgha)",
    ].join("\n");
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    executeJavaScript(compile(source));
    expect(log.mock.calls.map(([value]) => value)).toEqual([
      "eziokwu", "ụgha", "ụgha", "ụgha", "eziokwu", "eziokwu", "eziokwu", "ụgha",
    ]);
    log.mockRestore();
  });

  it("requires Boolean operands for na, maọbụ, and ọ bụghị with located diagnostics", () => {
    expect(() => compile("bipụta(5 na eziokwu)", "logic.kwe")).toThrow(/logic\.kwe:1:10:.*requires two booleans/);
    expect(() => compile('bipụta("Ndewo" maọbụ eziokwu)', "logic.kwe")).toThrow(/requires two booleans/);
    expect(() => compile("bipụta(ọ bụghị 10)", "logic.kwe")).toThrow(/logic\.kwe:1:8:.*requires a boolean/);
  });

  it("short-circuits logical expressions left-to-right", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    expect(() => executeJavaScript(compile("bipụta(ụgha na (10 / 0 == 1))"))).not.toThrow();
    expect(() => executeJavaScript(compile("bipụta(eziokwu maọbụ (10 / 0 == 1))"))).not.toThrow();
    expect(() => executeJavaScript(compile("bipụta(eziokwu na (10 / 0 == 1))"))).toThrow(/Division by zero/);
    expect(() => executeJavaScript(compile("bipụta(ụgha maọbụ (10 / 0 == 1))"))).toThrow(/Division by zero/);
    log.mockRestore();
  });

  it("implements right-associated negation and approved logical precedence", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    executeJavaScript(compile("bipụta(ọ bụghị eziokwu maọbụ eziokwu na ụgha)\nbipụta(ọ bụghị (eziokwu maọbụ eziokwu) na ụgha)\nbipụta(ọ bụghị ọ bụghị eziokwu)"));
    expect(log.mock.calls.map(([value]) => value)).toEqual(["ụgha", "ụgha", "eziokwu"]);
    log.mockRestore();
  });

  it("separates ordering and equality precedence without permitting same-tier chains", () => {
    expect(compile("bipụta(1 < 2 == eziokwu)")).toContain("((1 < 2) === true)");
    expect(() => compile("bipụta(1 < 2 < 3)")).toThrow(/Ordering comparison chaining is unsupported/);
    expect(() => compile("bipụta(1 == 1 != ụgha)")).toThrow(/Equality chaining is unsupported/);
  });

  it("parses na and maọbụ with left associativity", () => {
    const program = parse(tokenize("bipụta(eziokwu na ụgha na eziokwu maọbụ ụgha maọbụ eziokwu)"));
    expect(program.statements[0]).toMatchObject({
      value: {
        kind: "LogicalExpression",
        operator: "maọbụ",
        left: { kind: "LogicalExpression", operator: "maọbụ", left: { kind: "LogicalExpression", operator: "na" } },
      },
    });
  });

  it("rejects malformed negation and reserved vocabulary as assignment names", () => {
    expect(() => compile("bipụta(ọ eziokwu)", "logic.kwe")).toThrow(/Expected "ọ bụghị"/);
    for (const name of ["efu", "maọbụ", "bụghị"]) expect(() => compile(`${name} = 1`)).toThrow();
  });
});
