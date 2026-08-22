import { Script } from "node:vm";

export function executeJavaScript(javaScript: string, fileName = "<kwechiri>"): void {
  const isolatedProgram = `(function () {\n${javaScript}\n})();`;
  new Script(isolatedProgram, { filename: fileName }).runInThisContext();
}
