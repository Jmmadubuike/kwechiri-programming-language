import { generateJavaScript } from "./code-generator.js";
import { tokenize } from "../lexer/lexer.js";
import { parse } from "../parser/parser.js";

export function compile(source: string, fileName?: string): string {
  return generateJavaScript(parse(tokenize(source, fileName), fileName));
}
