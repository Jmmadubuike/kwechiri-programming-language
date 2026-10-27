import { Script } from "node:vm";
import type { KwechiriRuntime } from "./kwechiri-runtime.js";
import { NodeKwechiriRuntime } from "./node-runtime.js";
import { standardLibrary, type KwechiriStandardLibrary } from "../standard-library/standard-library.js";

export function executeJavaScript(
  javaScript: string,
  fileName = "<kwechiri>",
  runtime: KwechiriRuntime = new NodeKwechiriRuntime(fileName),
): void {
  const isolatedProgram = `(function (_kweRuntime, _kweStandardLibrary) {\n${javaScript}\n})`;
  const executable = new Script(isolatedProgram, { filename: fileName }).runInThisContext() as (
    runtime: KwechiriRuntime,
    library: KwechiriStandardLibrary,
  ) => void;
  executable(runtime, standardLibrary);
}
