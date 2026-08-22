import { KwechiriError } from "../errors/kwechiri-error.js";
import { KwechiriRuntimeError } from "../runtime/kwechiri-runtime.js";
import { CliUsageError, parseArguments } from "./arguments.js";
import { defaultCommandDependencies, executeRequest, type CommandDependencies } from "./commands.js";
import { ExitCode, type ExitCode as ExitCodeValue } from "./exit-codes.js";

export interface CliIo {
  readonly stdout: (value: string) => void;
  readonly stderr: (value: string) => void;
}

const defaultIo: CliIo = {
  stdout: console.log,
  stderr: console.error,
};

const fileSystemErrorCodes = new Set([
  "EACCES",
  "EBUSY",
  "EEXIST",
  "EISDIR",
  "EMFILE",
  "ENAMETOOLONG",
  "ENFILE",
  "ENOENT",
  "ENOSPC",
  "ENOTDIR",
  "EPERM",
  "EROFS",
]);

const isFileSystemError = (error: Error): error is NodeJS.ErrnoException =>
  "code" in error && typeof error.code === "string" && fileSystemErrorCodes.has(error.code);

export async function runCli(
  arguments_: readonly string[],
  io: CliIo = defaultIo,
  dependencies: CommandDependencies = defaultCommandDependencies,
): Promise<ExitCodeValue> {
  try {
    await executeRequest(parseArguments(arguments_), io.stdout, dependencies);
    return ExitCode.Success;
  } catch (error: unknown) {
    if (error instanceof CliUsageError) {
      io.stderr(`KWECHIRI USAGE ERROR\n${error.message}`);
      return ExitCode.InvalidUsage;
    }
    if (error instanceof KwechiriError || error instanceof KwechiriRuntimeError) {
      io.stderr(`KWECHIRI ERROR\n${error.message}`);
      return ExitCode.KwechiriDiagnostic;
    }
    if (error instanceof Error && isFileSystemError(error)) {
      io.stderr(`KWECHIRI FILESYSTEM ERROR\n${error.message}`);
      return ExitCode.FileSystemFailure;
    }
    const detail = error instanceof Error ? error.message : "An unknown value was thrown.";
    io.stderr(`KWECHIRI INTERNAL ERROR\nAn unexpected internal Kwechiri failure occurred.\n${detail}`);
    return ExitCode.InternalFailure;
  }
}
