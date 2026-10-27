import { generateJavaScript } from "./code-generator.js";
import { tokenize } from "../lexer/lexer.js";
import { parse } from "../parser/parser.js";
import { analyze } from "../semantic/analyze.js";
import type { StandardExportDefinition } from "../standard-library/catalog.js";

export function compile(source: string, fileName?: string): string {
  const program = parse(tokenize(source, fileName), fileName);
  return generateJavaScript(analyze(program, fileName));
}

export function compileWithStandardBindings(
  source: string,
  fileName: string,
  standardBindings: ReadonlyMap<string, StandardExportDefinition>,
): string {
  const program = parse(tokenize(source, fileName), fileName);
  return generateJavaScript(analyze(program, fileName, standardBindings));
}
