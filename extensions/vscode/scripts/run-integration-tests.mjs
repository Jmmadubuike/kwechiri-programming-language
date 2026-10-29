import { fileURLToPath } from "node:url";
import { runTests } from "@vscode/test-electron";

for (const variable of [
  "ELECTRON_RUN_AS_NODE",
  "VSCODE_CODE_CACHE_PATH",
  "VSCODE_CRASH_REPORTER_PROCESS_TYPE",
  "VSCODE_CWD",
  "VSCODE_ESM_ENTRYPOINT",
  "VSCODE_HANDLES_UNCAUGHT_ERRORS",
  "VSCODE_IPC_HOOK",
  "VSCODE_NLS_CONFIG",
  "VSCODE_NODE_COMPILE_CACHE_KIND",
  "VSCODE_NODE_COMPILE_CACHE_ROOT",
  "VSCODE_PID",
]) {
  delete process.env[variable];
}

const extensionDevelopmentPath = fileURLToPath(new URL("../", import.meta.url));
const extensionTestsPath = fileURLToPath(new URL("../out/integration.js", import.meta.url));
const configuredExecutable = process.env.VSCODE_EXECUTABLE_PATH;
const testVersion = process.env.VSCODE_TEST_VERSION ?? "1.100.0";

const options = {
  extensionDevelopmentPath,
  extensionTestsPath,
  launchArgs: [],
};

if (configuredExecutable !== undefined) {
  await runTests({ ...options, vscodeExecutablePath: configuredExecutable });
} else {
  await runTests({ ...options, version: testVersion });
}
