import { describe, expect, it } from "vitest";
import { DiagnosticCodes } from "../../src/errors/diagnostic-catalog.js";
import { KwechiriError } from "../../src/errors/kwechiri-error.js";
import {
  compilerProblemFromError,
  diagnosticFileName,
} from "../../extensions/vscode/src/diagnostics.js";

describe("VS Code diagnostics", () => {
  it("converts a located Kwechiri error without duplicating its location prefix", () => {
    const error = new KwechiriError(
      DiagnosticCodes.SemanticUndefinedVariable,
      "Aha amaghị. (Undefined variable.)",
      { line: 3, column: 7, offset: 24 },
      "C:\\ọrụ\\mmemme.kwe",
    );

    expect(compilerProblemFromError(error, "fallback.kwe")).toEqual({
      fileName: "C:\\ọrụ\\mmemme.kwe",
      line: 3,
      column: 7,
      code: DiagnosticCodes.SemanticUndefinedVariable,
      message: "Aha amaghị. (Undefined variable.)",
    });
  });

  it("uses the entry filename when a compiler error has no filename", () => {
    const error = new KwechiriError(DiagnosticCodes.SyntaxExpectedExpression, "Emehiere syntax. (Syntax error.)", {
      line: 1,
      column: 4,
      offset: 3,
    });

    expect(compilerProblemFromError(error, "entry.kwe")).toMatchObject({
      fileName: "entry.kwe",
      line: 1,
      column: 4,
    });
  });

  it("does not present host failures as located language diagnostics", () => {
    expect(compilerProblemFromError(new Error("host failure"), "entry.kwe")).toBeUndefined();
  });

  it("falls back to the entry file when an imported target does not exist", () => {
    const problem = {
      fileName: "C:\\ọrụ\\missing.kwe",
      line: 1,
      column: 1,
      code: DiagnosticCodes.ModuleMissing,
      message: "Missing imported module.",
    };

    expect(diagnosticFileName(problem, "C:\\ọrụ\\main.kwe", false)).toBe("C:\\ọrụ\\main.kwe");
    expect(diagnosticFileName(problem, "C:\\ọrụ\\main.kwe", true)).toBe("C:\\ọrụ\\missing.kwe");
  });
});
