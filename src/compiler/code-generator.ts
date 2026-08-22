import type { Program } from "../ast/nodes.js";

export function generateJavaScript(program: Program): string {
  const lines = program.statements.map(
    (statement) => `console.log(${JSON.stringify(statement.value.value)});`,
  );
  return `${lines.join("\n")}\n`;
}
