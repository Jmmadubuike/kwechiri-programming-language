import { readFile, realpath, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { compileFile } from "../compiler/compile-file.js";
import { executeJavaScript } from "../runtime/execute.js";
import { CliUsageError, type CliRequest } from "./arguments.js";

export interface CommandDependencies {
  readonly compileFile: typeof compileFile;
  readonly executeJavaScript: typeof executeJavaScript;
  readonly writeFile: typeof writeFile;
  readonly readFile: typeof readFile;
  readonly realpath: typeof realpath;
}

export const defaultCommandDependencies: CommandDependencies = {
  compileFile,
  executeJavaScript,
  writeFile,
  readFile,
  realpath,
};

const globalHelp = `Kwechiri programming language

Usage:
  kwechiri <file.kwe>
  kwechiri run <file.kwe>
  kwechiri check <file.kwe>
  kwechiri compile <file.kwe> [--out <file.js>] [--force]
  kwechiri --help
  kwechiri --version`;

const commandHelp: Readonly<Record<"run" | "check" | "compile", string>> = {
  run: "Usage: kwechiri run <file.kwe>\nCompile and execute a Kwechiri program.",
  check: "Usage: kwechiri check <file.kwe>\nValidate a Kwechiri program without executing it.",
  compile: "Usage: kwechiri compile <file.kwe> [--out <file.js>] [--force]\nCompile a Kwechiri program to directly runnable JavaScript.",
};

const packageUrl = new URL("../../package.json", import.meta.url);
const runtimeUrl = new URL("../runtime/execute.js", import.meta.url);
const runtimeErrorUrl = new URL("../runtime/kwechiri-runtime.js", import.meta.url);

export const defaultOutputPath = (sourcePath: string): string => `${sourcePath.slice(0, -".kwe".length)}.js`;

const isMissingPathError = (error: unknown): boolean =>
  error instanceof Error && "code" in error && error.code === "ENOENT";

async function pathsReferToSameFile(
  sourcePath: string,
  outputPath: string,
  dependencies: CommandDependencies,
): Promise<boolean> {
  if (sourcePath === outputPath) return true;
  const canonicalSource = await dependencies.realpath(sourcePath);
  try {
    return canonicalSource === await dependencies.realpath(outputPath);
  } catch (error: unknown) {
    if (isMissingPathError(error)) return false;
    throw error;
  }
}

export function createRunnableJavaScript(javaScript: string, sourcePath: string): string {
  return `#!/usr/bin/env node
import { executeJavaScript } from ${JSON.stringify(runtimeUrl.href)};
import { KwechiriRuntimeError } from ${JSON.stringify(runtimeErrorUrl.href)};

try {
  executeJavaScript(${JSON.stringify(javaScript)}, ${JSON.stringify(sourcePath)});
} catch (error) {
  if (error instanceof KwechiriRuntimeError) {
    console.error(\`KWECHIRI ERROR\\n\${error.message}\`);
    process.exitCode = 1;
  } else {
    const detail = error instanceof Error ? error.message : "An unknown value was thrown.";
    console.error(\`KWECHIRI INTERNAL ERROR\\nAn unexpected internal Kwechiri failure occurred.\\n\${detail}\`);
    process.exitCode = 4;
  }
}
`;
}

async function packageVersion(dependencies: CommandDependencies): Promise<string> {
  const packageJson = JSON.parse(await dependencies.readFile(packageUrl, "utf8")) as { version?: unknown };
  if (typeof packageJson.version !== "string") throw new Error("Kwechiri package version is unavailable.");
  return packageJson.version;
}

export async function executeRequest(
  request: CliRequest,
  writeOutput: (value: string) => void,
  dependencies: CommandDependencies = defaultCommandDependencies,
): Promise<void> {
  if (request.kind === "help") {
    writeOutput(request.command === undefined ? globalHelp : commandHelp[request.command]);
    return;
  }
  if (request.kind === "version") {
    writeOutput(await packageVersion(dependencies));
    return;
  }

  const absoluteSource = resolve(request.sourcePath);
  const javaScript = await dependencies.compileFile(absoluteSource);
  if (request.kind === "run") {
    dependencies.executeJavaScript(javaScript, request.sourcePath);
    return;
  }
  if (request.kind === "check") return;

  const outputPath = resolve(request.outputPath ?? defaultOutputPath(request.sourcePath));
  if (await pathsReferToSameFile(absoluteSource, outputPath, dependencies)) {
    throw new CliUsageError("Compiled output must not resolve to the source file.");
  }
  const artifact = createRunnableJavaScript(javaScript, request.sourcePath);
  await dependencies.writeFile(outputPath, artifact, { encoding: "utf8", flag: request.force ? "w" : "wx" });
}
