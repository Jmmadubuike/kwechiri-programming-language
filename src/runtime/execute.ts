import { Script } from "node:vm";

export function executeJavaScript(javaScript: string, fileName = "<kwechiri>"): void {
  new Script(javaScript, { filename: fileName }).runInThisContext();
}
