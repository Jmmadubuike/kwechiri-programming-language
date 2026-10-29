import { fileURLToPath } from "node:url";
import { build } from "esbuild";

await build({
  entryPoints: [fileURLToPath(new URL("../src/test/integration.test.ts", import.meta.url))],
  outfile: fileURLToPath(new URL("../out/integration.js", import.meta.url)),
  bundle: true,
  external: ["vscode"],
  format: "cjs",
  logLevel: "info",
  platform: "node",
  sourcemap: true,
  target: "node20",
});
