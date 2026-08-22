import { compile } from "./compile.js";
import { loadModuleGraph } from "../modules/loader.js";

export async function compileFile(filePath: string): Promise<string> {
  return compile(await loadModuleGraph(filePath), filePath);
}
