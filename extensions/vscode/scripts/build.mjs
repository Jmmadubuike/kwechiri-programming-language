import { rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const outputDirectory = fileURLToPath(new URL("../dist/", import.meta.url));

await rm(outputDirectory, { recursive: true, force: true });
await build({
  entryPoints: [fileURLToPath(new URL("../src/extension.ts", import.meta.url))],
  outfile: fileURLToPath(new URL("../dist/extension.js", import.meta.url)),
  bundle: true,
  external: ["vscode"],
  format: "cjs",
  logLevel: "info",
  platform: "node",
  sourcemap: true,
  target: "node20",
});
