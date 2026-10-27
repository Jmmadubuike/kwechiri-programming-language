import { compileWithStandardBindings } from "./compile.js";
import { loadModuleGraphForCompiler } from "../modules/loader.js";

export async function compileFile(filePath: string): Promise<string> {
  const graph = await loadModuleGraphForCompiler(filePath);
  return compileWithStandardBindings(graph.source, filePath, graph.standardBindings);
}
