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
      "let _kwe0 = (((10 + 20) * 2) - (-5));\n_kweRuntime.print(_kwe0, {line:2,column:1,offset:30});\n",
    );
  });

  it("rejects strings in arithmetic expressions", () => {
    expect(() => compile('aha = "Uche"\nbipụta(aha + 1)', "expressions.kwe")).toThrow(
      /expressions\.kwe:2:12: Akara "\+" chọrọ ọnụọgụ abụọ/,
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
    expect(javaScript).toContain("_kweRuntime.print(_kwe0");
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    executeJavaScript(javaScript);
    expect(log).toHaveBeenCalledWith("[1,2]");
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
