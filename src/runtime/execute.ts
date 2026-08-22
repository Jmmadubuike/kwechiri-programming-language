import { Script } from "node:vm";
import type { KwechiriRuntime } from "./kwechiri-runtime.js";
import { NodeKwechiriRuntime } from "./node-runtime.js";

export function executeJavaScript(
  javaScript: string,
  fileName = "<kwechiri>",
  runtime: KwechiriRuntime = new NodeKwechiriRuntime(fileName),
): void {
  const isolatedProgram = `(function (_kweRuntime) {\n${javaScript}\n})`;
  const executable = new Script(isolatedProgram, { filename: fileName }).runInThisContext() as (runtime: KwechiriRuntime) => void;
  executable(runtime);
}
