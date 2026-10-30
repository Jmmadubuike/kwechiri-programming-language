import { readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  DiagnosticCodes,
  diagnosticCodePattern,
  type DiagnosticCode,
} from "../../src/errors/diagnostic-catalog.js";
import { KwechiriError } from "../../src/errors/kwechiri-error.js";
import { KwechiriRuntimeError } from "../../src/runtime/kwechiri-runtime.js";

const codeNames = Object.keys(DiagnosticCodes) as (keyof typeof DiagnosticCodes)[];
const codes = Object.values(DiagnosticCodes) as DiagnosticCode[];

const sourceFiles = (directory: string): string[] => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const path = join(directory, entry.name);
  if (entry.isDirectory()) return sourceFiles(path);
  return entry.isFile() && entry.name.endsWith(".ts") ? [path] : [];
});

describe("diagnostic catalog", () => {
  it("defines unique, stage-based public codes", () => {
    expect(new Set(codes).size).toBe(codes.length);
    for (const code of codes) expect(code).toMatch(diagnosticCodePattern);
  });

  it("documents every public code", () => {
    const catalog = readFileSync(resolve("docs/language-spec/error-catalog.md"), "utf8");
    for (const code of codes) expect(catalog).toContain(`\`${code}\``);
  });

  it("uses every catalog entry outside the catalog definition", () => {
    const source = sourceFiles(resolve("src"))
      .filter((file) => !file.endsWith("diagnostic-catalog.ts"))
      .map((file) => readFileSync(file, "utf8"))
      .join("\n");
    for (const name of codeNames) expect(source).toContain(`DiagnosticCodes.${name}`);
  });

  it("formats located errors with the code before the message", () => {
    const error = new KwechiriError(
      DiagnosticCodes.SemanticUndefinedVariable,
      "Aha amaghị. (Undefined variable.)",
      { line: 3, column: 7, offset: 24 },
      "mmemme.kwe",
    );
    expect(error.message).toBe("mmemme.kwe:3:7: KWE-SEM-001: Aha amaghị. (Undefined variable.)");
    expect(error.code).toBe(DiagnosticCodes.SemanticUndefinedVariable);
  });

  it("maps runtime categories to stable runtime codes", () => {
    const location = { line: 1, column: 2, offset: 1 };
    const division = new KwechiriRuntimeError("divide", "DIVISION_BY_ZERO", location, "run.kwe");
    const index = new KwechiriRuntimeError("index", "INDEX_OUT_OF_RANGE", location, "run.kwe");
    expect(division.code).toBe(DiagnosticCodes.RuntimeDivisionByZero);
    expect(index.code).toBe(DiagnosticCodes.RuntimeIndexOutOfRange);
  });
});
